# Inquiry email review

The factory and window forms share the Netlify `quote` function and Resend integration. No live email was sent during this review.

The implementation is configured to send from **HISSUS <quotes@hissus.com>**. Team notifications go to **hiss.usatx@gmail.com**, unless the server variable `QUOTE_RECIPIENT_EMAIL` overrides it. The customer copy goes to the email entered in the form. Team messages set Reply-To to the visitor; customer messages set Reply-To to the team inbox.

| Business | Team receives | Client receives |
| --- | --- | --- |
| Factory | “New Facility Inquiry”, with name/company name, email, phone, inquiry subject and message | “We've Received Your Inquiry”, a short acknowledgement and the same submitted details |
| Windows | “HISS US - New Quote Request”, with name, email, phone, city, readable product name and message | “We've Received Your Request”, a short acknowledgement and the same quote details |

Both use a navy header, white body, striped details table, separate message block, and a muted footer. English and Traditional Chinese follow the submitted form's language. Line breaks in messages are preserved after HTML escaping. Factory emails now use facility-specific wording throughout. There are no em dashes.

## See the actual templates

Open [the preview selector](email-previews/index.html) in a browser after cloning the repository. These files are rendered from the actual handler with sample data and a stubbed sender. They are documentation, outside the published application.

| Preview | English | Traditional Chinese |
| --- | --- | --- |
| Factory, team | [View](email-previews/facility-team-en.html) | [View](email-previews/facility-team-zh-TW.html) |
| Factory, client | [View](email-previews/facility-client-en.html) | [View](email-previews/facility-client-zh-TW.html) |
| Windows, team | [View](email-previews/screen-team-en.html) | [View](email-previews/screen-team-zh-TW.html) |
| Windows, client | [View](email-previews/screen-client-en.html) | [View](email-previews/screen-client-zh-TW.html) |

Subjects, sender, recipients and reply addresses are in [manifest.json](email-previews/manifest.json). Regenerate after template changes:

```sh
cd frontend
node scripts/preview-inquiry-emails.mjs
```

Eight previews were rendered and checked at 900px and 390px for overflow, language and copy. Screenshots were visually reviewed. Browser rendering does not establish compatibility with every email client.

## Netlify and Resend readiness

Code inspection and the bundled handler tests verify the server-side Resend call, input validation, separate form payloads, both destinations, and truthful failure/partial-success responses. The Netlify config publishes `dist` and bundles `netlify/functions`. Forms post to `/.netlify/functions/quote`. The key stays server-side and is not exposed through `VITE_*`.

`RESEND_API_KEY` is absent from this workspace. No local environment file or injected Netlify credential is present. The live Netlify and Resend account settings were not accessible, so this review cannot establish that the API key is the only missing deployment step.

For sending on the existing Netlify site:

1. Confirm its base directory is `frontend`, with the repository-root `netlify.toml` active, build command `pnpm build`, publish directory `dist`, and functions directory `netlify/functions`.
2. In Resend, verify the `hissus.com` domain and its required DNS records so `quotes@hissus.com` can send to real visitors.
3. Add an authorized sending key as **RESEND_API_KEY** to the site's server-side Functions environment for the relevant deploy context, then redeploy. `QUOTE_RECIPIENT_EMAIL` is optional because the inbox already has a default.
4. Once authorized to send real messages, submit one controlled factory inquiry and one window quote. Confirm team receipt, customer confirmation, and replies reaching the right inbox. Verify these on the deployed site, not plain Vite development.

If site settings and sender-domain verification are already complete, the key and redeploy are the remaining steps. The key alone cannot prove delivery without checking those prerequisites. No dashboard, DNS, key, deployment or inbox was changed here.

A plain `pnpm dev` runs Vite and does not run Netlify Functions. Use Netlify's development workflow with a server-only local `.env.local` for local mail testing, or the deployed site. Do not commit real credentials or paste them in chat.

