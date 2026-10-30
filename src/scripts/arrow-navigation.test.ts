import assert from "node:assert/strict";
import test from "node:test";
import { Window } from "happy-dom";
import { initArrowNavigation, nextIndex } from "./arrow-navigation.ts";

const grid = [
    { left: 0, top: 0, width: 100 },
    { left: 110, top: 0, width: 100 },
    { left: 220, top: 0, width: 100 },
    { left: 0, top: 200, width: 100 },
    { left: 110, top: 200, width: 100 },
];

test("moves linearly and clamps at the ends", () => {
    assert.equal(nextIndex(grid, 0, "ArrowLeft", false), 0);
    assert.equal(nextIndex(grid, 0, "ArrowRight", false), 1);
    assert.equal(nextIndex(grid, 4, "ArrowDown", false), 4);
    assert.equal(nextIndex(grid, 2, "Home", false), 0);
    assert.equal(nextIndex(grid, 2, "End", false), 4);
});

test("moves by rows in a grid, keeping the nearest column", () => {
    assert.equal(nextIndex(grid, 1, "ArrowDown", true), 4);
    assert.equal(nextIndex(grid, 2, "ArrowDown", true), 4);
    assert.equal(nextIndex(grid, 4, "ArrowUp", true), 1);
    assert.equal(nextIndex(grid, 1, "ArrowUp", true), 1);
});

test("focuses the next visible item on ArrowRight and skips hidden ones", () => {
    const window = new Window({ url: "https://example.test/" });
    window.document.body.innerHTML = `
        <div data-arrow-nav>
            <button id="a">A</button>
            <div hidden><button id="b">B</button></div>
            <button id="c">C</button>
        </div>`;
    initArrowNavigation(window.document as unknown as Document);

    const a = window.document.getElementById("a") as unknown as HTMLElement;
    a.focus();
    const event = new window.KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
    });
    a.dispatchEvent(event as unknown as Event);

    assert.equal(window.document.activeElement?.id, "c");
    assert.equal(event.defaultPrevented, true);
});

test("ignores keys outside arrow containers", () => {
    const window = new Window({ url: "https://example.test/" });
    window.document.body.innerHTML = '<button id="a">A</button>';
    initArrowNavigation(window.document as unknown as Document);

    const event = new window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true });
    window.document.getElementById("a")?.dispatchEvent(event);

    assert.equal(event.defaultPrevented, false);
});
