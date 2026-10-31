# Unit tests run on `node --test`, not vitest

Vitest was only used for a `bench/` suite that asserted nothing and ran in no CI, so both were removed (#331) instead of migrating to vitest 5's new bench API. Unit tests run on the built-in `node --test` (`pnpm test`), with `happy-dom` for the few DOM tests. Adding a test framework back needs a reason the Node runner cannot cover.
