# Zod validates Datasets; valibot and TanStack rejected

Zod is structural at build time: `src/schemas/datasets.ts` defines the Dataset schemas, `loadDataset` validates every JSON with it, and the app types derive from `z.infer`. It only runs during static generation, so it is not in the browser bundle. Swapping to valibot would save little, has no `z.compile` equivalent and would churn every `z.infer` type export.

## Considered Options

- **valibot**: rejected, marginal bundle win for a full migration.
- **TanStack Query**: rejected, there is no client-side fetching to cache.
- **TanStack Table**: rejected, the client controller toggles pre-rendered cards rather than row data. Adopting it would ship character JSON to the client (~13-15 kB gzip) to replace ~85 tested lines in `src/services/character-list.ts`.
