// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

function getVisibleCardsCount(): number {
    return Array.from(
        document.querySelectorAll<HTMLElement>("[data-filter-card]"),
    ).filter((card) => !card.hidden).length;
}

function setupCharacterFilterDom() {
    document.body.innerHTML = `
        <div>
            <button type="button" data-filter-element="all" class="ui-control ui-control-active" aria-pressed="true">Todos</button>
            <button type="button" data-filter-element="pyro" class="ui-control ui-control-idle" aria-pressed="false">Pyro</button>
            <button type="button" data-filter-element="hydro" class="ui-control ui-control-idle" aria-pressed="false">Hydro</button>
        </div>
        <div>
            <button type="button" data-filter-rarity="all" class="ui-control ui-control-active" aria-pressed="true">Todas</button>
            <button type="button" data-filter-rarity="5" class="ui-control ui-control-idle" aria-pressed="false">5★</button>
            <button type="button" data-filter-rarity="4" class="ui-control ui-control-idle" aria-pressed="false">4★</button>
        </div>
        <div id="character-grid">
            <article data-filter-card data-element="pyro" data-rarity="5"></article>
            <article data-filter-card data-element="hydro" data-rarity="4"></article>
            <article data-filter-card data-element="pyro" data-rarity="4"></article>
        </div>
        <p id="no-results" hidden></p>
    `;
}

describe("character filters script", () => {
    beforeEach(() => {
        vi.resetModules();
        delete (window as Window & { __characterFiltersPageLoadBound?: boolean })
            .__characterFiltersPageLoadBound;
        setupCharacterFilterDom();
    });

    it("applies element and rarity filters and toggles no-results visibility", async () => {
        await import("@/scripts/character-filters");
        document.dispatchEvent(new Event("astro:page-load"));

        expect(getVisibleCardsCount()).toBe(3);

        const pyroButton = document.querySelector<HTMLElement>(
            "[data-filter-element='pyro']",
        );
        const rarityFiveButton = document.querySelector<HTMLElement>(
            "[data-filter-rarity='5']",
        );
        const rarityFourButton = document.querySelector<HTMLElement>(
            "[data-filter-rarity='4']",
        );
        const noResults = document.getElementById("no-results");

        expect(pyroButton).not.toBeNull();
        expect(rarityFiveButton).not.toBeNull();
        expect(rarityFourButton).not.toBeNull();
        expect(noResults).not.toBeNull();

        pyroButton!.click();
        expect(getVisibleCardsCount()).toBe(2);
        expect(pyroButton!.getAttribute("aria-pressed")).toBe("true");
        expect(pyroButton!.classList.contains("ui-control-active")).toBe(true);

        rarityFiveButton!.click();
        expect(getVisibleCardsCount()).toBe(1);
        expect(noResults!.hidden).toBe(true);
        expect(rarityFiveButton!.getAttribute("aria-pressed")).toBe("true");
        expect(rarityFiveButton!.classList.contains("ui-control-active")).toBe(
            true,
        );

        rarityFourButton!.click();
        expect(getVisibleCardsCount()).toBe(1);
        expect(noResults!.hidden).toBe(true);

        const hydroButton = document.querySelector<HTMLElement>(
            "[data-filter-element='hydro']",
        );
        hydroButton!.click();
        expect(getVisibleCardsCount()).toBe(0);
        expect(noResults!.hidden).toBe(false);
    });
});
