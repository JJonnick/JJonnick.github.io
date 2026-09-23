import assert from "node:assert/strict";
import test from "node:test";
import { getCharacterListView, getFilteredListUrl } from "./character-list.ts";

const BASE = "https://example.test";
const options = { basePath: "/characters", pageSize: 24 };

function characters(count: number, element: string, rarity: number, firstId = 0) {
    return Array.from({ length: count }, (_, index) => ({ id: firstId + index, element, rarity }));
}

function view(items: ReturnType<typeof characters>, path: string, pageSize = 24) {
    return getCharacterListView(items, new URL(path, BASE), { ...options, pageSize });
}

test("filters the complete character list before paginating", () => {
    const fire = characters(10, "fire", 5, 24);
    const result = view([...characters(24, "ice", 5), ...fire], "/characters?element=fire");

    assert.deepEqual(
        result.items.map(({ id }) => id),
        fire.map(({ id }) => id),
    );
    assert.equal(result.pagination.totalPages, 1);
    assert.equal(result.pagination.isHidden, true);
});

test("clamps pages that no longer exist and reports the canonical URL", () => {
    const result = view(characters(30, "fire", 4), "/characters/3?element=fire");

    assert.equal(result.pagination.currentPage, 2);
    assert.equal(result.items.length, 6);
    assert.equal(result.canonicalUrl, "/characters/2?element=fire");
});

test("has no canonical URL when the requested page exists", () => {
    assert.equal(view(characters(30, "fire", 4), "/characters/2/").canonicalUrl, undefined);
});

test("ignores filter values that no character has", () => {
    const result = view(characters(3, "fire", 4), "/characters?element=anemo&rarity=5");

    assert.equal(result.filters.element, "all");
    assert.equal(result.filters.rarity, "all");
    assert.equal(result.items.length, 3);
});

test("normalises elements and compares rarity as text", () => {
    const items = [
        { id: 1, element: " Fire ", rarity: 5 },
        { id: 2, element: "ice", rarity: "5" },
        { id: 3, element: "fire", rarity: 4 },
    ];
    const result = getCharacterListView(
        items,
        new URL("/characters?element=fire&rarity=5", BASE),
        options,
    );

    assert.deepEqual(
        result.items.map(({ id }) => id),
        [1],
    );
});

test("orders element options by the given order and rarities descending", () => {
    const items = [
        { element: "pyro", rarity: 4 },
        { element: "mystery", rarity: 5 },
        { element: "anemo", rarity: 0 },
    ];
    const result = getCharacterListView(items, new URL("/characters", BASE), {
        ...options,
        elementOrder: ["anemo", "geo", "pyro"],
    });

    assert.deepEqual(result.filters.elementOptions, ["anemo", "pyro", "mystery"]);
    assert.deepEqual(result.filters.rarityOptions, ["5", "4"]);
});

test("reports an empty result and hides pagination", () => {
    const items = [...characters(30, "fire", 4), ...characters(1, "ice", 5, 30)];
    const result = view(items, "/characters/2?element=fire&rarity=5");

    assert.equal(result.isEmpty, true);
    assert.equal(result.items.length, 0);
    assert.equal(result.pagination.isHidden, true);
    assert.equal(result.canonicalUrl, undefined);
});

test("builds page links that keep the filters", () => {
    const result = view(characters(5, "fire", 4), "/characters/2?element=fire", 2);
    const { links, prev, next } = result.pagination;

    assert.deepEqual(
        links.map(({ href, isCurrent }) => [href, isCurrent]),
        [
            ["/characters?element=fire", false],
            ["/characters/2?element=fire", true],
            ["/characters/3?element=fire", false],
        ],
    );
    assert.deepEqual(prev, { href: "/characters?element=fire", isDisabled: false });
    assert.deepEqual(next, { href: "/characters/3?element=fire", isDisabled: false });
});

test("keeps long pagination compact around the current page", () => {
    const visible = (page: number) =>
        view(characters(20, "fire", 4), `/characters/${page}`, 1)
            .pagination.links.filter((link) => link.isVisible)
            .map((link) => link.page);

    assert.deepEqual(visible(10), [1, 9, 10, 11, 20]);
    assert.deepEqual(visible(1), [1, 2, 3, 4, 5, 20]);
    assert.deepEqual(visible(20), [1, 16, 17, 18, 19, 20]);

    const middle = view(characters(20, "fire", 4), "/characters/10", 1).pagination;
    assert.equal(middle.showStartEllipsis, true);
    assert.equal(middle.showEndEllipsis, true);

    const start = view(characters(20, "fire", 4), "/characters", 1).pagination;
    assert.equal(start.showStartEllipsis, false);
    assert.equal(start.prev.isDisabled, true);
});

test("shows every page when pagination is short", () => {
    const { pagination } = view(characters(4, "fire", 4), "/characters/2", 1);

    assert.ok(pagination.links.every((link) => link.isVisible));
    assert.equal(pagination.showStartEllipsis, false);
    assert.equal(pagination.showEndEllipsis, false);
});

test("filtered URLs reset to the first page and drop default filters", () => {
    const url = new URL("/characters/3?element=fire&rarity=5&lang=es", BASE);

    assert.equal(
        getFilteredListUrl(url, "/characters", { element: "ice", rarity: "5" }),
        "/characters?element=ice&rarity=5&lang=es",
    );
    assert.equal(
        getFilteredListUrl(url, "/characters", { element: "all", rarity: "all" }),
        "/characters?lang=es",
    );
});
