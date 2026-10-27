# Contributing

Contributions should preserve the atlas's scientific meaning, stable landmark identity, and multilingual presentation. Keep the application static and browser-native: Vite and TypeScript drive the interface, SVG provides the illustrations, and one Canvas 2D layer draws the gray guide circles.

## Correct a typo, translation, source, or fact

You can report a correction without setting up the project.

1. [Open a correction issue](https://github.com/Bycelium/ScaleOfProbabilities/issues/new/choose). Name the affected event and language, copy the current text, and give the proposed correction. Include a source link and date for a source or factual correction. A typo does not need a source.
2. To submit the correction yourself, fork [Bycelium/ScaleOfProbabilities](https://github.com/Bycelium/ScaleOfProbabilities), clone your fork locally, enter it, then create a branch. Replace `YOUR-USERNAME` with your GitHub username.

```sh
git clone https://github.com/YOUR-USERNAME/ScaleOfProbabilities.git
cd ScaleOfProbabilities
git switch -c fix/correction
```

3. Edit the affected locale or source file. Keep translations together when the shared meaning changes.
4. Run the focused checks below.
5. Open a pull request to this repository and write `Fixes #123` in its description to link the issue.

## Development setup

Use Node 24 and pnpm 11.20.0. Run every command from the repository root.

Install locked dependencies:

```sh
pnpm install --frozen-lockfile
```

Start Vite:

```sh
pnpm dev --host 0.0.0.0
```

The application is a self-contained static Vite build. Vercel uses root directory `.`; the root `vercel.json` pins pnpm 11.20.0 for the frozen install and build and serves `dist`. Do not add a backend or deploy from this repository worktree.

## Add a sourced event

Catalogue data is organized by responsibility under `src/catalogue/`. Keep shared types in `types.ts`, reusable calculations in `helpers.ts`, source records in `sources.ts`, stable display order in `order.ts`, the family registry in `models.ts`, regional metadata in `regions.ts`, reciprocal relationships in `relations.ts`, and family definitions under `families/`. A family module should own examples with a common subject or model. Add the new family to `src/catalogue/models.ts`.

Follow these steps for one event.

1. Add its ID to `src/catalogue/order.ts` first. Set its slot to the current highest slot plus one. Do not reuse a hole left by a removed event: slots fix scene angles.

```ts
"die-even": 136,
```

2. Add the model to the appropriate module, such as `src/catalogue/families/dice_games.ts`. Use an existing supported artwork factory and a named source ID.

```ts
{ id: "die-even", chance: lowerRatio(3, 6), size: 88, art: artwork("die-six", "#527c91"), sourceIds: ["fair-die-model"], classification: exact }
```

Import the helper and artwork if that family does not already import them, then include the family in `src/catalogue/models.ts` only when it is a new family. `lowerRatio`, `upperRatio`, `lower`, `upper`, and `oneIn` are in `src/catalogue/helpers.ts`; use `upper(tail)` for a near-one event whose small complement is `tail`. Position derives from probability, so do not write a dBan coordinate.

3. Reuse `fair-die-model` for this walkthrough. For a new source, add its source metadata in `src/catalogue/sources.ts`, then add the source label and optional note to all four locale source files.

```ts
"example-study-2026": { href: "https://example.org/study" },
```

4. Add the same ID and all five copy fields to the corresponding family files in `src/locales/en/families/`, `src/locales/fr/families/`, `src/locales/zh/families/`, and `src/locales/es/families/`.

```ts
"die-even": { title: "An even number on one fair die", shortTitle: "even number on one die", explanation: "Three faces are even.", calculation: "p = 3 / 6 = 1/2", assumptions: "Each face is equally likely." },
```

Aggregate a new family in every locale `catalogue.ts`; an added event in an existing family needs no new aggregate import. State the sampled unit, population or denominator, timeframe, and assumptions in the copy; date estimates whose inputs can change.

Use decibans for positions and differences. For event probability `p`, compute the position as `d = 10 log10(p / (1 − p))`. A difference `Δd = d₂ − d₁` compares the two events' odds and corresponds to an odds multiplier of `10^(Δd / 10)`. The difference does not represent the probability of a shift. Explain odds as the ratio between an event and its complement. One-in-X notation gives a probability denominator. Preserve finite internal positions and write copy that never displays 0%, 100%, or infinity for a finite probability.

5. Declare each relationship once in `declaredRelatedLandmarkIds` in `src/catalogue/relations.ts`. `reciprocalRelations()` adds the reverse edge and rejects unknown IDs, so do not duplicate a reverse declaration. Add a `regions.ts` entry only for a supported regional audience; unannotated examples remain common. Create or reuse SVG artwork in `src/artwork.ts`; translate embedded artwork text through each locale’s `ui.art` keys.

6. Run `pnpm test` and `pnpm build`; also run `pnpm test:coverage` for model, catalogue, locale, or formatting changes.

## Add a language

1. Add native-name and formatting metadata in `src/locales/metadata.ts`. The `oneInTemplate` must contain `{denominator}`.

```ts
de: { nativeName: "Deutsch", numberLocale: "de-DE", decimalSeparator: ",", percentSpace: " ", oneInTemplate: "1 von {denominator}", oddsJoiner: "zu" },
```

2. Create `src/locales/de.ts` with the complete UI translation and metadata spread, then create `src/locales/de/catalogue.ts`, `src/locales/de/sources.ts`, and one translated copy family for every family in the English catalogue. Each source entry uses the existing source ID, for example `"fair-die-model": { label: "Modell eines fairen Würfels" }`; each landmark entry keeps its existing ID and supplies `title`, `shortTitle`, `explanation`, `calculation`, and `assumptions`. Preserve template placeholder names such as `{population}` and `{prevalence}` exactly. For models with advice, translate `advice.before`, `advice.relatedLabel`, and `advice.after` too.

3. Assemble every family in `src/locales/de/catalogue.ts`, then import and register the locale in `src/locales/index.ts`.

```ts
import { de } from "./de";
export const locales: Readonly<Record<LocaleCode, LocaleDefinition>> = { en, fr, zh, es, de };
```

The locale module itself follows the shared definition:

```ts
export const de: LocaleDefinition = { code: "de", ...localeMetadata.de, ui, landmarks: deLandmarks, sources: deSources };
```

Translate every visible field, accessibility label, source label or note, and text embedded in artwork. Keep source IDs, landmark IDs, probabilities, positions, artwork structure, relationships, and navigation behavior shared across languages. Complete every named copy field for every landmark in every registered locale. A saved language wins; otherwise the browser’s ordered preferences match by base language code and fall back to English. Add tests for selection and persistence, numeric formatting, localized artwork, and a narrow browser layout with details open after switching languages. Integrity checks require complete landmark and source key coverage, stable source IDs, and valid relationships.

Regional metadata controls the default language filter. The shared language menu, available from the opening About dialog and the globe control, includes a **Show all references** checkbox that exposes the full catalogue. Chinese and Spanish currently have no region-specific catalogue mappings, so their default view contains the unannotated common examples until Show all references is enabled. Filtering preserves full-catalogue angles and current depth, while motion, snapping, bounds, rings, and related links use the visible subset.

## Navigation behavior

Vertical wheel and trackpad input, the Up and Down arrow keys, and a one-finger vertical swipe start continuous travel immediately toward the next visible landmark in the latest direction. The first swipe, wheel or trackpad burst, or arrow press from rest stays locked to the immediately adjacent landmark regardless of its event count. New consecutive gestures share one progressive speed ceiling, keeping the second and third increases small and reserving high speed for sustained input. A renewed trackpad pulse after its declining inertial tail counts as a new gesture, and held arrow keys earn at most one new step per gesture interval. A true empty gap of at least 15 dBan keeps the adjacent destination and uses the natural cubic acceleration and braking curve on the first gesture. Sustained input may pass intermediate landmarks and always chooses a finite landmark where the journey can brake to rest. Touch-down and blank taps apply a short smooth brake when the scene is moving. At substantial speed, the first opposing gesture brakes to a stop without reversing; a second distinct opposing gesture starts travel in that direction, even while the short brake is completing. Low-speed changes of direction remain direct. Horizontal, multi-touch, and pinch gestures leave the scale at rest. Starting any travel closes open details. Selecting an illustration or related example sets that landmark as an exact destination; its details open only after arrival. Directional travel stops at its finite landmark without opening details.

Combine gesture events within one animation frame and preserve elapsed motion and velocity when continuing a journey. Directional destinations must leave enough room for visible braking; explicit illustration and return destinations remain exact. Normalize wheel pixel, line, and page units so desktop Firefox wheels and trackpads follow the same travel model.

## Checks

Run the focused checks after a catalogue or translation change:

```sh
pnpm test
```

```sh
pnpm build
```

Use the coverage command when changing calculation, catalogue, locale, or formatting behavior:

```sh
pnpm test:coverage
```

Install Playwright’s Chromium browser first when it is not already available:

```sh
pnpm exec playwright install chromium
```

Use the browser journey for changes to navigation, details, language controls, or filtering:

```sh
pnpm test:browser
```

Run automated browser checks and visual reviews headlessly. Use a visible browser only for an explicitly requested interactive review or a browser-specific investigation agreed with the user.

Review source links and dates manually when adding or changing an estimate. Keep each shell command on one line in documentation.

For prose-only changes, inspect the rendered Markdown and links, then run `git diff --check`. The coverage suite is unnecessary when executable behavior has not changed.

## Pull requests

Describe the changed event or participant journey, the scientific assumptions, and the checks you ran. Include the relevant source and date. Keep commits focused and use Conventional Commits, such as `feat(catalogue): add eclipse family landmarks` or `fix(locales): complete French source notes`.

## License

By contributing, you agree that your contribution is licensed under the [Apache License 2.0](LICENSE).
