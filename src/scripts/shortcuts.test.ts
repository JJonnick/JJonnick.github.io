import assert from "node:assert/strict";
import test from "node:test";
import { type Element, type HTMLElement, type HTMLInputElement, Window } from "happy-dom";
import { initShortcuts } from "./shortcuts.ts";

function setup(html: string) {
    const window = new Window({ url: "https://example.test/" });
    window.document.body.innerHTML = html;
    initShortcuts(window.document as unknown as Document);
    return window;
}

function press(window: Window, key: string, target: Element | null = window.document.body) {
    const event = new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
    target?.dispatchEvent(event);
}

test("] follows the visible next page link and ignores a hidden one", () => {
    const window = setup('<a href="#next" data-page-next-link>Next</a>');
    const link = window.document.querySelector("[data-page-next-link]");
    let clicks = 0;
    link?.addEventListener("click", (event) => {
        event.preventDefault();
        clicks++;
    });

    press(window, "]");
    link?.setAttribute("hidden", "");
    press(window, "]");

    assert.equal(clicks, 1);
});

test("t toggles the theme switch", () => {
    const window = setup('<input type="checkbox" data-theme-toggle />');
    const input = window.document.querySelector<HTMLInputElement>("[data-theme-toggle]");

    press(window, "t");

    assert.equal(input?.checked, true);
});

test("does not fire while typing in a field", () => {
    const window = setup('<input id="q" /><input type="checkbox" data-theme-toggle />');
    const toggle = window.document.querySelector<HTMLInputElement>("[data-theme-toggle]");

    press(window, "t", window.document.getElementById("q"));

    assert.equal(toggle?.checked, false);
});

test("Ctrl+K and / focus the search box, even from another field", () => {
    const window = setup('<input id="other" /><input type="search" id="s" data-filter-search />');
    const search = window.document.getElementById("s");

    const ctrlK = new window.KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true, cancelable: true });
    window.document.getElementById("other")?.dispatchEvent(ctrlK);
    assert.equal(window.document.activeElement, search);
    assert.equal(ctrlK.defaultPrevented, true);

    (window.document.getElementById("other") as unknown as HTMLElement).focus();
    press(window, "/");
    assert.equal(window.document.activeElement, search);
});

test("Ctrl+K is left to the browser when the page has no search", () => {
    const window = setup("<p>no search</p>");
    const event = new window.KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true, cancelable: true });
    window.document.body.dispatchEvent(event);
    assert.equal(event.defaultPrevented, false);
});
