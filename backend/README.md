# Enable hosted writing for Humanize.top

GitHub Pages continues to host the frontend at **https://humanize.top**. The separate `humanize-text` Cloudflare Worker runs Workers AI and serves `POST /generate`. No API key belongs in the frontend or in `NEXT_PUBLIC_WRITING_API`.

The Worker supports the Humanizer, paraphraser, grammar correction, summarization, translation, text generators and chat. Submitted text and recent chat context go to Cloudflare. Chat history stays in page memory. The interface accepts up to 12,000 input characters per request.

## 1. Deploy from your Cloudflare account

Use Node.js 24 and pnpm 11.25.0. Check out the PR branch to deploy before merging, or update `main` after merging this PR. In the repository root:

```sh
pnpm install --frozen-lockfile
pnpm exec wrangler login
pnpm exec wrangler whoami
pnpm exec wrangler deploy --config backend/wrangler.jsonc
```

Complete Wrangler's sign-in in your own browser using the Cloudflare account that should own the Worker. If you have multiple accounts, select the intended account when prompted. If Wrangler cannot choose an account, set `CLOUDFLARE_ACCOUNT_ID` to that account's ID before deploying. Do not share API tokens or passwords in chat or commit them.

Deployment creates or updates `humanize-text` with these bindings:

- `AI`: Cloudflare Workers AI, using `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.
- `LIMIT`: 5 requests per minute per visitor IP, per Cloudflare location.

If Cloudflare asks you to enable Workers AI or accept account terms, complete that step in your own account. Check the current allowance and billing settings before enabling public traffic. CORS restricts browsers to `https://humanize.top` and `https://www.humanize.top`; it is not authentication or a global spending cap.

Copy the actual HTTPS `workers.dev` URL printed by Wrangler. If the account has not enabled its workers.dev subdomain, complete that setup in Cloudflare's Workers & Pages settings. Append `/generate` to the deployed address. Do not use the illustrative address below literally:

```text
https://humanize-text.YOUR-SUBDOMAIN.workers.dev/generate
```

## 2. Check the deployed API

Replace the example address with your deployed URL:

```sh
curl --fail-with-body 'https://humanize-text.YOUR-SUBDOMAIN.workers.dev/generate' \
  -H 'Origin: https://humanize.top' \
  -H 'Content-Type: application/json' \
  --data '{"prompt":"Rewrite naturally. Preserve names, numbers and facts. Return only the revised text: Mira delivered 17 reports on Friday in order to help the team."}'
```

Expected: HTTP 200 and JSON containing a nonempty `text` value. Review that it retains Mira, 17 reports, and Friday. Opening the endpoint in a browser address bar is not a valid API test: it sends a GET without the required Origin header.

## 3. Configure the GitHub Actions repository variable

In **Socialmania99/humanize-top**:

1. Open **Settings → Secrets and variables → Actions → Variables**.
2. Under **Repository variables**, create or edit `NEXT_PUBLIC_WRITING_API`.
3. Set its value to the full HTTPS Worker URL ending in `/generate`. This is a public endpoint URL, not a secret or API key.
4. If the `github-pages` environment already has a variable with the same name, remove the stale duplicate or update it to match: an environment variable can override the repository value.

The Pages workflow reads `${{ vars.NEXT_PUBLIC_WRITING_API }}` during `next build`. Changing a variable does not update an existing static deployment; a new build is required.

## 4. Merge and rebuild the frontend

1. Review and merge the writing update PR. PR checks build and test without publishing.
2. Keep **Settings → Pages → Source = GitHub Actions**, **Custom domain = humanize.top**, and **Enforce HTTPS** enabled. No DNS or hosting migration is needed.
3. The merge triggers **Actions → Publish Humanize.top**. If you set the variable after that build started, use **Run workflow → main** after saving it.
4. Wait for the build and deployment to succeed, then reload https://humanize.top/tools/ai-humanizer/.

The frontend keeps GitHub Pages' configured base path. It is empty for the custom domain. A GitHub project URL alone is not an allowed Worker origin; test hosted generation on the custom domain.

## 5. Verify a real rewrite on the live Humanizer

1. Confirm the page says **Submitting sends your text to the hosted AI service.** If it says on-device AI, rebuild after checking the variable.
2. Enter `Mira delivered 17 reports on Friday in order to help the team.` and click **Rewrite text**.
3. In the browser Network panel, verify `POST` to your Worker `/generate` returns **200** and JSON text matching the displayed result. Check names, numbers and meaning manually.
4. Change the input to `Ravi delivered 23 reports on Monday in order to help the team.` and submit again. Confirm the new result reflects the new facts.
5. Test **Copy result**, **Download text**, cancellation, and a follow-up on the AI Chat page.

The **Simplify common phrases locally** button is a deterministic phrase editor. It is not evidence of a successful AI request. Local API tests use mock AI bindings and likewise do not prove production inference.

Share only the public `/generate` URL after deployment so a real rewrite can be verified on humanize.top.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| 403 | Use the custom domain; verify the exact Origin. The Worker accepts the apex and www HTTPS origins only. |
| 400 / 413 | Shorten the input; requests must contain a nonempty JSON `prompt` of at most 24,000 characters and a body of at most 100,000 bytes. |
| 429 | Wait a minute. The limit is 5 requests per minute per IP per Cloudflare location. |
| 503 | Check the Workers AI binding, model availability, account quota and Cloudflare status. Use `pnpm exec wrangler tail --config backend/wrangler.jsonc` for Worker errors. |
| Browser network error | Check the full HTTPS endpoint, `/generate` path, Worker deployment, and CORS origin. |
| On-device message after configuring the URL | Confirm the repository variable and any environment override, then rerun the Pages workflow on `main`. |

Without the repository variable, supported browsers can use the browser Prompt API. This can require compatible hardware, a secure context and an initial model download. Other browsers show a service-unavailable message. File, image, originality and account services remain separate integrations.

## Local checks

Run from the repository root:

```sh
node --test backend/worker.test.mjs components/product/plain-edit.test.mjs
pnpm exec wrangler deploy --dry-run --config backend/wrangler.jsonc
STATIC_PAGES=1 pnpm exec next build
```

A dry run validates the bundle and configuration; it does not deploy or verify your Cloudflare account. Production deployment and a live rewrite remain separate checks.
