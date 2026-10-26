# Contributing

Contributions should preserve the atlas's scientific meaning, stable landmark identity, and bilingual presentation. Keep the application static and browser-native: Vite, TypeScript, and SVG are the project foundations. Use Node 24 and pnpm 11.20.0 from the repository root.

## Add a family or example

Catalogue data is organized by responsibility under `src/catalogue/`. Keep shared types in `types.ts`, reusable calculations in `helpers.ts`, source records in `sources.ts`, stable display order in `order.ts`, models in `models.ts`, regional metadata in `regions.ts`, reciprocal relationships in `relations.ts`, and family definitions under `families/`. The 13 family modules hold model data; `src/catalogue.ts` remains the consumed English materializer and API. A family module should own examples with a common subject or model.

Each example needs a meaningful event, an explicit probability model, and a source record when the value is sourced. State the sampled unit, population or denominator, time period, and assumptions in the explanation. Date estimates whose inputs can change. Keep observed historical aggregates labelled as such and keep provider availability, account access, approval, and guarantees as separate events.

Use decibans for positions and differences. Convert probability to odds only at the prior or posterior position when the model calls for it. Explain odds as a ratio between the event and its complement; one-in-X notation describes a probability denominator. They answer different questions and should not be substituted for one another. Preserve finite internal positions and write copy that never displays 0%, 100%, or infinity for a finite probability.

Add every new landmark to the explicit 134-ID order in `order.ts`. Display order determines scene angles, while stable IDs identify the event across languages, relationships, metadata, and tests. Keep related relationships reciprocal and point every relationship at an existing landmark.

## Add a language

Mirror the family catalogue under `src/locales/<language>/families/` and aggregate it from that locale's `catalogue.ts`. Put source labels and notes in the locale's `sources.ts`. Register the language in `src/locales/metadata.ts`; the pure formatting registry defines the native name, number locale, decimal separator, percent spacing, one-in phrase, and odds joiner. `LocaleCode` is derived from that registry's keys.

Translate every visible field, accessibility label, source label or note that needs localization, and text embedded in artwork. Keep source IDs, landmark IDs, probabilities, positions, artwork structure, relationships, and navigation behavior shared across languages. Complete the locale for every catalogue landmark. Integrity checks require exact English and French key coverage, stable source IDs, and valid relationships.

Regional metadata controls the default language filter; the All references choice exposes the full catalogue. Filtering preserves full-catalogue angles and current depth, while motion, snapping, bounds, rings, and related links use the visible subset.

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

## Pull requests

Describe the changed event or participant journey, the scientific assumptions, and the checks you ran. Include the relevant source and date. Keep commits focused and use Conventional Commits, such as `feat(catalogue): add eclipse family landmarks` or `fix(locales): complete French source notes`.

## License

By contributing, you agree that your contribution is licensed under the [Apache License 2.0](LICENSE).
