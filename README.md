# Genshin web

[![CodSpeed](https://img.shields.io/endpoint?url=https://codspeed.io/badge.json)](https://app.codspeed.io/JJonnick/JJonnick.github.io?utm_source=badge)

Proyecto para aprender el uso de Astro con Tailwind CSS

## Conventional Commits

Este proyecto utiliza [Conventional Commits](https://www.conventionalcommits.org/) para mensajes de commit estandarizados. Los commits deben seguir el formato:

```
<tipo>(<ámbito opcional>): <descripción>

[cuerpo opcional]

[nota de pie opcional]
```

### Tipos permitidos:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de errores
- `docs`: Cambios en documentación
- `style`: Cambios de formato (espacios, comas, etc.)
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `test`: Añadir o actualizar tests
- `build`: Cambios en el sistema de build o dependencias
- `ci`: Cambios en CI/CD
- `chore`: Otras tareas de mantenimiento
- `revert`: Revertir un commit anterior

### Ejemplos:
```
feat: add character details page
fix: resolve image loading issue
docs: update README with commit guidelines
```

### Información adicional
- Datos obtenidos desde un repositorio privado usando **genshin.py**
- Assets obtenidos desde https://genshin-impact.fandom.com/ y https://github.com/genshindev/api

## Preview de cambios

Se agregó un workflow de **Preview deploy** para Pull Requests hacia `main`.

- En cada PR (desde una rama del mismo repositorio), GitHub Actions genera un despliegue de preview.
- Puedes abrir la URL del preview desde la ejecución del workflow en la pestaña **Actions**.

## Variables de entorno

- No envíes archivos `.env` con valores reales.
- Copia `.env.example` a `.env` para configuración local.

## Linter y formateador

Este proyecto usa [Biome](https://biomejs.dev/) como linter y formateador.

```bash
pnpm lint          # Ejecuta el linter
pnpm format        # Formatea todos los archivos
pnpm format:check  # Comprueba el formato sin aplicar cambios
```

Se recomienda instalar la [extensión de Biome para VS Code](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) para obtener diagnósticos en tiempo real y formateo automático al guardar.

## Gestor de paquetes

El proyecto usa la versión exacta de pnpm declarada en `packageManager` de `package.json`. Los workflows que usen `pnpm/action-setup` deben declarar la misma versión; actualiza ambos valores en el mismo cambio para evitar `ERR_PNPM_BAD_PM_VERSION` en CI.

## Benchmarks de rendimiento

Las mediciones de rendimiento se ejecutan con [vitest bench](https://vitest.dev/guide/features.html#benchmarking) y se publican en [CodSpeed](https://app.codspeed.io/JJonnick/JJonnick.github.io).

```bash
pnpm bench   # Ejecuta los benchmarks de bench/*.bench.ts
```

Los benchmarks cubren el filtrado y la paginación de personajes, la lectura de los datasets JSON y los helpers de elementos. El workflow `CodSpeed` los ejecuta en cada Pull Request hacia `main` y compara los resultados con la rama base.

## Decisiones de arquitectura para mantenibilidad

- Los listados paginados de personajes (Genshin y HSR) comparten lógica de filtros en `src/services/character-list.ts` para evitar duplicación en `getStaticPaths`.
- Los mapeos de dominio de Genshin (por ejemplo tipo de arma) se mantienen fuera de páginas en `src/constants/genshin.ts`.
- Los labels e íconos de elementos de Genshin se centralizan en `src/utils/elements.ts` para reutilización consistente entre páginas y componentes.
- El acceso a JSON público se resuelve desde un mapa tipado en `src/services/database.ts` y una caché por dataset, reduciendo lógica repetida de lectura/parsing.

## Uso de agentes y skills

Este repo usa estas capas de configuración:

- `AGENTS.md` en la raíz para reglas del proyecto y flujo con agentes.
- `.github/copilot-instructions.md` para GitHub Copilot.
- `.agents/skills` contiene la selección de skills que Codex descubre en este proyecto.
- El submódulo `.github/agent-skills` conserva el catálogo completo de `addyosmani/agent-skills` como upstream y soporte para otros agentes.

### Flujo recomendado

1. Usa `AGENTS.md` como referencia para el contexto del proyecto.
2. Usa `grill-with-docs` para cambios ambiguos y `tdd` para implementar comportamiento mediante ciclos red-green.
3. Usa `code-review-and-quality` antes de merge.
4. Mantén cambios pequeños, verificables y con validación del proyecto.

### Skills compartidas

- De Addy Osmani: `frontend-ui-engineering`, `source-driven-development`, `code-review-and-quality`, `security-and-hardening` y `performance-optimization`.
- De Matt Pocock: `grill-with-docs`, `grilling`, `diagnosing-bugs`, `codebase-design`, `domain-modeling`, `tdd` y `setup-matt-pocock-skills`.
- De Julius Brussee: `caveman`, como modo de respuesta concisa activado explícitamente.
- `skills-lock.json` registra el origen y hash de cada skill instalada. Ejecuta `npx skills update -p -y` para comprobar y aplicar actualizaciones.
- El submódulo de Addy se actualiza automáticamente con el workflow `agent-skills-sync` y se sincroniza desde `copilot-setup-steps.yml` en los entornos de Copilot.

### Ejemplos rápidos
- `Usa code-review-and-quality para revisar los cambios actuales con foco en regresión.`
- `Usa tdd para implementar este cambio con una prueba por cada slice vertical.`
- `Activa caveman full para responder de forma concisa durante esta sesión.`
- `Revisa el flujo de filtros y paginación con riesgo de UI y URL state.`
- `Haz un fix seguro para restaurar el estado del listado tras cambiar filtros.`
