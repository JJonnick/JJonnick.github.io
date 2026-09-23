import assert from "node:assert/strict";
import test from "node:test";
import { type Document, type HTMLButtonElement, type HTMLElement, Window } from "happy-dom";
import { initCharacterFilters } from "./character-filter-controller.ts";

// Filtering and pagination rules are covered by src/services/character-list.test.ts.
// This smoke test only checks the DOM wiring: clicks, history and popstate.

function visibleCards(document: Document): string[] {
    return Array.from(document.querySelectorAll<HTMLElement>("[data-filter-card]"))
        .filter((card) => !card.hidden)
        .map((card) => card.textContent?.trim() ?? "");
}

function isPressed(document: Document, selector: string): boolean {
    return document.querySelector(selector)?.getAttribute("aria-pressed") === "true";
}

test("syncs cards, buttons and pagination with the URL", () => {
    const window = new Window({ url: "https://example.test/characters/2" });
    const document = window.document;
    document.body.innerHTML = `
        <div id="character-filters" data-base-path="/characters" data-page-size="2">
            <button type="button" data-filter-element="all">Todos</button>
            <button type="button" data-filter-element="fire">Fuego</button>
            <button type="button" data-filter-element="ice">Hielo</button>
            <button type="button" data-filter-rarity="all">Todas</button>
            <button type="button" data-filter-rarity="4">4</button>
            <button type="button" data-filter-rarity="5">5</button>
        </div>
        <div id="character-grid">
            <article data-filter-card data-element="fire" data-rarity="5">A</article>
            <article data-filter-card data-element="fire" data-rarity="4">B</article>
            <article data-filter-card data-element="ice" data-rarity="4">C</article>
        </div>
        <p id="no-results" hidden>No hay resultados</p>
        <nav data-pagination-nav>
            <a data-page-number="1"></a>
            <a data-page-number="2"></a>
        </nav>
    `;

    initCharacterFilters(
        document as unknown as globalThis.Document,
        window as unknown as Parameters<typeof initCharacterFilters>[1],
    );
    const nav = document.querySelector<HTMLElement>("[data-pagination-nav]");

    assert.deepEqual(visibleCards(document), ["C"]);
    assert.equal(nav?.hidden, false);

    document.querySelector<HTMLButtonElement>('[data-filter-element="fire"]')?.click();

    assert.equal(window.location.pathname, "/characters");
    assert.equal(window.location.search, "?element=fire");
    assert.deepEqual(visibleCards(document), ["A", "B"]);
    assert.ok(isPressed(document, '[data-filter-element="fire"]'));
    assert.equal(nav?.hidden, true);

    window.history.pushState({}, "", "/characters?element=ice&rarity=4");
    window.dispatchEvent(new window.PopStateEvent("popstate"));

    assert.deepEqual(visibleCards(document), ["C"]);
    assert.ok(isPressed(document, '[data-filter-element="ice"]'));
    assert.ok(isPressed(document, '[data-filter-rarity="4"]'));
    assert.ok(!isPressed(document, '[data-filter-element="fire"]'));
});
