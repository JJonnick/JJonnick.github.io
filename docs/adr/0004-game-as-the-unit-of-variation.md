# A `Game` object holds everything game-specific

Genshin and Honkai: Star Rail differ in routes, Elements, labels, icons, portrait shape and copy. These live in `src/games/{genshin,hsr}` as plain typed `Game` objects, and pages and components receive the `Game` instead of branching on a game id or taking per-feature flags (e.g. `showElementIcons`). Adding a game means adding a folder, not touching shared pages. Markup that differs a lot (Character detail) stays separate per game; only derived values are shared in shape via `toCharacterDetail`.
