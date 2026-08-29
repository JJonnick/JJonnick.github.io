import assert from "node:assert/strict";
import test from "node:test";
import { type HTMLInputElement, Window } from "happy-dom";
import { initThemeToggle } from "./theme-toggle.ts";

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
