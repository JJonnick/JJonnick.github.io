import { findShortcut, type ShortcutId } from "./shortcut-map.ts";

const TYPING_SELECTOR = "input:not([data-theme-toggle]), textarea, select, [contenteditable]";

function clickVisible(document: Document, selector: string) {
    const link = document.querySelector<HTMLElement>(selector);
    if (link && !link.closest("[hidden]")) link.click();
}

function openGameSwitcher(document: Document) {
    const popover = document.getElementById("game-switcher-popover");
    if (!popover) return;
    if (popover.matches(":popover-open")) {
        popover.hidePopover();
        return;
    }
    popover.showPopover();
    const target =
        popover.querySelector<HTMLElement>("[aria-current]") ?? popover.querySelector<HTMLElement>("a");
    target?.focus();
}

/** Returns false when the page has no search box, so the key keeps its default. */
function focusSearch(document: Document): boolean {
    const input = document.querySelector<HTMLInputElement>("[data-filter-search]");
    if (!input) return false;
    input.focus();
    input.select();
    return true;
}

function toggleHelp(document: Document) {
    const dialog = document.getElementById("shortcuts-dialog") as HTMLDialogElement | null;
    if (!dialog) return;
    if (dialog.open) dialog.close();
    else dialog.showModal();
}

/** Esc also closes dialogs and popovers, so it only goes back when none is open. */
function goBackToList(document: Document): boolean {
    if (document.querySelector("dialog[open], :popover-open")) return false;
    const link = document.querySelector<HTMLElement>("[data-back-to-list]");
    if (!link) return false;
    link.click();
    return true;
}

const ACTIONS: Record<ShortcutId, (document: Document) => boolean | undefined> = {
    search: focusSearch,
    help: (document) => void toggleHelp(document),
    theme: (document) => void document.querySelector<HTMLElement>("[data-theme-toggle]")?.click(),
    gameMenu: (document) => void openGameSwitcher(document),
    prevPage: (document) => void clickVisible(document, "[data-page-prev-link]"),
    nextPage: (document) => void clickVisible(document, "[data-page-next-link]"),
    back: goBackToList,
};

/** Shortcut handler driven by `SHORTCUTS`; see `shortcut-map.ts` for the keys. */
export function initShortcuts(document: Document): () => void {
    const onKeyDown = (event: KeyboardEvent) => {
        if (event.defaultPrevented) return;
        const shortcut = findShortcut(event);
        if (!shortcut) return;
        if (!shortcut.whileTyping && (event.target as Element | null)?.closest(TYPING_SELECTOR)) return;

        if (ACTIONS[shortcut.id](document) !== false) event.preventDefault();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
}
