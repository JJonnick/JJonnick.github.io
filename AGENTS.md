# AGENTS.md

This repository uses Astro, TypeScript, and Tailwind. Follow these project conventions for all changes.

## Required project rules
- Prefer server-first rendering and keep page-level files focused on routing/rendering.
- Use Tailwind utilities before inline styles.
- Preserve dark mode classes and theme behavior.
- Keep TypeScript strict; avoid `any`.
- Prefer repo aliases like `@/*` and `@assets/*`.
- Do not add unnecessary client-state libraries for simple query-driven UI. Use URL state for filters/search when it reflects user intent.
- Validate external and user-provided data with Zod when the values are constrained or parsed.
- Keep reusable logic in services/components instead of bloating page files.
- Follow accessibility basics on interactive elements.
- Use Conventional Commits for commit messages.

## Repo-specific guidance
- Read `README.md` for project conventions and commit rules.
- Use `pnpm` for install/check/build commands.
- Validate with `pnpm check` and `pnpm build` before finalizing non-trivial changes.
- The reusable agent-skills live under `.github/agent-skills`; project-local instructions are this file plus `.github/copilot-instructions.md`.

## Review/implementation workflow
- Prefer small, focused changes.
- Review risks before merge.
- Keep filters/search state in the URL when it changes user-visible state and should be shareable.
- When changing list filters, reset to the first page so the URL remains consistent with the static route structure.