## Manual testing after the route update

Open `/factory/contact` for a facility inquiry and `/windows/quote` for a screen quote (prepend `/tw` for Traditional Chinese). Factory and window emails use the same HTML shell; factory admin headings now include HISSUS branding and customer badges use their own confirmation subject, matching the window structure. The fields remain specific to each business. Preview files were regenerated from the actual handler without sending messages.

The supplied Resend credential was not copied into tracked files, documentation, previews, logs, or frontend code. No Netlify account binding is available in this workspace, so it was not installed in the live site. Add it securely as `RESEND_API_KEY` in the site's Functions environment for the deployment you will test, and redeploy. Sender-domain verification is still required. Plain Vite development remains insufficient for a real mail submission; use the Netlify development workflow or the deployed site.

## Deployment build configuration

The repository-root `netlify.toml` now declares `base = "frontend"`, `command = "pnpm build"`, `publish = "dist"`, and `functions = "netlify/functions"`. Netlify can discover this file even when the dashboard initially points at the repository root. It retains redirects, CSP/security headers, asset caching, and function bundling from the original frontend config. The build uses Node 24 and the frontend pins the tested pnpm 11.25.0 version.

The supplied failed deployment log ran `pnpm dev` in `/opt/build/repo`, found no configuration file, and published root `dist`. That root package has no dev script. Dashboard settings should agree with the root file: base `frontend`, build `pnpm build`, publish `dist`, functions `netlify/functions`. `pnpm dev` is a local server command and is not a production build.

The log lists `RESEND_API_KEY` and `QUOTE_RECIPIENT_EMAIL` as configured environment variable names. Their values, scopes, provider permissions and actual delivery were not verified; this build failure occurs before the function runs. Deploy the branch containing the new root config, then inspect the next build's resolved settings before testing mail.

## Diagnosing a failed submission

Inspect the **POST** to `/.netlify/functions/quote` in the browser's Network tab. Opening that endpoint in the address bar sends GET and correctly returns 405; use the contact or quote form to test sending.

| HTTP status and response code | Meaning and next check |
| --- | --- |
| 403 `ORIGIN_DENIED` | The website origin is outside the function's allowlist. It includes hissus.com/www and the exact server-configured `URL`, `DEPLOY_PRIME_URL`, and `DEPLOY_URL`. Deploy permalinks are now included, with no wildcard for other Netlify sites. |
| 405 `METHOD_NOT_ALLOWED` | The endpoint accepts POST. Inspect the actual form request rather than a direct browser GET. |
| 503 `UNAVAILABLE` | The function cannot read a nonempty `RESEND_API_KEY`. Check the Functions scope and deploy context, then redeploy. |
| 502 `SEND_FAILED` | The team notification failed. In Netlify's `quote` function logs, match the response's `requestId` to the failure entry. |

Failures include a request ID in the JSON response and `X-Request-ID` header. Logs contain fixed categories such as `sender_domain_unverified`, `api_key_rejected`, `sending_access_denied`, `provider_rate_limited`, `provider_quota_exceeded`, or `mail_timeout`, plus a recognized provider code/status when available. They omit raw provider messages, credentials, and submitted fields. A failed customer confirmation is logged separately after team receipt; the form still reports team receipt to avoid duplicate inquiries.

The supplied Resend key screenshot shows sending access restricted to hissus.com, matching `quotes@hissus.com`. It does not establish that the domain is verified. A rejected origin occurs before Resend is called, so adding a key does not resolve that rejection.

After deploying this fix, test the **newest deployment** or the main site address. An older deploy permalink remains tied to its old code. Twelve bundled-handler checks cover the supplied permalink, unrelated-origin rejection, method errors, safe diagnostics, and existing sending behavior with a stubbed sender. Real delivery remains unverified here; the environment proxy blocked a read-only request to the public deploy URL, so that attempt did not measure the site's response.
