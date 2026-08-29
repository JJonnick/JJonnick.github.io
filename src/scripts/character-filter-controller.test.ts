import assert from "node:assert/strict";
import test from "node:test";
import { type Document, type HTMLButtonElement, type HTMLElement, Window } from "happy-dom";
import { initCharacterFilters } from "./character-filter-controller.ts";

function createFixture(url = "https://example.test/characters?element=fire") {
    const window = new Window({ url });
    const document = window.document;

    document.body.innerHTML = `
        <div
            id="character-filters"
            data-filter-ns="/characters"
            data-element-options="fire,ice"
            data-rarity-options="4,5"
            data-page-size="2"
        >
            <button type="button" data-filter-element="all" aria-pressed="true">Todos</button>
            <button type="button" data-filter-element="fire" aria-pressed="false">Fuego</button>
            <button type="button" data-filter-element="ice" aria-pressed="false">Hielo</button>
            <button type="button" data-filter-rarity="all" aria-pressed="true">Todas</button>
            <button type="button" data-filter-rarity="4" aria-pressed="false">4</button>
            <button type="button" data-filter-rarity="5" aria-pressed="false">5</button>
        </div>
        <div id="character-grid">
            <article data-filter-card data-element="fire" data-rarity="5">A</article>
            <article data-filter-card data-element="fire" data-rarity="4">B</article>
            <article data-filter-card data-element="ice" data-rarity="4">C</article>
        </div>
        <p id="no-results" hidden>No hay resultados</p>
        <nav data-pagination-nav>
            <a data-page-prev-link></a>
            <span data-page-prev-disabled></span>
            <a data-page-number="1"></a>
            <a data-page-number="2"></a>
            <a data-page-next-link></a>
            <span data-page-next-disabled></span>
        </nav>
    `;

    initCharacterFilters(
        document as unknown as globalThis.Document,
        window as unknown as Parameters<typeof initCharacterFilters>[1],
    );
    return { document, window };
}

function visibleCards(document: Document): string[] {
    return Array.from(document.querySelectorAll<HTMLElement>("[data-filter-card]"))
        .filter((card) => !card.hidden)
        .map((card) => card.textContent?.trim() ?? "");
}

test("restores filters and visible cards when browser history changes", () => {
    const { document, window } = createFixture();

    assert.deepEqual(visibleCards(document), ["A", "B"]);
    assert.equal(
        document.querySelector('[data-filter-element="fire"]')?.getAttribute("aria-pressed"),
        "true",
    );

    window.history.pushState({}, "", "/characters?element=ice&rarity=4");
    window.dispatchEvent(new window.PopStateEvent("popstate"));

    assert.deepEqual(visibleCards(document), ["C"]);
    assert.equal(
        document.querySelector('[data-filter-element="ice"]')?.getAttribute("aria-pressed"),
        "true",
    );
    assert.equal(
        document.querySelector('[data-filter-rarity="4"]')?.getAttribute("aria-pressed"),
        "true",
    );
});

test("filter clicks reset pagination and keep URL state shareable", () => {
    const { document, window } = createFixture("https://example.test/characters/2");

    const iceButton = document.querySelector<HTMLButtonElement>('[data-filter-element="ice"]');
    iceButton?.click();

    assert.equal(window.location.pathname, "/characters");
    assert.equal(window.location.search, "?element=ice");
    assert.deepEqual(visibleCards(document), ["C"]);
});
