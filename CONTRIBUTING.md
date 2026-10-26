# Contributing

Contributions should preserve the atlas's scientific meaning, stable landmark identity, and bilingual presentation. Keep the application static and browser-native: Vite, TypeScript, and SVG are the project foundations. Use Node 24 and pnpm 11.20.0 from the repository root.

## Add a family or example

Catalogue data is organized by responsibility under `src/catalogue/`. Keep shared types in `types.ts`, reusable calculations in `helpers.ts`, source records in `sources.ts`, stable display order in `order.ts`, the family registry in `models.ts`, regional metadata in `regions.ts`, reciprocal relationships in `relations.ts`, and family definitions under `families/`. A family module should own examples with a common subject or model. Keep participant-facing copy in the matching family module under `src/locales/<language>/families/`, where each landmark is a named object with `title`, `shortTitle`, `explanation`, `calculation`, `assumptions`, and optional `advice` fields.

Each example needs a meaningful event, an explicit probability model, and source IDs for any referenced evidence. Declare each source ID once in `src/catalogue/sources.ts`, include its reference link when one exists, and add its label and optional note to every registered locale. State the sampled unit, population or denominator, time period, and assumptions in the copy. Date estimates whose inputs can change. Keep observed historical aggregates labelled as such and keep provider availability, account access, approval, and guarantees as separate events.

Use decibans for positions and differences. For event probability `p`, compute the position as `d = 10 log10(p / (1 − p))`. A difference `Δd = d₂ − d₁` compares the two events' odds and corresponds to an odds multiplier of `10^(Δd / 10)`. The difference does not represent the probability of a shift. Explain odds as the ratio between an event and its complement. One-in-X notation gives a probability denominator. Preserve finite internal positions and write copy that never displays 0%, 100%, or infinity for a finite probability.

Append every new landmark ID to `order.ts`. Existing array indices determine scene angles, so preserve their order. Stable IDs identify an event across models, locales, relationships, regional metadata, and tests. Keep related relationships reciprocal and point every relationship at an existing landmark.

## Add a language

Add the language's native name and number-formatting metadata to `src/locales/metadata.ts`. `LocaleCode` is derived from that registry's keys. Create `src/locales/<language>.ts` with the complete UI translation, mirror the landmark families under `src/locales/<language>/families/`, aggregate them in that locale's `catalogue.ts`, and put source labels and notes in its `sources.ts`. Register the completed locale in `src/locales/index.ts`.

Translate every visible field, accessibility label, source label or note, and text embedded in artwork. Keep source IDs, landmark IDs, probabilities, positions, artwork structure, relationships, and navigation behavior shared across languages. Complete every named copy field for every landmark in every registered locale. Integrity checks require complete landmark and source key coverage, stable source IDs, and valid relationships.

Regional metadata controls the default language filter; the All references choice exposes the full catalogue. Filtering preserves full-catalogue angles and current depth, while motion, snapping, bounds, rings, and related links use the visible subset.

## Navigation behavior

Directional wheel, trackpad, keyboard, swipe, and pinch input starts continuous travel immediately toward the next visible landmark in the latest direction. Long gaps accelerate and then brake as the landmark approaches. Starting any travel closes open details. Selecting an illustration or related example sets that landmark as the explicit destination; its details open only after arrival. Directional travel stops at the landmark without opening details.

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

Use the browser journey for changes to navigation, details, language controls, or filtering:

```sh
pnpm test:browser
```

Review source links and dates manually when adding or changing an estimate. Keep each shell command on one line in documentation.

For prose-only changes, inspect the rendered Markdown and links, then run `git diff --check`. The coverage suite is unnecessary when executable behavior has not changed.

## Pull requests

Describe the changed event or participant journey, the scientific assumptions, and the checks you ran. Include the relevant source and date. Keep commits focused and use Conventional Commits, such as `feat(catalogue): add eclipse family landmarks` or `fix(locales): complete French source notes`.

## License

By contributing, you agree that your contribution is licensed under the [Apache License 2.0](LICENSE).
