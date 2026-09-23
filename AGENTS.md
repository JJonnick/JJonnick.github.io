# AGENTS.md

Astro 7 + TypeScript + Tailwind 4 static site showing Genshin Impact and Honkai: Star Rail account data. Use the domain terms in `CONTEXT.md` (Game, Dataset, Character list…) in code, issues and PRs.

## Commands

- `pnpm` only.
- `pnpm test`: unit tests on `node --test` (`src/**/*.test.ts`).
- `pnpm lint` / `pnpm format`: Biome.
- `pnpm build`: runs `astro check` + build. Finish every non-trivial change with `pnpm test` and `pnpm build` green.

## Architecture

- Game-specific facts (routes, elements, labels, icons, copy) live in `src/games/{genshin,hsr}` as a `Game`; pages and components receive the `Game`.
- Page files only route and render. Derived values come from `src/services` or `src/games/*/detail.ts`, covered by tests.
- Read `public/data` through `loadDataset` (`src/services/dataset-loader.ts`): it validates with Zod and throws, so a broken sync fails the build.
- Parse constrained external or user input with Zod; model unknown shapes as `unknown` + narrowing, keeping TypeScript strict.
- Import through `@/*` and `@assets/*`.

## UI

- Tailwind utilities first. Shared controls (`ui-control`, `ui-segmented`, `surface-*`) and the easing tokens (`ease-out-strong`, `ease-in-out-strong`) live in `src/styles/global.css`; reuse them before styling a new button or card.
- Every visual change ships in both themes: dark mode is class-based (`dark:`), toggled by `ThemeToggle`.
- Navigation uses Astro `ClientRouter`: bundled scripts initialise on `astro:page-load`; inline scripts that must rerun need `data-astro-rerun="true"`.
- Interactive elements carry an accessible name (`aria-label`, `sr-only` text) and state (`aria-current`, `aria-pressed`, `aria-controls`).
- Motion: before adding or changing any transition, animation or hover/press effect, read `.agents/skills/emil-design-eng/SKILL.md`; use `review-animations` to audit a diff.

## URL state

Filters, search and pagination live in the URL, with no client-state library. Changing a filter resets to page 1 so the URL matches the static page routes.

## Skills

Project skills live in `.agents/skills`, pinned in `skills-lock.json` (`npx skills update -p -y`). The full Addy Osmani catalog is the `.github/agent-skills` submodule.

## Git

Conventional Commits (types listed in `README.md`). Small, focused PRs.
