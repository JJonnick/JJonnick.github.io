const TYPING_SELECTOR = "input:not([data-theme-toggle]), textarea, select, [contenteditable]";

function isVisible(element: Element | null): element is HTMLElement {
    return element !== null && !element.closest("[hidden]");
}

function openGameSwitcher(document: Document) {
    const popover = document.getElementById("game-switcher-popover");
    if (!popover) return;
    if (popover.matches(":popover-open")) {
        popover.hidePopover();
        return;
    }
    popover.showPopover();
    const target = popover.querySelector<HTMLElement>("[aria-current]") ?? popover.querySelector<HTMLElement>("a");
    target?.focus();
}

function focusSearch(document: Document): boolean {
    const input = document.querySelector<HTMLInputElement>("[data-filter-search]");
    if (!input) return false;
    input.focus();
    input.select();
    return true;
}

const ACTIONS: Record<string, (document: Document) => void> = {
    "[": (document) => {
        const link = document.querySelector("[data-page-prev-link]");
        if (isVisible(link)) link.click();
    },
    "]": (document) => {
        const link = document.querySelector("[data-page-next-link]");
        if (isVisible(link)) link.click();
    },
    t: (document) => document.querySelector<HTMLElement>("[data-theme-toggle]")?.click(),
    g: openGameSwitcher,
    "/": (document) => void focusSearch(document),
};

/** Single-key shortcuts: `[` `]` change page, `t` toggles the theme, `g` opens the game menu. */
export function initShortcuts(document: Document): () => void {
    const onKeyDown = (event: KeyboardEvent) => {
        if (event.defaultPrevented || event.altKey) return;
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
            if (focusSearch(document)) event.preventDefault();
            return;
        }
        if (event.ctrlKey || event.metaKey) return;
        const action = ACTIONS[event.key];
        if (!action) return;
        if ((event.target as Element | null)?.closest(TYPING_SELECTOR)) return;
        event.preventDefault();
        action(document);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
}
