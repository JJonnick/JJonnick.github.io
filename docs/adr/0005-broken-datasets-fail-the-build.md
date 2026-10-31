# A missing or invalid Dataset fails the build

`loadDataset(gameId, kind)` in `src/services/dataset-loader.ts` always throws on a missing, malformed or off-schema file; pages have no fallback of their own. Data is synced automatically from genshinStats, so a bad sync must stop the deploy rather than publish empty pages over the last good site.
