import { createLoader, parseAsStringLiteral } from "nuqs";
import {
    CHARACTER_PAGE_SIZE,
    getFilteredCharacterPage,
    getVisiblePageNumbers,
} from "../services/character-list.ts";

interface CharacterFilterLocation {
    href: string;
    pathname: string;
    search: string;
}

interface CharacterFilterHistory {
    pushState(data: unknown, unused: string, url?: string | URL | null): void;
    replaceState(data: unknown, unused: string, url?: string | URL | null): void;
}

interface CharacterFilterWindow extends EventTarget {
    location: CharacterFilterLocation;
    history: CharacterFilterHistory;
}

interface CharacterFilterState {
    element: string;
    rarity: string;
}

type FilterSelector = "[data-filter-element]" | "[data-filter-rarity]";

function readOptions(filtersBar: HTMLElement, key: "elementOptions" | "rarityOptions") {
    return (filtersBar.dataset[key] ?? "")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);
}

function readFilterState(filtersBar: HTMLElement, search: string): CharacterFilterState {
    const elements = readOptions(filtersBar, "elementOptions");
    const rarities = readOptions(filtersBar, "rarityOptions");
    const filterParsers = {
        element: parseAsStringLiteral(["all", ...elements]).withDefault("all"),
        rarity: parseAsStringLiteral(["all", ...rarities]).withDefault("all"),
    };

    // nuqs already clamps each param to its allowed literals (or "all"),
    // so the loader output is the validated state — no schema needed.
    return createLoader(filterParsers)(search);
}

function findFilterButton(
    filtersBar: HTMLElement,
    selector: FilterSelector,
    value: string,
): HTMLElement | undefined {
    const datasetKey = selector === "[data-filter-element]" ? "filterElement" : "filterRarity";

    return Array.from(filtersBar.querySelectorAll<HTMLElement>(selector)).find(
        (button) => button.dataset[datasetKey] === value,
    );
}

