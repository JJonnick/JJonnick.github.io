import {
    CHARACTER_PAGE_SIZE,
    type CharacterListView,
    getCharacterListView,
    getFilteredListUrl,
} from "../services/character-list.ts";

interface CharacterFilterHistory {
    pushState(data: unknown, unused: string, url?: string | URL | null): void;
    replaceState(data: unknown, unused: string, url?: string | URL | null): void;
}

interface CharacterFilterWindow extends EventTarget {
    location: { href: string };
    history: CharacterFilterHistory;
}

type FilterKey = "element" | "rarity";

const FILTER_ATTRIBUTE: Record<FilterKey, string> = {
    element: "data-filter-element",
    rarity: "data-filter-rarity",
};

function setActive(element: HTMLElement, isActive: boolean) {
    element.classList.toggle("ui-control-active", isActive);
    element.classList.toggle("ui-control-idle", !isActive);
}

function setLink(
    document: Document,
    linkSelector: string,
    disabledSelector: string,
    { href, isDisabled }: { href: string; isDisabled: boolean },
) {
    const link = document.querySelector<HTMLAnchorElement>(linkSelector);
    const disabled = document.querySelector<HTMLElement>(disabledSelector);
    if (link) {
        link.hidden = isDisabled;
        link.href = href;
    }
    if (disabled) disabled.hidden = !isDisabled;
}

function applyPagination(document: Document, { pagination }: CharacterListView<unknown>) {
    const nav = document.querySelector<HTMLElement>("[data-pagination-nav]");
    if (nav) nav.hidden = pagination.isHidden;

    setLink(document, "[data-page-prev-link]", "[data-page-prev-disabled]", pagination.prev);
    setLink(document, "[data-page-next-link]", "[data-page-next-disabled]", pagination.next);

    const links = new Map(pagination.links.map((link) => [link.page, link]));
    document.querySelectorAll<HTMLAnchorElement>("[data-page-number]").forEach((anchor) => {
        const link = links.get(Number(anchor.dataset.pageNumber ?? "0"));
        anchor.hidden = !link?.isVisible;
        anchor.toggleAttribute("aria-hidden", anchor.hidden);
        setActive(anchor, Boolean(link?.isCurrent));
        if (link?.isCurrent) anchor.setAttribute("aria-current", "page");
        else anchor.removeAttribute("aria-current");
        if (link) anchor.href = link.href;
    });

    const startEllipsis = document.querySelector<HTMLElement>("[data-page-start-ellipsis]");
    const endEllipsis = document.querySelector<HTMLElement>("[data-page-end-ellipsis]");
    if (startEllipsis) startEllipsis.hidden = !pagination.showStartEllipsis;
    if (endEllipsis) endEllipsis.hidden = !pagination.showEndEllipsis;
}

export function initCharacterFilters(
    document: Document,
    window: CharacterFilterWindow,
): () => void {
    const grid = document.getElementById("character-grid");
    const noResults = document.getElementById("no-results");
    const filtersBar = document.getElementById("character-filters");
    if (!grid || !filtersBar) return () => undefined;

    const basePath = filtersBar.dataset.basePath ?? "/";
    const pageSize = Number(filtersBar.dataset.pageSize) || CHARACTER_PAGE_SIZE;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-filter-card]"), (card) => ({
        card,
        element: card.dataset.element,
        rarity: card.dataset.rarity,
    }));
    const cleanupCallbacks: Array<() => void> = [];

    const render = () => {
        const view = getCharacterListView(cards, new URL(window.location.href), {
            basePath,
            pageSize,
        });

        if (view.canonicalUrl) window.history.replaceState({}, "", view.canonicalUrl);

        const visibleCards = new Set(view.items.map(({ card }) => card));
        for (const { card } of cards) card.hidden = !visibleCards.has(card);
        if (noResults) noResults.hidden = !view.isEmpty;

        for (const key of ["element", "rarity"] as const) {
            const attribute = FILTER_ATTRIBUTE[key];
            filtersBar.querySelectorAll<HTMLElement>(`[${attribute}]`).forEach((button) => {
                const isActive = button.getAttribute(attribute) === view.filters[key];
                setActive(button, isActive);
                button.setAttribute("aria-pressed", String(isActive));
            });
        }

        applyPagination(document, view);
        return view;
    };

    let view = render();

    for (const key of ["element", "rarity"] as const) {
        const attribute = FILTER_ATTRIBUTE[key];
        filtersBar.querySelectorAll<HTMLElement>(`[${attribute}]`).forEach((button) => {
            const onClick = () => {
                const filters = { ...view.filters, [key]: button.getAttribute(attribute) ?? "all" };
                const url = new URL(window.location.href);
                window.history.pushState({}, "", getFilteredListUrl(url, basePath, filters));
                view = render();
            };
            button.addEventListener("click", onClick);
            cleanupCallbacks.push(() => button.removeEventListener("click", onClick));
        });
    }

    const onPopState = () => {
        view = render();
    };
    window.addEventListener("popstate", onPopState);
    cleanupCallbacks.push(() => window.removeEventListener("popstate", onPopState));

    return () => {
        for (const cleanup of cleanupCallbacks) cleanup();
    };
}
