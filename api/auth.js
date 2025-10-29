const crypto = require('crypto');

/**
 * Vercel Serverless Function: /api/auth
 * Starts the GitHub OAuth flow for Decap CMS using an external OAuth app.
 *
 * Required env:
 * - GITHUB_CLIENT_ID
 */
module.exports = async (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Missing env var: GITHUB_CLIENT_ID');
  }

  // Determine our public base URL (accounting for proxies)
  const proto = (req.headers['x-forwarded-proto'] || 'https').toString().split(',')[0];
  const host = req.headers.host;
  const redirectUri = `${proto}://${host}/api/callback`;

  // Create CSRF state and store it in a cookie
  const state = crypto.randomBytes(16).toString('hex');
  const cookie = [
    `oauth_state=${state}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Max-Age=600', // 10 minutes
  ].join('; ');

  // Build GitHub OAuth authorize URL
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'repo');
  authUrl.searchParams.set('state', state);

  res.writeHead(302, {
    Location: authUrl.toString(),
    'Set-Cookie': cookie,
    'Cache-Control': 'no-store',
  });
  res.end();
};
