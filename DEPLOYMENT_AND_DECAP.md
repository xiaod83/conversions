Deployment & Decap CMS quick start

These steps make the project easy to import into Vercel and to use Decap (Netlify) CMS for content editing.

1) Vercel import
   - On Vercel, choose "Import Project" and connect your GitHub account.
   - Select the `conversions` repository and accept defaults. The repo is a static site, so no build is required; Vercel will serve the files from the `main` branch.
   - If you want a build hook, add a `vercel-build` script in `package.json` (already present) and Vercel will run it during deploy.

2) Admin (Decap CMS)
   - The repo includes a simple admin UI at `/admin/index.html` and a sample config at `/admin/config.yml`.
   - Replace the `repo` field in `admin/config.yml` with your `owner/repo` and configure an OAuth App or auth proxy so Decap can commit to the repository.
   - On Vercel, add any required environment variables and register a GitHub OAuth App (Settings → Developer settings → OAuth Apps). Use the OAuth app client id/secret with an auth proxy or follow the Decap docs for hosting on Vercel.

3) Quick notes about Decap CMS setup
   - The admin page loads Decap CMS from a CDN (see `/admin/index.html`). If you prefer to pin a release, replace `@latest` with a specific version.
   - If you want Decap CMS to edit files directly without an external auth proxy, you can use a Git Gateway or a small OAuth proxy; see Decap CMS docs for recommended approaches.

4) Publish to npm (optional)
   - The repo has `package.json` updated with name `conversions` and basic scripts.
   - To publish to npm: increment the version in `package.json`, then run `npm publish` (you must own the package name on npm). Alternatively, use GitHub Packages if you prefer.

5) Where to go next
   - Register a GitHub OAuth App for commits from the browser or set up an auth proxy.
   - Pin the Decap CDN to a specific version in `/admin/index.html`.
   - (Optional) Add CI to run link checks or a small build step if you introduce a static site generator.

If you'd like, I can:
 - register a sample GitHub OAuth app configuration in the repo (safely using environment variable placeholders),
 - pin a Decap CMS version,
 - or wire a simple OAuth proxy example for Vercel — tell me which you'd prefer.


## GitHub OAuth on Vercel (for Decap CMS)

This repo includes a minimal OAuth proxy for Decap CMS using Vercel Serverless Functions.

Endpoints:
- `/api/auth` — starts the GitHub OAuth flow
- `/api/callback` — exchanges `code` for a token and returns it to Decap CMS

Environment variables (set in Vercel Project → Settings → Environment Variables):
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

GitHub OAuth App (Settings → Developer settings → OAuth Apps):
- Homepage URL: `https://<your-vercel-domain>`
- Authorization callback URL: `https://<your-vercel-domain>/api/callback`

Decap CMS config (`admin/config.yml`):

```yaml
backend:
   name: github
   repo: <owner>/<repo>
   base_url: https://<your-vercel-domain>
   auth_endpoint: api/auth
```

After deploying:
1) Open `https://<your-vercel-domain>/admin`
2) Click “Login with GitHub” — you should be sent to `github.com`, not `api.netlify.com`
3) Approve OAuth and you’ll be redirected to `/api/callback`, which will close the popup and log you in
