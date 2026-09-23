# Domain glossary

Terms used across the code, issues and PRs. Use these names; avoid the listed alternatives.

## Game

One supported title: Genshin Impact (`genshin`) or Honkai: Star Rail (`hsr`). A `Game` in
`src/games/` holds everything shared pages need to know about it: routes, Elements and their
labels and icons, portrait shape and page copy. Game-specific facts used by only one game stay in
that game's folder.
_Avoid_: profile, config.

## Character list

The paginated, filterable grid of a Game's characters, at `<charactersPath>` (page 1) and
`<charactersPath>/N`.
Every page route renders all characters and hides the ones not on that page, so filters work
without a server.
_Avoid_: roster.

## Character list view

What the Character list shows for a given set of characters and URL: the visible characters, the
active filters and their options, and the pagination. Computed by `getCharacterListView` in
`src/services/character-list.ts`, identically on the server (first paint) and in the browser (after
each filter change or history navigation).
_Avoid_: filter state, controller.

## Element

A character's elemental type (e.g. Pyro, Quantum). Always compared in normalised form (trimmed,
lowercase) via `normalizeElement`.

## Rarity

A character's star count (4 or 5 in practice). Compared as text in URLs and filters.
_Avoid_: stars.
