# GitHub Copilot Instructions for JJonnick.github.io

## Project Overview

This is a Genshin Impact web application built with Astro and Tailwind CSS. It displays character information, stats, and assets from the Genshin Impact game.

## Technology Stack

- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS 4.x with dark mode support
- **Package Manager**: pnpm (>=9)
- **Node Version**: >=22
- **TypeScript**: For type safety

## Skills Usage

When a task touches Astro or Tailwind code, use these installed skills first:

- `astro-framework` for Astro architecture, routing, content collections, hydration and SSR patterns
- `tailwindcss-fundamentals-v4` for Tailwind v4 base usage and theming
- `tailwindcss-advanced-layouts` for complex responsive layouts
- `tailwindcss-animations` for animation and transition patterns

## Project Structure

```
src/
├── pages/          # Astro pages (file-based routing)
├── components/     # Reusable Astro components
├── layouts/        # Page layouts
├── services/       # Business logic and data services
├── types/          # TypeScript type definitions
└── assets/         # Static assets
public/
└── data/          # JSON data files for characters
```

## Development Workflow

### Setup and Running

```bash
# Install dependencies
pnpm install

# Start development server (http://localhost:4321)
pnpm dev

# Type check
pnpm check

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Build Requirements

- Always run `astro check` before building to ensure type safety
- The build process includes TypeScript type checking
- Production builds are deployed to GitHub Pages

## Coding Standards

### Conventional Commits

All commits should follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Allowed types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or dependencies changes
- `ci`: CI/CD changes
- `chore`: Other maintenance tasks
- `revert`: Revert a previous commit

**Examples:**
- `feat: add character details page`
- `fix: resolve image loading issue`
- `docs: update README with commit guidelines`

### Astro Components

- Use `.astro` file extension for components
- Place reusable components in `src/components/`
- Use file-based routing in `src/pages/`
- Prefer Astro's frontmatter (---) for component logic
- Keep components focused and single-purpose

### Styling with Tailwind CSS

- **Always use Tailwind utility classes** for styling
- Avoid inline styles and custom CSS unless absolutely necessary
- Use Tailwind's responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Dark mode is enabled via `class` strategy (`dark:` prefix)
- Follow mobile-first design approach
- Use semantic HTML elements

### TypeScript

- Define types in `src/types/`
- Export types from `src/types/index.ts`
- Use strict type checking
- Avoid `any` types

### Import Aliases

Two path aliases are configured in `tsconfig.json`:

- `@/` → `src/` (e.g., `import Header from "@/components/Header.astro"`)
- `@assets/` → `src/assets/` (e.g., `import logo from "@assets/logo.png"`)

Always use these aliases instead of relative paths like `../../components/`.

### Astro View Transitions

The project uses Astro's `ClientRouter` for client-side view transitions:

- `ClientRouter` from `astro:transitions` is included in `Layout.astro`
- Inline scripts that must run on every client-side navigation must include `data-astro-rerun="true"`:
  ```astro
  <script is:inline data-astro-rerun="true">
    // This runs on every page load/navigation
  </script>
  ```
- Module scripts that add `astro:page-load` event listeners should use a guard flag to prevent duplicate registrations

### Accessibility

- Use `sr-only` / `not-sr-only` Tailwind classes instead of `hidden` for toggleable labels so they remain in the accessibility tree
- Add `aria-controls` to toggle buttons to associate them with the regions they control
- Always include `alt` text on images and appropriate `aria-label` / `aria-expanded` on interactive elements

### Component Patterns

Example Astro component with Tailwind:

```astro
---
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
    {title}
  </h2>
  {description && (
    <p class="text-gray-600 dark:text-gray-300">
      {description}
    </p>
  )}
</div>
```

## Configuration Files

- `astro.config.mjs` - Astro configuration with Tailwind integration
- `tailwind.config.mjs` - Tailwind CSS configuration with dark mode
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts

## Data Management

- Character data is stored in `public/data/` as JSON files
- Data is fetched from a private repository using genshin.py
- Assets are sourced from Genshin Impact Fandom and official sources

## Do Not

- Do not modify the build configuration without testing thoroughly
- Do not remove TypeScript type checking from the build process
- Do not use npm or yarn (use pnpm only)
- Do not add inline styles when Tailwind utilities can be used
- Do not remove dark mode support from components

## Testing and Validation

Before committing changes:
1. Run `pnpm check` to verify types
2. Run `pnpm build` to ensure production build works
3. Test dark mode functionality if styling was changed
4. Verify responsive design on different screen sizes

## Deployment

- The site is deployed to GitHub Pages
- Base URL in production: https://JJonnick.github.io
- Deployment is automated via GitHub Actions
- Changes to `main` branch trigger automatic deployment
