const https = require('https');

/**
 * Exchange the GitHub OAuth code for an access token and return it to Decap CMS.
 * Route: /api/callback
 *
 * Required env:
 * - GITHUB_CLIENT_ID
 * - GITHUB_CLIENT_SECRET
 */
module.exports = async (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Missing env vars: GITHUB_CLIENT_ID and/or GITHUB_CLIENT_SECRET');
  }

  // Parse query params
  const url = new URL(req.url, `http://${req.headers.host}`);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  // Validate state from cookie
  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
  const savedState = cookies['oauth_state'];

  if (!code || !state || !savedState || state !== savedState) {
    return sendResult(res, 'error', { message: 'Invalid OAuth state/code' });
  }

  // Build redirect_uri exactly as in /api/auth
  const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0];
  const host = req.headers.host;
  const redirectUri = `${proto}://${host}/api/callback`;

  try {
    const tokenResp = await exchangeCodeForToken({ clientId, clientSecret, code, redirectUri, state });

    if (!tokenResp || !tokenResp.access_token) {
      return sendResult(res, 'error', {
        message: 'Token exchange failed',
        details: tokenResp || null,
      });
    }

    // Success: pass token back to Decap CMS opener window
    return sendResult(req, res, 'success', { token: tokenResp.access_token });
  } catch (err) {
    return sendResult(req, res, 'error', { message: 'OAuth error', details: String(err) });
  }
};

function exchangeCodeForToken({ clientId, clientSecret, code, redirectUri, state }) {
  const payload = JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
    state,
  });

  const options = {
    method: 'POST',
    host: 'github.com',
    path: '/login/oauth/access_token',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (resp) => {
      let body = '';
      resp.on('data', (d) => (body += d));
      resp.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Failed to parse GitHub token response'));
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function sendResult(req, res, status, payload) {
  const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0];
  const host = req.headers.host;
  const origin = `${proto}://${host}`;
  const msg = `authorization:github:${status}:${JSON.stringify(payload)}`;

  // expire oauth_state cookie to avoid reuse
  const expireCookie = [
    'oauth_state=',
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Max-Age=0',
  ].join('; ');

  const html = `<!doctype html><html><head><meta charset=\"utf-8\" /></head><body>
  <p>Authentication ${status}. You can close this window.</p>
  <script>
    (function() {
      var msg = ${JSON.stringify(msg)};
      var origin = ${JSON.stringify(origin)};
      try { if (window.opener) { window.opener.postMessage(msg, origin); } } catch (e) {}
      try { if (window.opener) { window.opener.postMessage(msg, '*'); } } catch (e) {}
      // Fallback: if opener missing (Safari/blocked), navigate back to admin
      setTimeout(function(){
        try { window.close(); } catch (e) {}
        try { if (!window.opener) { window.location.replace(origin + '/admin/#/'); } } catch (e) {}
      }, 100);
    })();
  </script></body></html>`;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Set-Cookie', expireCookie);
  res.end(html);
}
