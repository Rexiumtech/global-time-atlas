# Contributing to Global Time Atlas

Thanks for your interest in improving this tool.

## Development setup

```bash
npm install
npm run catalog        # regenerate src/data/cities.json from source datasets
npm run dev            # local dev server on http://localhost:3000
```

## Before opening a pull request

All of these must pass:

```bash
npm test               # data regression checks
npm run typecheck      # TypeScript (strict)
npm run build          # static export build
npm run test:browser   # Playwright suite (requires a local Chromium install)
```

If your change affects the city catalog, run `npm run catalog` and commit the regenerated `src/data/cities.json`.

## Guidelines

- Keep the app fully client-side — no server APIs, no analytics, no tracking.
- Preserve bilingual copy: every user-facing string exists in both English and Spanish.
- Use [conventional commit messages](https://www.conventionalcommits.org) (`feat:`, `fix:`, `docs:`, `chore:`).
- Timezone logic must rely on the browser `Intl` API, never on hand-maintained offset tables.

## Reporting bugs

Open an issue with the browser and OS you used, what you expected, and what happened instead. For anything involving credentials or vulnerabilities, follow [SECURITY.md](SECURITY.md) instead of opening a public issue.
