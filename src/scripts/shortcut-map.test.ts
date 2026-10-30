import assert from "node:assert/strict";
import test from "node:test";
import { Window } from "happy-dom";
import {
    applyPlatformKeys,
    ariaKeyShortcuts,
    comboKeys,
    findShortcut,
    SHORTCUTS,
} from "./shortcut-map.ts";

const base = { code: "", ctrlKey: false, metaKey: false, altKey: false, shiftKey: false };

test("matches modifier shortcuts on the physical key", () => {
    assert.equal(findShortcut({ ...base, code: "KeyK", ctrlKey: true })?.id, "search");
    assert.equal(findShortcut({ ...base, code: "KeyK", metaKey: true })?.id, "search");
    assert.equal(findShortcut({ ...base, code: "KeyT", altKey: true })?.id, "theme");
    assert.equal(findShortcut({ ...base, code: "ArrowRight", shiftKey: true })?.id, "nextPage");
});

test("ignores bare keys and extra modifiers", () => {
    assert.equal(findShortcut({ ...base, code: "KeyT" }), undefined);
    assert.equal(findShortcut({ ...base, code: "ArrowRight" }), undefined);
    assert.equal(findShortcut({ ...base, code: "KeyK", ctrlKey: true, shiftKey: true }), undefined);
});

test("AltGr (ctrl+alt) never triggers an Alt shortcut", () => {
    assert.equal(findShortcut({ ...base, code: "KeyT", ctrlKey: true, altKey: true }), undefined);
});

test("every printable-key shortcut has a modifier", () => {
    for (const { combo } of SHORTCUTS) {
        const isPrintable = combo.code.startsWith("Key") || combo.code.startsWith("Digit");
        assert.ok(!isPrintable || combo.mod || combo.alt, combo.code);
    }
});

test("formats keys and aria-keyshortcuts", () => {
    assert.deepEqual(comboKeys({ code: "KeyK", mod: true }), ["Mod", "K"]);
    assert.deepEqual(comboKeys({ code: "ArrowLeft", shift: true }), ["Shift", "←"]);
    assert.equal(ariaKeyShortcuts("search"), "Control+K Meta+K");
    assert.equal(ariaKeyShortcuts("theme"), "Alt+T");
    assert.equal(ariaKeyShortcuts("prevPage"), "Shift+ArrowLeft");
});

test("swaps modifier labels for macOS symbols only on macOS", () => {
    const window = new Window({ url: "https://example.test/" });
    window.document.body.innerHTML =
        '<kbd data-key="Mod">Ctrl</kbd><kbd data-key="Alt">Alt</kbd><kbd>K</kbd>';
    const texts = () => Array.from(window.document.querySelectorAll("kbd"), (k) => k.textContent);

    applyPlatformKeys(window.document as unknown as Document, false);
    assert.deepEqual(texts(), ["Ctrl", "Alt", "K"]);

    applyPlatformKeys(window.document as unknown as Document, true);
    assert.deepEqual(texts(), ["⌘", "⌥", "K"]);
});

test("Escape is a bare shortcut only for going back", () => {
    assert.equal(findShortcut({ ...base, code: "Escape" })?.id, "back");
    assert.equal(findShortcut({ ...base, code: "Escape", shiftKey: true }), undefined);
    assert.deepEqual(comboKeys({ code: "Escape" }), ["Esc"]);
});
