# TL;DR

- Los filtros de personajes ahora viven en la querystring (`element` y `rarity`), para que el estado sea compartible y persistente.
- Se valida la entrada con Zod para evitar valores inválidos y volver a `all` cuando haga falta.
- La paginación conserva los filtros activos, así que `?element=fire&rarity=5` sigue funcionando al movernos entre páginas.
- Se comprobó con `pnpm check` y `pnpm build` antes de abrir la PR.

## Cambios principales

- `src/scripts/character-filters.ts`: sincronización del estado del filtro con la URL y validación con Zod.
- `src/components/Pagination.astro`: preservación de filtros al navegar entre páginas.
- `src/components/CharacterListPage.astro`: se exponen los valores disponibles para construir la URL-aware UI.
- `package.json` / `pnpm-lock.yaml`: se añadieron `nuqs` y `zod` como dependencias.

## Contexto

La lista de personajes ya tenía filtros visuales locales; ahora se vuelven reales en la URL, evitando pérdidas de estado y haciendo la UX más robusta sin introducir Zustand para este caso.