export function initCharacterFilters(
    document: Document,
    window: CharacterFilterWindow,
): () => void {
    const grid = document.getElementById("character-grid");
    const noResults = document.getElementById("no-results");
    const filtersBar = document.getElementById("character-filters");
    if (!grid || !filtersBar) return () => undefined;

    const pageSize =
        Number(filtersBar.dataset.pageSize ?? String(CHARACTER_PAGE_SIZE)) || CHARACTER_PAGE_SIZE;
    const basePath = filtersBar.dataset.filterNs ?? "/";
    let activeElement = "all";
    let activeRarity = "all";
    const cleanupCallbacks: Array<() => void> = [];

    const pageUrl = (page: number): string => {
        const url = new URL(window.location.href);
        url.pathname = page === 1 ? basePath : `${basePath}/${page}`;
        return `${url.pathname}${url.search}`;
    };

    const currentPathPage = (): number => {
        const escapedBasePath = basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const match = window.location.pathname.match(new RegExp(`^${escapedBasePath}/(\\d+)/?$`));
        return Number(match?.[1] ?? "1");
    };

    const updateUrl = (state: CharacterFilterState) => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        state.element === "all" ? params.delete("element") : params.set("element", state.element);
        state.rarity === "all" ? params.delete("rarity") : params.set("rarity", state.rarity);

        url.pathname = url.pathname.replace(/\/\d+\/?$/, "") || "/";
        url.search = params.toString();
        window.history.pushState({}, "", `${url.pathname}${url.search}`);
    };

    const activateButtons = (selector: FilterSelector, value: string): string => {
        const selected =
            findFilterButton(filtersBar, selector, value) ??
            findFilterButton(filtersBar, selector, "all");

        filtersBar.querySelectorAll<HTMLElement>(selector).forEach((button) => {
            const isActive = button === selected;
            button.classList.toggle("ui-control-active", isActive);
            button.classList.toggle("ui-control-idle", !isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        return selector === "[data-filter-element]"
            ? (selected?.dataset.filterElement ?? "all")
            : (selected?.dataset.filterRarity ?? "all");
    };

    const syncPagination = (totalItems: number, currentPage: number, totalPages: number) => {
        const nav = document.querySelector<HTMLElement>("[data-pagination-nav]");
        const pageLinks = document.querySelectorAll<HTMLAnchorElement>("[data-page-number]");
        const prevLink = document.querySelector<HTMLAnchorElement>("[data-page-prev-link]");
        const prevDisabled = document.querySelector<HTMLElement>("[data-page-prev-disabled]");
        const nextLink = document.querySelector<HTMLAnchorElement>("[data-page-next-link]");
        const nextDisabled = document.querySelector<HTMLElement>("[data-page-next-disabled]");
        const startEllipsis = document.querySelector<HTMLElement>("[data-page-start-ellipsis]");
        const endEllipsis = document.querySelector<HTMLElement>("[data-page-end-ellipsis]");
        const visiblePages = getVisiblePageNumbers(currentPage, totalPages);
        const visiblePageSet = new Set(visiblePages);

        if (nav) nav.hidden = totalItems === 0 || totalPages <= 1;
        if (prevLink) {
            prevLink.hidden = currentPage <= 1;
            prevLink.href = pageUrl(Math.max(1, currentPage - 1));
        }
        if (prevDisabled) prevDisabled.hidden = currentPage > 1;
        if (nextLink) {
            nextLink.hidden = currentPage >= totalPages;
            nextLink.href = pageUrl(Math.min(totalPages, currentPage + 1));
        }
        if (nextDisabled) nextDisabled.hidden = currentPage < totalPages;

        pageLinks.forEach((link) => {
            const pageNumber = Number(link.dataset.pageNumber ?? "0");
            link.hidden = pageNumber > totalPages || !visiblePageSet.has(pageNumber);
            link.toggleAttribute("aria-hidden", link.hidden);
            link.classList.toggle("ui-control-active", pageNumber === currentPage);
            link.classList.toggle("ui-control-idle", pageNumber !== currentPage);
            if (pageNumber === currentPage) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
            link.href = pageUrl(pageNumber);
        });

        if (startEllipsis) startEllipsis.hidden = (visiblePages[1] ?? 0) <= 2;
        if (endEllipsis) {
            endEllipsis.hidden = (visiblePages.at(-2) ?? totalPages) >= totalPages - 1;
        }
    };

    const applyFilters = () => {
        const cards = Array.from(
            grid.querySelectorAll<HTMLElement>("[data-filter-card]"),
            (card) => ({
                card,
                element: card.dataset.element,
                rarity: card.dataset.rarity,
            }),
        );
        const requestedPage = currentPathPage();
        const page = getFilteredCharacterPage(
            cards,
            { element: activeElement, rarity: activeRarity },
            requestedPage,
            pageSize,
        );
        const visibleCards = new Set(page.items.map(({ card }) => card));

        if (page.currentPage !== requestedPage && page.totalItems > 0) {
            window.history.replaceState({}, "", pageUrl(page.currentPage));
        }

        cards.forEach(({ card }) => {
            card.hidden = !visibleCards.has(card);
        });
        if (noResults) noResults.hidden = page.totalItems > 0;
        syncPagination(page.totalItems, page.currentPage, page.totalPages);
    };

    const syncFromUrl = () => {
        const state = readFilterState(filtersBar, window.location.search);
        activeElement = activateButtons("[data-filter-element]", state.element);
        activeRarity = activateButtons("[data-filter-rarity]", state.rarity);
        applyFilters();
    };

    const bindFilterButtons = (selector: FilterSelector) => {
        filtersBar.querySelectorAll<HTMLElement>(selector).forEach((button) => {
            const onClick = () => {
                if (selector === "[data-filter-element]") {
                    activeElement = activateButtons(
                        selector,
                        button.dataset.filterElement ?? "all",
                    );
                } else {
                    activeRarity = activateButtons(selector, button.dataset.filterRarity ?? "all");
                }
                updateUrl({ element: activeElement, rarity: activeRarity });
                applyFilters();
            };
            button.addEventListener("click", onClick);
            cleanupCallbacks.push(() => button.removeEventListener("click", onClick));
        });
    };

    bindFilterButtons("[data-filter-element]");
    bindFilterButtons("[data-filter-rarity]");
    window.addEventListener("popstate", syncFromUrl);
    cleanupCallbacks.push(() => window.removeEventListener("popstate", syncFromUrl));
    syncFromUrl();

    return () => {
        cleanupCallbacks.forEach((cleanup) => {
            cleanup();
        });
    };
}
