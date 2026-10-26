# The Scale of Probability

The Scale of Probability is a bilingual, interactive atlas of sourced probabilities expressed in decibans. It places each event at its exact depth on a continuous radial scale and provides the model, assumptions, calculations, and sources behind each example.

Use the mouse wheel or trackpad on a desktop, the arrow keys when the scene has focus, or a one-finger swipe or pinch on a touch screen. Movement travels continuously through depth and settles on the next landmark in the latest movement direction when input becomes quiet. Select an illustration to travel to its exact depth and open its explanation. Related examples use the same travel path. The Return to 0 dBan control appears after the opening position.

The explorer supports English and French. A saved choice takes precedence over the browser's ordered language preferences, with English as the fallback. The language picker is in the opening About dialog and beside About in the main view. The persisted **All references** option includes examples associated with every region instead of the selected language's default set.

## Development

Use Node 24 and pnpm 11.20.0. The Nix development shell provides both tools. Run every command from the repository root.

With direnv's shell integration installed, allow the repository environment once:

```sh
direnv allow
```

Otherwise, enter the development shell directly:

```sh
nix develop
```

Install the locked dependencies:

```sh
pnpm install --frozen-lockfile
```

Start the Vite development server:

```sh
pnpm dev --host 0.0.0.0
```

Run the unit suite:

```sh
pnpm test
```

Run the coverage thresholds:

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

## Deployment

The application is a self-contained static Vite build. Set the Vercel root directory to `.` and use Node 24. The root `vercel.json` pins pnpm 11.20.0 for the frozen install and build, then serves the Vite output from `dist`.

## Attribution and license

The radial scale was inspired by Cary Huang's [Scale of the Universe 2](https://www.htwins.net/scale2/), created as **carykh**. Probability models and sources are listed in the application.

Copyright 2026 Bycelium. Licensed under the [Apache License 2.0](LICENSE).
