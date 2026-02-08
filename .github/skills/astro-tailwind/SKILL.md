---
name: astro-tailwind
description: |
  Specialized skill for building and maintaining websites using Astro and Tailwind CSS. 
  Provides guidelines for component structure, styling patterns, responsive design, 
  dark mode implementation, and TypeScript integration. Use this skill when creating 
  or modifying Astro components, configuring Tailwind, implementing responsive layouts, 
  or troubleshooting styling issues.
license: MIT
tags:
  - astro
  - tailwindcss
  - typescript
  - responsive-design
  - dark-mode
version: 1.0.0
---

# Astro + Tailwind CSS Skill

This skill provides best practices and guidelines for developing with Astro and Tailwind CSS.

## Core Principles

1. **Component-First Development**: Break down UI into reusable Astro components
2. **Utility-First CSS**: Use Tailwind utilities instead of custom CSS
3. **Responsive by Default**: Design mobile-first with progressive enhancement
4. **Dark Mode Support**: Include dark mode variants for all styled elements
5. **Type Safety**: Use TypeScript for props and data structures

## Astro Best Practices

### File Structure

```
src/
├── pages/          # File-based routing (.astro files)
│   ├── index.astro
│   └── [...slug].astro
├── components/     # Reusable components
│   ├── Header.astro
│   └── Card.astro
├── layouts/        # Page layouts
│   └── Layout.astro
└── types/          # TypeScript definitions
    └── index.ts
```

### Component Pattern

```astro
---
// Frontmatter: TypeScript logic
interface Props {
  title: string;
  subtitle?: string;
  variant?: 'primary' | 'secondary';
}

const { title, subtitle, variant = 'primary' } = Astro.props;

// Computed classes based on props
const baseClasses = "rounded-lg p-4 transition-all duration-200";
const variantClasses = variant === 'primary' 
  ? "bg-blue-500 text-white hover:bg-blue-600" 
  : "bg-gray-200 text-gray-900 hover:bg-gray-300";
---

<!-- Template: HTML with Tailwind classes -->
<div class={`${baseClasses} ${variantClasses}`}>
  <h2 class="text-2xl font-bold mb-2">{title}</h2>
  {subtitle && <p class="text-sm opacity-80">{subtitle}</p>}
  <slot />
</div>
```

### Props and TypeScript

- Always define Props interface in frontmatter
- Use TypeScript for type safety
- Provide default values for optional props
- Export types from `src/types/index.ts` for reuse

## Tailwind CSS Best Practices

### Responsive Design

Use mobile-first approach with responsive breakpoints:

```astro
<div class="
  w-full px-4           /* Mobile */
  sm:px-6              /* Small screens (640px+) */
  md:w-3/4 md:px-8     /* Medium screens (768px+) */
  lg:w-2/3             /* Large screens (1024px+) */
  xl:w-1/2             /* Extra large (1280px+) */
">
  Content
</div>
```

### Dark Mode

Always include dark mode variants for themed elements:

```astro
<div class="
  bg-white text-gray-900
  dark:bg-gray-800 dark:text-white
  border border-gray-200
  dark:border-gray-700
">
  <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
    Title
  </h3>
  <p class="text-gray-600 dark:text-gray-300">
    Description text
  </p>
</div>
```

### Color Guidelines

- Use semantic color names: `gray`, `blue`, `green`, `red`, `yellow`
- Use appropriate shades: 50-100 for backgrounds, 600-900 for text
- Dark mode: lighter shades for text, darker for backgrounds
- Hover states: adjust shade by 100 (e.g., `hover:bg-blue-600` from `bg-blue-500`)

### Spacing and Layout

```astro
<!-- Container with consistent spacing -->
<div class="container mx-auto px-4 py-8 max-w-7xl">
  <!-- Grid layout -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Card spacing -->
    <div class="p-6 space-y-4">
      <h3 class="mb-2">Title</h3>
      <p class="mt-1">Content</p>
    </div>
  </div>
</div>
```

### Common Patterns

**Card Component:**
```astro
<div class="
  bg-white dark:bg-gray-800
  rounded-lg shadow-md hover:shadow-lg
  transition-shadow duration-200
  overflow-hidden
  border border-gray-200 dark:border-gray-700
">
  <slot />
</div>
```

**Button Component:**
```astro
<button class="
  px-6 py-2 rounded-md
  font-medium text-sm
  bg-blue-500 hover:bg-blue-600
  text-white
  transition-colors duration-150
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Click me
</button>
```

**Navigation Link:**
```astro
<a class="
  inline-block px-4 py-2
  text-gray-700 dark:text-gray-200
  hover:text-blue-500 dark:hover:text-blue-400
  transition-colors duration-150
  border-b-2 border-transparent
  hover:border-blue-500
">
  Link
</a>
```

## Astro-Specific Features

### Content Collections

For type-safe content:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const characters = defineCollection({
  schema: z.object({
    name: z.string(),
    element: z.string(),
    rarity: z.number().min(4).max(5),
  }),
});

export const collections = { characters };
```

### Image Optimization

Use Astro's Image component:

```astro
---
import { Image } from 'astro:assets';
import characterImage from '../assets/character.png';
---

<Image 
  src={characterImage} 
  alt="Character name"
  class="w-full h-auto rounded-lg"
  width={400}
  height={400}
/>
```

### Dynamic Routes

```astro
---
// src/pages/character/[id].astro
export async function getStaticPaths() {
  const characters = await fetchCharacters();
  return characters.map(char => ({
    params: { id: char.id },
    props: { character: char },
  }));
}

const { character } = Astro.props;
---
```

## Configuration

### Tailwind Config

```javascript
// tailwind.config.mjs
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Add custom colors, fonts, etc.
    },
  },
  plugins: [],
}
```

### Astro Config

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  // Other config...
});
```

## Common Scripts

```bash
# Development with hot reload
pnpm dev

# Type checking
pnpm check

# Production build
pnpm build

# Preview production build
pnpm preview
```

## Do's and Don'ts

### ✅ Do:

- Use Tailwind utility classes for all styling
- Include dark mode variants for visual elements
- Write mobile-first responsive styles
- Define TypeScript interfaces for component props
- Use Astro's file-based routing
- Leverage Astro's partial hydration for interactivity
- Use semantic HTML elements
- Keep components small and focused

### ❌ Don't:

- Don't write inline styles unless absolutely necessary
- Don't use custom CSS when Tailwind utilities exist
- Don't forget dark mode variants
- Don't use `any` type in TypeScript
- Don't create components that do too many things
- Don't ignore responsive design
- Don't skip accessibility attributes (alt, aria-*, etc.)

## Troubleshooting

### Tailwind classes not applying

1. Check that file is included in `content` array in `tailwind.config.mjs`
2. Ensure classes are not dynamically constructed (use full class names)
3. Restart dev server after config changes

### TypeScript errors

1. Run `pnpm check` to see detailed type errors
2. Ensure all props interfaces are properly defined
3. Check that types are imported from correct paths

### Dark mode not working

1. Verify `darkMode: 'class'` in `tailwind.config.mjs`
2. Check that parent element has `dark` class
3. Ensure dark mode variants are included in component

## Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [Astro + Tailwind Integration](https://docs.astro.build/en/guides/integrations-guide/tailwind/)
