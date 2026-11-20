---
name: verify
description: Run the site and confirm a change works end to end. Use before committing or opening a PR for any UI, routing or data change, or when asked to verify, smoke-test or screenshot the site.
---

# Verify

Tests passing is not enough: run the built site and look at it.

## 1. Cheap checks first

`pnpm test`, `pnpm lint`, `pnpm build` (includes `astro check`). Report failures verbatim. After 3 failed rounds on the same check, stop and ask.

## 2. Serve the build

`pnpm preview` (serves `dist/` on http://localhost:4321/). Run it in the background; never `pnpm dev` for verification, it hides build-only failures.

## 3. Drive it

Use Chrome DevTools MCP (`take_snapshot`, `take_screenshot`, `list_console_messages`, `list_network_requests`). Check, in both themes (toggle via `ThemeToggle`) and a mobile viewport:

- Routes: `/`, `/characters/`, one `/characters/<id>/`, `/hsr/`, `/hsr/characters/`, one HSR detail, and a missing URL for `/404`.
- URL state: change a filter or search, confirm the URL updates and pagination resets to page 1; reload keeps the state.
- Navigation: client-side navigation (`ClientRouter`) still initialises scripts on `astro:page-load` (theme toggle, filters work after navigating, not just on first load).
- Console: no errors or warnings; no failed or 404 requests.
- Accessibility: interactive elements have names and state (`aria-*`).
- Motion changes: also read `.agents/skills/emil-design-eng/SKILL.md`.

## 4. Report

State what was run and observed, with evidence (screenshots, console output). Say plainly what was not checked. If a check fails repeatedly, turn the lesson into a rule in `AGENTS.md` or a test.
