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

## Uso de agentes de Copilot

Este repo incluye agentes y prompt personalizados para acelerar revisiones y correcciones.

### Componentes disponibles
- Prompt de revisión: `/.github/prompts/review-pr.prompt.md`
- Agente de review: `/.github/agents/reviewer-code.agent.md`
- Agente de fix: `/.github/agents/fix-from-review.agent.md`

### Flujo recomendado
1. Ejecuta `/Review PR Risk-First` y pide una revisión con foco en riesgo.
2. Toma los hallazgos y ejecuta `Fix From Review` con la lista de problemas a corregir.
3. Repite la revisión con `Reviewer Code` para validar que no queden riesgos importantes.

### Ejemplos rápidos
- `/Review PR Risk-First revisa los cambios actuales con profundidad alta.`
- `Usa Reviewer Code para revisar riesgos de regresión en src/pages y src/services.`
- `Usa Fix From Review para corregir estos hallazgos: ...`
