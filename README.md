# Humanize.top interface reference

An original minimal interface inspired by the navigation breadth in the supplied QuillBot references. It contains 141 tool routes, six category menus, search/filtering, 13 workspace archetypes and an eight-platform app roadmap.

## Scope

This is a design reference. AI processing, paid subscriptions, user accounts, uploads and native apps are not connected. Example text is explicitly illustrative. Navigation, filters, editing, local copy/TXT downloads, feature dialogs and the invisible-character utility work in the browser.

## Source

- `data/tools.json`: the 141-entry inventory
- `components/product/humanize.tsx`: directory, menus and workspace UI
- `app/globals.css`: responsive design system
- `app/tools/[slug]/page.tsx`: canonical workspace routes

## Development

Use the package manager pinned by this repository and its existing lockfile. In the managed Sites environment use `sites-preview start /workspace/sites/humanize-top-blueprint`. Run `node node_modules/typescript/bin/tsc --noEmit` for type checking and the Sites `build-site.mjs` helper for the production build. The managed runtime profile is checkout-local.

The production SaaS architecture, target API, reference PostgreSQL schema, per-tool specifications and launch gates are in the accompanying Humanize.top developer handoff. Adapt them to the actual Humanize.top repository before implementing or migrating any live service.
