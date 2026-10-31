# Filters and pagination live in the URL; every page renders all characters

The Character list keeps its state in the URL (no client-state library), and changing a filter resets to page 1 so the URL matches the static `<charactersPath>/N` routes. Every page route renders all characters and hides those not on the current page, so filters work on a static site with no server. `getCharacterListView` computes the view identically on the server (first paint) and in the browser (after filter changes or history navigation), which keeps the rules in one place.

Trade-off: pages carry the full character list in their HTML, in exchange for no server, no duplicated rules and shareable URLs.
