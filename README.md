# The Scale of Probability

The Scale of Probability is a bilingual, interactive atlas of sourced probabilities expressed in decibans. It projects each event at its exact depth on a continuous radial scale, with details that explain the model, assumptions, calculations, and sources.

Scroll or use the arrow keys on a desktop. Swipe or pinch on a touch screen. After input becomes quiet, the view continues to the next example in the latest movement direction. Select an illustration to travel to its exact depth and open its explanation.

The explorer supports English and French. A saved choice takes precedence over the browser's ordered language preferences, with English as the fallback. The language picker is in the opening About dialog and beside About in the main view. The persisted **All references** option includes examples associated with every region instead of the selected language's default set.

## Development

Use Node 24 and pnpm 11.20.0. The pinned Nix development shell provides both tools. Run every command from the repository root.

```sh
nix develop
```

```sh
pnpm install --frozen-lockfile
```

```sh
pnpm dev --host 0.0.0.0
```

Run the unit suite:

```sh
pnpm test
```

Run the 100% coverage check:

```sh
pnpm test:coverage
```

Run the browser journey after installing Playwright's Chromium browser:

```sh
pnpm exec playwright install chromium
```

```sh
pnpm test:browser
```

Build the static application in `dist`:

```sh
pnpm build
```

## Vercel

Set the Vercel root directory to `.` and use Node 24. The root `vercel.json` pins pnpm 11.20.0 for the frozen install and build, then serves the Vite output from `dist`.

## Attribution and license

The radial scale was inspired by Cary Huang's [Scale of the Universe 2](https://www.htwins.net/scale2/), created as **carykh**. Probability models and sources are listed in the application.

Copyright 2026 Bycelium. Licensed under the [Apache License 2.0](LICENSE).
