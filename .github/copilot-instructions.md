# GitHub Copilot Instructions for JJonnick.github.io

## Project Overview

This is a Genshin Impact web application built with Astro and Tailwind CSS. It displays character information, stats, and assets from the Genshin Impact game.

## Technology Stack

- **Framework**: Astro 5.x
- **Styling**: Tailwind CSS 3.x with dark mode support
- **Package Manager**: pnpm (>=9)
- **Node Version**: >=22
- **TypeScript**: For type safety

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
