# Agent Guide — ep_set_title_on_pad

Set the title on a pad in Etherpad, also includes real time updates to the UI.

## Tech stack

* Etherpad plugin framework (hooks declared in `ep.json`)
* EJS templates rendered server-side via `eejsBlock_*` hooks
* html10n for i18n (`locales/<lang>.json`, `data-l10n-id` in templates)
* `ep_plugin_helpers` for shared boilerplate

## Project structure

```
ep_set_title_on_pad/
├── AGENTS.md
├── CONTRIBUTING.md
├── eejs.js
├── ep.json
├── handleMessage.js
├── index.js
├── locales/
│   ├── anp.json
│   ├── ar.json
│   ├── be-tarask.json
│   ├── be.json
│   ├── bn.json
│   ├── bto.json
│   └── ...
├── package.json
├── static/
│   ├── js/
│   ├── tests/
├── templates/
│   ├── title.ejs
```

## Helpers used

* `pad-toggle` from `ep_plugin_helpers`
* `pad-toggle-server` from `ep_plugin_helpers`


## Helpers NOT used

_To be audited in the helpers-adoption sweep (Phase 4)._


## Running tests locally

`ep_set_title_on_pad` runs inside Etherpad's test harness. From an etherpad checkout that has installed this plugin via `pnpm run plugins i --path ../ep_set_title_on_pad`:

```bash
# Backend (Mocha) — harness boots its own server
pnpm --filter ep_etherpad-lite run test

# Playwright — needs `pnpm run dev` in a second terminal
pnpm --filter ep_etherpad-lite run test-ui
```

## Standing rules for agent edits

* PRs target `main`. Linear commits, no merge commits.
* Every bug fix includes a regression test in the same commit.
* All user-facing strings in `locales/`. No hardcoded English in templates.
* No hardcoded `aria-label` on icon-only controls — etherpad's html10n auto-populates `aria-label` from the localized string when (a) the element has a `data-l10n-id` and (b) no author-supplied `aria-label` is present. Adding a hardcoded English `aria-label` blocks that and leaves it untranslated. (See `etherpad-lite/src/static/js/vendors/html10n.ts:665-678`.)
* No nested interactive elements (no `<button>` inside `<a>`).
* LLM/Agent contributions are explicitly welcomed by maintainers.

## Quick reference: hooks declared in `ep.json`

* Server: `eejsBlock_body`, `handleMessage`, `loadSettings`, `clientVars`, `eejsBlock_mySettings`, `eejsBlock_padSettings`, `exportFileName`, `padRemove`, `padCopy`
* Client: `postAceInit`, `handleClientMessage_CUSTOM`, `handleClientMessage_CLIENT_MESSAGE`

When adding a hook, register it in both `ep.json` *and* the matching `exports.<hook> = ...` in the JS file.
