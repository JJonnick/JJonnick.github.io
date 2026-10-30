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

function press(
    window: Window,
    init: { code: string; ctrlKey?: boolean; altKey?: boolean; shiftKey?: boolean },
    target: Element | null = window.document.body,
) {
    const event = new window.KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
    target?.dispatchEvent(event);
    return event;
}

test("Shift+ArrowRight follows the visible next page link and skips a hidden one", () => {
    const window = setup('<a href="#next" data-page-next-link>Next</a>');
    const link = window.document.querySelector("[data-page-next-link]");
    let clicks = 0;
    link?.addEventListener("click", (event) => {
        event.preventDefault();
        clicks++;
    });

    press(window, { code: "ArrowRight", shiftKey: true });
    link?.setAttribute("hidden", "");
    press(window, { code: "ArrowRight", shiftKey: true });

    assert.equal(clicks, 1);
});

test("Alt+T toggles the theme, even from a text field", () => {
    const window = setup('<input id="q" /><input type="checkbox" data-theme-toggle />');
    const toggle = window.document.querySelector<HTMLInputElement>("[data-theme-toggle]");

    press(window, { code: "KeyT", altKey: true }, window.document.getElementById("q"));

    assert.equal(toggle?.checked, true);
});

test("a bare letter does nothing", () => {
    const window = setup('<input type="checkbox" data-theme-toggle />');
    const toggle = window.document.querySelector<HTMLInputElement>("[data-theme-toggle]");

    const event = press(window, { code: "KeyT" });

    assert.equal(toggle?.checked, false);
    assert.equal(event.defaultPrevented, false);
});

test("Shift+Arrow is left to text selection while typing", () => {
    const window = setup('<input id="q" /><a href="#n" data-page-next-link>Next</a>');
    let clicks = 0;
    window.document.querySelector("[data-page-next-link]")?.addEventListener("click", (e) => {
        e.preventDefault();
        clicks++;
    });

    const event = press(window, { code: "ArrowRight", shiftKey: true }, window.document.getElementById("q"));

    assert.equal(clicks, 0);
    assert.equal(event.defaultPrevented, false);
});

test("Ctrl+K focuses the search box, even from another field", () => {
    const window = setup('<input id="other" /><input type="search" id="s" data-filter-search />');

    const event = press(window, { code: "KeyK", ctrlKey: true }, window.document.getElementById("other"));

    assert.equal(window.document.activeElement, window.document.getElementById("s"));
    assert.equal(event.defaultPrevented, true);
});

test("Ctrl+K is left to the browser when the page has no search", () => {
    const window = setup("<p>no search</p>");

    assert.equal(press(window, { code: "KeyK", ctrlKey: true }).defaultPrevented, false);
});

test("Alt+G opens the game menu and focuses the current game", () => {
    const window = setup('<div id="game-switcher-popover"><a href="#a" aria-current="page">A</a></div>');
    const popover = window.document.getElementById("game-switcher-popover") as unknown as {
        showPopover: () => void;
        matches: (selector: string) => boolean;
    };
    let opened = false;
    popover.showPopover = () => {
        opened = true;
    };
    popover.matches = () => false;

    press(window, { code: "KeyG", altKey: true });

    assert.equal(opened, true);
    assert.equal((window.document.activeElement as unknown as HTMLElement).textContent, "A");
});
