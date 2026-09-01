import { bench, describe } from "vitest";
import {
    CHARACTER_PAGE_SIZE,
    collectPresentElements,
    collectRarities,
    getFilteredCharacterPage,
    getVisiblePageNumbers,
} from "@/services/character-list";
import { getCharacters } from "@/services/database";
import { GENSHIN_ELEMENTS } from "@/utils/elements";

const realCharacters = await getCharacters();

/** Scales the real dataset up to simulate a much larger roster. */
function scaleRoster<T extends { id: number }>(items: T[], factor: number): T[] {
    return Array.from({ length: factor }, (_, copy) =>
        items.map((item) => ({ ...item, id: item.id + copy * 100_000 })),
    ).flat();
}

const largeRoster = scaleRoster(realCharacters, 40);

describe("character filtering and pagination", () => {
    bench("filter + paginate the real roster (first page)", () => {
        getFilteredCharacterPage(
            realCharacters,
            { element: "all", rarity: "all" },
            1,
            CHARACTER_PAGE_SIZE,
        );
    });

    bench("filter + paginate the real roster by element and rarity", () => {
        getFilteredCharacterPage(
            realCharacters,
            { element: "pyro", rarity: "5" },
            2,
            CHARACTER_PAGE_SIZE,
        );
    });

    bench("filter + paginate a large roster by element", () => {
        getFilteredCharacterPage(
            largeRoster,
            { element: "hydro", rarity: "all" },
            5,
            CHARACTER_PAGE_SIZE,
        );
    });

    bench("walk every page of the large roster", () => {
        const totalPages = Math.ceil(largeRoster.length / CHARACTER_PAGE_SIZE);
        for (let page = 1; page <= totalPages; page++) {
            getFilteredCharacterPage(
                largeRoster,
                { element: "all", rarity: "all" },
                page,
                CHARACTER_PAGE_SIZE,
            );
        }
    });
});

describe("filter facets", () => {
    bench("collect present elements from the real roster", () => {
        collectPresentElements(realCharacters, GENSHIN_ELEMENTS);
    });

    bench("collect present elements from a large roster", () => {
        collectPresentElements(largeRoster, GENSHIN_ELEMENTS);
    });

    bench("collect rarities from a large roster", () => {
        collectRarities(largeRoster);
    });
});

describe("pagination controls", () => {
    bench("visible page numbers across a long pagination", () => {
        for (let page = 1; page <= 200; page++) {
            getVisiblePageNumbers(page, 200);
        }
    });
});
