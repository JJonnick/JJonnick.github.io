# Genshin web

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

## Decisiones de arquitectura para mantenibilidad

- Los listados paginados de personajes (Genshin y HSR) comparten lógica de filtros en `src/services/character-list.ts` para evitar duplicación en `getStaticPaths`.
- Los mapeos de dominio de Genshin (por ejemplo tipo de arma) se mantienen fuera de páginas en `src/constants/genshin.ts`.
- Los labels e íconos de elementos de Genshin se centralizan en `src/utils/elements.ts` para reutilización consistente entre páginas y componentes.
- El acceso a JSON público se resuelve desde un mapa tipado en `src/services/database.ts` y una caché por dataset, reduciendo lógica repetida de lectura/parsing.

## Uso de agentes y skills

Este repo usa dos capas de configuración:
- `AGENTS.md` en la raíz para reglas del proyecto y flujo con agentes.
- `.github/copilot-instructions.md` para GitHub Copilot.
- El submódulo `.github/agent-skills` aporta las skills reutilizables de `addyosmani/agent-skills` para revisión, test y quality gates.

### Flujo recomendado
1. Usa `AGENTS.md` como referencia para el contexto del proyecto.
2. Consulta las skills del submódulo y usa `code-review-and-quality` antes de merge.
3. Mantén cambios pequeños, verificables y con validación del proyecto.

### Skill de agentes compartidas
- Este repo incluye el submódulo `.github/agent-skills`, que apunta a `addyosmani/agent-skills`.
- Se actualiza automáticamente con el workflow de GitHub Actions `agent-skills-sync` y también se sincroniza desde `copilot-setup-steps.yml` en los entornos de Copilot.

### Ejemplos rápidos
- `Usa code-review-and-quality para revisar los cambios actuales con foco en regresión.`
- `Revisa el flujo de filtros y paginación con riesgo de UI y URL state.`
- `Haz un fix seguro para restaurar el estado del listado tras cambiar filtros.`
