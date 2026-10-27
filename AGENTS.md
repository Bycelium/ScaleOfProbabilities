# Scale of Probability

## Start here

- Keep this a self-contained static Vite application prepared for Vercel. Run commands from the repository root with Node 24 and pnpm 11.20.0. Vercel's root directory is `.`; do not add a backend or deploy from this worktree.
- Use direct wording and avoid rhetorical contrast patterns. Prefer explicit function parameters, CLI arguments, and structured tool inputs over environment variables, except for execution or deployment configuration and tools that require environment configuration.
- Trace callers and supported entry points before removing unused code. Remove unused implementation together with its dedicated tests, fixtures, types, and adapters; record useful future ideas in a proposal instead of retaining dormant code.
- Delegate feature implementation, accompanying tests, documentation, and follow-up fixes by default. Use `subagent-routing` to choose a model and reasoning effort before delegating those bounded tasks; the primary agent owns design, coordination, integration, and final review.

## Guides by change type

- Read [interface guidelines](docs/interface-guidelines.md) before changing the scene, navigation, detail card, readout, About dialog, accessibility, locale behavior, or regional filtering.
- Read [catalogue guidelines](docs/catalogue-guidelines.md) before changing examples, probabilities, source-backed copy, artwork, relationships, translations, or scientific models.
- [CONTRIBUTING.md](CONTRIBUTING.md) contains contributor walkthroughs for events and languages, plus the full development and pull-request process.

## Working safely and efficiently

- Keep ordinary reads, searches, filtering, and diffs in the sandbox. Use tool output limits or native output arguments instead of attaching pipes, redirections, or compound wrappers to a privileged command.
- Reuse existing pnpm validation scripts, preview sessions, and known session handles. The primary agent owns preview and browser sessions and all permission requests; subagents report an exact blocked command and reason, then continue independent allowed work.
- Run a necessary privileged command alone with an existing approved stable prefix. Request only a few narrowly scoped reusable capabilities through the primary agent when required; do not create one-off approval prompts or repeatedly probe ports.
- Use headless automated browser tests and visual reviews. Start a visible browser only for an explicitly requested interactive review or an agreed browser-specific investigation.
- For prose-only changes, inspect rendered Markdown and links, then run `git diff --check`.

## Validation

- Run `pnpm test` and `pnpm build` for executable changes. Run `pnpm test:coverage` for calculation, catalogue, locale, or formatting changes, and `pnpm test:browser` for navigation, details, language controls, filtering, or readout and layout styling changes.
- Check source links and dates manually when changing an estimate. Keep documentation shell commands on one line.
