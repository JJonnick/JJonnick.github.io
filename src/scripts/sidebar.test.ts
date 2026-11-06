import assert from "node:assert/strict";
import test from "node:test";
import { type HTMLElement, Window } from "happy-dom";
import { carrySidebarToDocument, initSidebarToggle, toggleSidebar } from "./sidebar.ts";

function setup(html = '<button data-sidebar-toggle aria-expanded="true"></button>') {
    const window = new Window({ url: "https://example.test/" });
    window.document.body.innerHTML = html;
    return { window, document: window.document as unknown as Document, storage: window.localStorage };
}

test("toggling collapses, expands and persists the state", () => {
    const { document, storage } = setup();

    toggleSidebar(document, storage);
    assert.equal(document.documentElement.dataset.sidebar, "collapsed");
    assert.equal(storage.getItem("sidebar"), "collapsed");

    toggleSidebar(document, storage);
    assert.equal(document.documentElement.dataset.sidebar, undefined);
    assert.equal(storage.getItem("sidebar"), "expanded");
});

test("toggle buttons mirror the state in aria-expanded and aria-label", () => {
    const { window, document, storage } = setup();
    initSidebarToggle(document, storage);
    const button = window.document.querySelector<HTMLElement>("[data-sidebar-toggle]");

    assert.equal(button?.getAttribute("aria-expanded"), "true");
    assert.equal(button?.getAttribute("aria-label"), "Contraer menú");

    button?.dispatchEvent(new window.Event("click", { bubbles: true }));

    assert.equal(button?.getAttribute("aria-expanded"), "false");
    assert.equal(button?.getAttribute("aria-label"), "Expandir menú");
});

test("a keyboard toggle skips the transition, a pointer toggle keeps it", () => {
    const { document, storage } = setup();

    toggleSidebar(document, storage, { instant: true });
    assert.equal(document.documentElement.hasAttribute("data-sidebar-instant"), true);

    toggleSidebar(document, storage);
    assert.equal(document.documentElement.hasAttribute("data-sidebar-instant"), false);
});

test("still toggles when storage throws", () => {
    const { document } = setup();
    const broken = {
        setItem: () => {
            throw new Error("blocked");
        },
    };

    toggleSidebar(document, broken);

    assert.equal(document.documentElement.dataset.sidebar, "collapsed");
});

test("carries the collapsed state onto the incoming document", () => {
    const current = setup();
    const incoming = setup();
    current.document.documentElement.dataset.sidebar = "collapsed";

    carrySidebarToDocument(incoming.document, current.document);
    assert.equal(incoming.document.documentElement.dataset.sidebar, "collapsed");

    delete current.document.documentElement.dataset.sidebar;
    carrySidebarToDocument(incoming.document, current.document);
    assert.equal(incoming.document.documentElement.dataset.sidebar, undefined);
});
