import assert from "node:assert/strict";
import test from "node:test";
import { type HTMLInputElement, Window } from "happy-dom";
import { carryThemeToDocument, initThemeToggle } from "./theme-toggle.ts";

test("syncs the switch with the document theme", () => {
    const window = new Window({ url: "https://example.test/" });
    window.document.documentElement.classList.add("dark");
    window.document.body.innerHTML = '<input type="checkbox" data-theme-toggle />';

    initThemeToggle(window.document as unknown as Document, window.localStorage);

    const input = window.document.querySelector<HTMLInputElement>("[data-theme-toggle]");
    assert.equal(input?.checked, true);
});

test("persists theme changes", () => {
    const window = new Window({ url: "https://example.test/" });
    window.document.body.innerHTML = '<input type="checkbox" data-theme-toggle />';
    const input = window.document.querySelector<HTMLInputElement>("[data-theme-toggle]");
    initThemeToggle(window.document as unknown as Document, window.localStorage);

    if (!input) throw new Error("Theme toggle fixture is missing");
    input.checked = true;
    input.dispatchEvent(new window.Event("change"));

    assert.equal(window.document.documentElement.classList.contains("dark"), true);
    assert.equal(window.localStorage.getItem("theme"), "dark");
});

test("carries the dark theme onto the incoming document", () => {
    const current = new Window({ url: "https://example.test/" });
    const incoming = new Window({ url: "https://example.test/next" });
    current.document.documentElement.classList.add("dark");

    carryThemeToDocument(incoming.document as unknown as Document, current.document as unknown as Document);

    assert.equal(incoming.document.documentElement.classList.contains("dark"), true);
});

test("carries the light theme onto the incoming document", () => {
    const current = new Window({ url: "https://example.test/" });
    const incoming = new Window({ url: "https://example.test/next" });
    incoming.document.documentElement.classList.add("dark");

    carryThemeToDocument(incoming.document as unknown as Document, current.document as unknown as Document);

    assert.equal(incoming.document.documentElement.classList.contains("dark"), false);
});
