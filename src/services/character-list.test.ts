import assert from "node:assert/strict";
import test from "node:test";
import { getFilteredCharacterPage } from "./character-list.ts";

test("filters the complete character list before paginating", () => {
    const firstPageCharacters = Array.from({ length: 24 }, (_, id) => ({
        id,
        element: "ice",
        rarity: 5,
    }));
    const fireCharacters = Array.from({ length: 10 }, (_, index) => ({
        id: index + 24,
        element: "fire",
        rarity: 5,
    }));

    const page = getFilteredCharacterPage(
        [...firstPageCharacters, ...fireCharacters],
        { element: "fire", rarity: "all" },
        1,
        24,
    );

    assert.equal(page.totalItems, 10);
    assert.equal(page.items.length, 10);
    assert.deepEqual(
        page.items.map(({ id }) => id),
        fireCharacters.map(({ id }) => id),
    );
});

test("clamps filtered pages that no longer exist", () => {
    const page = getFilteredCharacterPage(
        Array.from({ length: 30 }, (_, id) => ({ id, element: "fire", rarity: 4 })),
        { element: "fire", rarity: "all" },
        3,
        24,
    );

    assert.equal(page.currentPage, 2);
    assert.equal(page.totalPages, 2);
    assert.equal(page.items.length, 6);
});
