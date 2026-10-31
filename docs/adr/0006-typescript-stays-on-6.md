# TypeScript stays on 6.x

Astro does not support TypeScript 7 yet, so `typescript` is held back while every other dependency tracks latest. `tsconfig.json` sets `baseUrl`, which TS 7 drops; expect that migration to touch it. Revisit when Astro supports TS 7.
