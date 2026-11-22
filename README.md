# Humanize.top

Humanize.top is an AI writing and productivity project for students, creators, and professionals. Its tools are designed to help users rewrite AI-generated text in a more natural voice, paraphrase drafts, check grammar, summarize long passages, and create content. The catalog also covers research, citations, PDFs, images, audio, and everyday utilities.

## Features and availability

| Feature | Current status |
| --- | --- |
| Tool discovery | Browse 141 tool pages, search by keyword, and filter by category or audience. |
| Writing and editing | Explore the AI Humanizer, paraphraser, grammar checker, summarizer, and content generators. Text editing and copy or TXT download work where provided. AI results are sample outputs. |
| Research and originality | Explore AI search, citation generation, AI detection, and plagiarism checking. Live results require service integrations. |
| Documents, images, and audio | Explore PDF tools, OCR, image generation, transcription, and text-to-speech. Uploads and processing require service integrations. |
| Everyday utilities | Copy a zero-width space directly in the browser. QR code generation is planned. |

User accounts, subscriptions, browser extensions, and native apps are planned. The current release runs without API keys or a database.

## Run locally

Use Node.js 24 LTS and the repository's pinned pnpm version, 11.25.0. Open a terminal in the folder containing `package.json`, then run:

```sh
npm install --global pnpm@11.25.0
pnpm install --frozen-lockfile
pnpm exec next dev
```

Open [http://localhost:3000](http://localhost:3000). Try the [tool catalog](http://localhost:3000/tools) or the [AI Humanizer](http://localhost:3000/tools/ai-humanizer).

To check the production Next.js build, run:

```sh
pnpm exec next build
```

## Deploy to GitHub Pages

1. Put the project files at the root of your GitHub repository. Check that `package.json`, `pnpm-lock.yaml`, and `.github/workflows/pages.yml` are present.
2. Open **Settings → Pages** and choose **GitHub Actions** under **Build and deployment → Source**.
3. On the **Actions** tab, open **Publish Humanize.top blueprint** and select **Run workflow**, or push a commit to `main`.
4. After deployment succeeds, open the published URL from **Settings → Pages**. A typical project URL is `https://YOUR-GITHUB-USERNAME.github.io/humanize-top/`.

The workflow builds a static site in `out/` and sets the URL prefix used by links and assets. GitHub Pages hosts the browser experience. Live AI, file processing, and accounts require backend services on a server-capable host.

[GitHub Pages publishing documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Project structure

The GitHub Pages build uses Next.js App Router, React, TypeScript, Tailwind CSS, and pnpm.

| Path | Purpose |
| --- | --- |
| [`app/`](app/) | Home page, tool directory, individual tool routes, and apps page. |
| [`components/product/humanize.tsx`](components/product/humanize.tsx) | Navigation, catalog filters, and tool workspaces. |
| [`data/tools.json`](data/tools.json) | Tool names, slugs, descriptions, categories, and supported features. |
| [`app/globals.css`](app/globals.css) | Shared styles and responsive layouts. |
| [`next.config.ts`](next.config.ts) | Next.js configuration and static export settings. |
| [`.github/workflows/pages.yml`](.github/workflows/pages.yml) | GitHub Pages build and deployment workflow. |

## Report an issue or contribute

Open a GitHub issue with the tool name or URL, steps to reproduce the problem, and what you expected to happen. For code changes, create a branch, verify the affected tool locally, run `pnpm exec next build`, and open a pull request. Keep API keys, `.env` files, and private user content out of issues and commits.

## License

This repository has no project-level license. Third-party license notices are included in [`build/`](build/) and [`vendor/`](vendor/).
