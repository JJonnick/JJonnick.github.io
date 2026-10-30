import assert from "node:assert/strict";
import test from "node:test";
import { Window } from "happy-dom";
import { focusPageStart } from "./page-focus.ts";

function run(html: string) {
    const window = new Window({ url: "https://example.test/" });
    window.document.body.innerHTML = html;
    focusPageStart(window.document as unknown as Document);
    return window.document;
}

test("focuses the h1 inside main", () => {
    const document = run('<main id="main-content" tabindex="-1"><h1 id="t">Hola</h1></main>');

    assert.equal(document.activeElement?.id, "t");
    assert.equal(document.getElementById("t")?.getAttribute("tabindex"), "-1");
});

test("falls back to main when the page has no h1", () => {
    const document = run('<main id="main-content" tabindex="-1"><p>Sin título</p></main>');

    assert.equal(document.activeElement?.id, "main-content");
});

test("does nothing without a main landmark", () => {
    const document = run("<p>nada</p>");

    assert.equal(document.activeElement?.tagName, "BODY");
});
