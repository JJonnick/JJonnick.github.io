# Project Guidelines

## Code Style
- Use Astro components (`.astro`) and keep page-level files focused on routing/rendering.
- Use Tailwind utility classes first; avoid inline styles unless there is no practical utility-based alternative.
- Preserve dark mode behavior (`dark:` classes and theme toggling flow).
- Keep TypeScript strict and avoid `any`.
- Prefer import aliases from `tsconfig.json`: `@/*` and `@assets/*`.

## Architecture
- Stack: Astro 6, Tailwind CSS 4, TypeScript.
- Main folders:
  - `src/pages`: route files (including dynamic routes).
  - `src/components`: reusable UI.
  - `src/layouts`: shared page shells and transitions.
  - `src/services`: server-side data loading and business logic.
  - `src/types`: shared domain types.
- Data source pattern:
  - Read account/character data from `public/data` through service functions in `src/services/database.ts`.
  - Keep parsing/loading concerns in services, not page templates.
- Transitions pattern:
  - `src/layouts/Layout.astro` uses `ClientRouter`.
  - Inline scripts that must run after client navigation must use `data-astro-rerun="true"`.

## Build and Test
- Use pnpm only (npm/yarn are not supported in this repo).
- Runtime/tooling requirements from `package.json`:
  - Node `>=24`
  - pnpm `>=10`
- Common commands:
  - `pnpm install`
  - `pnpm dev`
  - `pnpm check`
  - `pnpm build` (already runs `astro check && astro build`)
  - `pnpm preview`
- Before finalizing non-trivial changes, run at least `pnpm check` and then `pnpm build` when feasible.

## Conventions
- Keep reusable logic in components/services instead of bloating page files.
- Follow accessibility basics on interactive UI: `alt`, `aria-label`, and correct expanded/control relationships.
- Keep commit messages in Conventional Commits format.
- Link to existing docs instead of duplicating details:
  - `README.md` for commit format and project context.
