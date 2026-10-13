# Netlify inquiry rate-limit review

The shared `quote` endpoint now uses Netlify's modern default-exported Request/Response entry. The public URL remains `/.netlify/functions/quote`, with 5 requests per 60 seconds aggregated by IP and domain. Validation completed locally, and the user subsequently authorized publishing the source to `factory-website`. Source publication does not establish deployment or edge enforcement; live HTTP 429 has not been observed.

## Cause and official evidence

The current function exported a legacy `handler`. An exported `config` object and explicit path did not change how Netlify classified that entry. Netlify's maintained bundler parses the named configuration for API v2 only when there is a default export and no named `handler` export. The v1 branch does not extract the inline rate-limit configuration.

Official sources inspected on 2026-10-12:

- [Netlify's current function configuration parser](https://github.com/netlify/build/blob/8448500fa1dc9fa2bf3a8ddabb052887d772ab96/packages/zip-it-and-ship-it/src/runtimes/node/in_source_config/index.ts): `isV2API = handlerExports.length === 0 && hasDefaultExport`; the modern branch reads `config`, while the legacy branch starts with an empty config.
- [Traffic-rule manifest generation](https://github.com/netlify/build/blob/8448500fa1dc9fa2bf3a8ddabb052887d772ab96/packages/zip-it-and-ship-it/src/runtimes/node/index.ts): the recognized rate limit becomes `trafficRules`.
- [Netlify's official rate-limit fixture](https://github.com/netlify/build/blob/8448500fa1dc9fa2bf3a8ddabb052887d772ab96/packages/zip-it-and-ship-it/tests/fixtures/ratelimit/netlify/functions/ratelimit.ts): default Request/Response export with named `config` and `aggregateBy: ["ip", "domain"]`.
- [Official rate-limiting documentation](https://ntl.fyi/rate-limiting-code) and [function configuration documentation](https://docs.netlify.com/build/functions/optional-configuration/): direct access was blocked by the environment proxy, so their current text could not be read. The maintained official source, fixture and published bundler were used as independently checked compatibility evidence. No conclusion about the site's plan eligibility is based on inaccessible documentation.

The root config correctly selects `frontend`, the existing function directory, Node 24 and the production build. No deployment-path or dependency change was needed. Absence of a rate-limit line in the supplied **post-processing** excerpt alone would not establish whether the rule was registered.

## Reproduced build evidence

The actual source was bundled before and after the change with published `@netlify/zip-it-and-ship-it` 16.3.0. This tool was installed outside the repository with the existing 24-hour release-age policy, allowed build scripts, checksum verification and a frozen lockfile. No application dependency or repository lockfile was added/changed.

| Property | Before: legacy entry | After: modern entry |
| --- | --- | --- |
| `buildData.runtimeAPIVersion` | `1` | `2` |
| Explicit endpoint route | Absent from generated metadata | `/.netlify/functions/quote` |
| `trafficRules` | Absent | `rate_limit`, sliding window, limit 5, window 60, keys `ip` and `domain` |

The compiled `netlify/functions/quote.mjs` retains the default export and named `config`, with no named `handler`. It was loaded directly from the extracted archive and returned 400 for empty JSON and 405/Allow: POST for GET without provider calls. Extraction must preserve the packaged pnpm symlinks, as standard `unzip` does. Netlify's generated Lambda bootstrap has its own `handler`; that platform-generated wrapper is expected and does not make the source a legacy entry. Modern Netlify bundling chooses its supported NFT/ESM bootstrap even with the existing esbuild preference in the config.

Repeat the local metadata check with an installed copy of Netlify's bundler:

```sh
cd frontend
NETLIFY_BUNDLER_MODULE=/absolute/path/to/node_modules/@netlify/zip-it-and-ship-it/dist/main.js \
  node scripts/verify-netlify-function.mjs
```

The script bundles the real function, checks the generated manifest and retains the archive/manifest in a temporary directory. It makes no email calls and prints the manifest location. The tested tool is available in this task at `/tmp/hissus-netlify-rate-tooling/node_modules/@netlify/zip-it-and-ship-it/dist/main.js`; a future environment must supply its own installed copy. This is an optional tool check, not a new production dependency.

## Preserved behavior and local tests

The existing inquiry core, schema, origin rules, templates, subjects, Resend calls and logging remain intact. A small modern adapter bounds buffered input to 16 KiB and cancels oversized Request streams, then passes the request into that core and converts its response to a native Response. HTTP methods still reach the core's 405/Allow response; the Netlify route is intentionally not restricted to POST in metadata.

```sh
cd frontend
pnpm build
pnpm lint
pnpm check-locales
pnpm test:inquiry
```

All 16 inquiry tests pass. They cover actual default-export discovery/configuration, empty and malformed input, unsupported methods, byte/stream limits, invalid origins, request IDs, and identical team/customer mail from both businesses in both languages with stub senders. Provider failures and optional-confirmation partial success remain truthful. All eight generated email templates, the preview selector and subject manifest remain byte-identical to their tracked versions. No Resend API was called.

Production preview checks also passed: 269 browser checks and six CSP pages with zero violations. External player/thumbnail/mail responses are stubbed. These verify the existing frontend remains compatible, not real delivery or Netlify edge enforcement.

## Production verification

There is no Netlify account/deployment connection in this task. No live rule registration or enforcement is claimed.

1. Publish the reviewed changes from `factory-website` using your normal workflow. Confirm the new deploy's Git revision includes the modern default export; the older `d48f899` path-only commit does not fix discovery. Open the **new** deploy or published main URL.
2. Inspect that deploy's Functions bundling output/artifacts for `quote`, API version 2 and the expected traffic rule shown above. Check any rate-limit warnings or eligibility errors. If Netlify's logs/artifacts do not expose rule registration, ask Netlify Support to confirm the rule was registered for this specific deploy before running the burst. Post-processing success alone is insufficient evidence.
3. Once registration is confirmed, allow at least 60 seconds without requests from your IP to this endpoint on the chosen hostname. Open Developer Tools → Console on that site's page and run the following **once**. It sends at most eight sequential empty submissions and stops as soon as it sees 429 or an unexpected status. Empty submissions cannot reach Resend.

```js
const statuses = [];
for (let attempt = 1; attempt <= 8; attempt++) {
  const response = await fetch('/.netlify/functions/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
    cache: 'no-store',
    redirect: 'error',
  });
  statuses.push(response.status);
  console.log(attempt, response.status);
  if (response.status === 429) break;
  if (response.status !== 400) {
    console.warn('Unexpected response; stopping.', await response.text());
    break;
  }
}
console.log('HTTP 429 observed:', statuses.includes(429));
```

Expect validation errors (400) until requests exceed the window, then an edge 429. Other traffic from the same IP can change which request is blocked. The application's request ID may be absent on an edge-generated 429. Record the deploy revision, hostname, time and status sequence. If no 429 appears, enforcement remains unverified: stop, review deployment warnings/registration and contact Netlify rather than increasing the request count. Wait at least 60 seconds before a real form submission. Do not repeat bursts across hosts or IPs.

## Remaining limits

This rule limits the shared factory/window endpoint by IP/domain; changing the submitted email does not reset the key. Rotating IPs and hostnames can use other buckets. Turnstile, a global shared email cap and automatic spike alerts are still absent. Resend's own provider quotas are separate from this endpoint rule, and each accepted inquiry can send two messages. This fix does not establish protection against every spam campaign or volumetric DDoS attack.

## Emergency sending pause (2026-10-12)

The reported bounce pattern is consistent with automated form abuse; it does not establish the source of requests, a key compromise or deployed edge enforcement. Requests below five per minute per IP can still pass the declared limit. Origin headers can be spoofed by non-browser clients. Neither these checks nor the honeypot verifies a human or ownership of a submitted email address.

The function now supports `INQUIRY_EMAIL_ENABLED`. With the setting absent, existing delivery behavior is preserved. When present, only `true` (case-insensitive, trimmed) enables sending; `false` or an invalid value pauses both forms before any Resend call. Paused valid requests return HTTP 503 / `UNAVAILABLE` with the existing localized form feedback and a request ID; the function never claims a paused inquiry reached the team. Logs contain the fixed `sending_disabled` reason and request ID, without submitted contact data.

To pause after deploying this revision, set `INQUIRY_EMAIL_ENABLED=false` in Netlify for the Functions scope and relevant deploy contexts, then redeploy. Environment changes do not rewrite already published function bundles or old deploy permalinks. For an immediate stop across every deployment using an existing sending key, revoke that key in Resend. Legitimate form email stops too. Configure a replacement only after the desired protections are deployed and tested; keep keys in Netlify and never commit them or send them in chat.

This switch is an emergency control, not a bot filter. Server-verified Turnstile and a shared global email budget remain outstanding; the user is choosing whether to add Turnstile or use Netlify-only protections. No dashboard settings or live provider calls were made. Seventeen stubbed inquiry tests cover the new pause path and existing sending behavior; local tests do not prove the production switch is enabled.
