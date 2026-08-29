import { createLoader, parseAsStringLiteral } from "nuqs";
import { z } from "zod";
import { getFilteredCharacterPage } from "@/services/character-list";

const runtimeWindow = window as Window & {
    __characterFiltersPageLoadBound?: boolean;
};

function getFilterStateFromUrl() {
    const filtersBar = document.getElementById("character-filters");
    const elements = (filtersBar?.dataset.elementOptions ?? "")
        .split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);
    const rarities = (filtersBar?.dataset.rarityOptions ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

    const filterParsers = {
        element: parseAsStringLiteral(["all", ...elements]).withDefault("all"),
        rarity: parseAsStringLiteral(["all", ...rarities]).withDefault("all"),
    };

    const loadFilters = createLoader(filterParsers);
    const schema = z.object({
        element: z.enum(["all", ...elements] as ["all", ...string[]]).default("all"),
        rarity: z.enum(["all", ...rarities] as ["all", ...string[]]).default("all"),
    });

    const parsed = loadFilters(window.location.search);
    const validated = schema.safeParse(parsed);

    return validated.success ? validated.data : { element: "all", rarity: "all" };
}

function updateUrlFilters(nextState: { element: string; rarity: string }) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (nextState.element === "all") {
        params.delete("element");
    } else {
        params.set("element", nextState.element);
    }

    if (nextState.rarity === "all") {
        params.delete("rarity");
    } else {
        params.set("rarity", nextState.rarity);
    }

    const sanitizedPath = url.pathname.replace(/\/\d+\/?$/, "") || "/";
    url.pathname = sanitizedPath;
    url.search = params.toString();

    const nextUrl = `${url.pathname}${url.search}`;
    window.history.pushState({}, "", nextUrl);
}

function initCharacterFilters() {
    const grid = document.getElementById("character-grid");
    const noResults = document.getElementById("no-results");
    const filtersBar = document.getElementById("character-filters");
    if (!grid || !filtersBar) return;

    const gridEl = grid as HTMLElement;
    const filtersBarEl = filtersBar as HTMLElement;
    const pageSize = Number(filtersBarEl.dataset.pageSize ?? "24") || 24;
    const basePath = filtersBarEl.dataset.filterNs ?? "/";

    let activeElement = getFilterStateFromUrl().element;
    let activeRarity = getFilterStateFromUrl().rarity;

    function pageUrl(page: number): string {
        const url = new URL(window.location.href);
        url.pathname = page === 1 ? basePath : `${basePath}/${page}`;
        return `${url.pathname}${url.search}`;
    }

    function getCurrentPathPage(): number {
        const escapedBasePath = basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const match = window.location.pathname.match(new RegExp(`^${escapedBasePath}/(\\d+)/?$`));
        return Number(match?.[1] ?? "1");
    }

    function syncPaginationState(totalItems: number, currentPage: number, totalPages: number) {
        const nav = document.querySelector<HTMLElement>("[data-pagination-nav]");
        const pageButtons = document.querySelectorAll<HTMLElement>("[data-page-number]");
        const prevLink = document.querySelector<HTMLAnchorElement>("[data-page-prev-link]");
        const prevDisabled = document.querySelector<HTMLElement>("[data-page-prev-disabled]");
        const nextLink = document.querySelector<HTMLAnchorElement>("[data-page-next-link]");
        const nextDisabled = document.querySelector<HTMLElement>("[data-page-next-disabled]");

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

        pageButtons.forEach((button) => {
            const pageNumber = Number(button.dataset.pageNumber ?? "0");
            const shouldShow = pageNumber <= totalPages;
            button.hidden = !shouldShow;
            button.setAttribute("aria-hidden", String(!shouldShow));
            button.classList.toggle("ui-control-active", pageNumber === currentPage);
            button.classList.toggle("ui-control-idle", pageNumber !== currentPage);

            if (pageNumber === currentPage) {
                button.setAttribute("aria-current", "page");
            } else {
                button.removeAttribute("aria-current");
            }

            if (button instanceof HTMLAnchorElement) button.href = pageUrl(pageNumber);
        });
    }

    function applyFilters() {
        const cards = Array.from(
            gridEl.querySelectorAll<HTMLElement>("[data-filter-card]"),
            (card) => ({
                card,
                element: card.dataset.element,
                rarity: card.dataset.rarity,
            }),
        );
        const requestedPage = getCurrentPathPage();
        const characterPage = getFilteredCharacterPage(
            cards,
            { element: activeElement, rarity: activeRarity },
            requestedPage,
            pageSize,
        );
        const visibleCards = new Set(characterPage.items.map(({ card }) => card));

        if (characterPage.currentPage !== requestedPage && characterPage.totalItems > 0) {
            window.history.replaceState({}, "", pageUrl(characterPage.currentPage));
        }

        cards.forEach(({ card }) => {
            card.hidden = !visibleCards.has(card);
        });

        if (noResults) noResults.hidden = characterPage.totalItems > 0;
        syncPaginationState(
            characterPage.totalItems,
            characterPage.currentPage,
            characterPage.totalPages,
        );
    }

    function activateFilterButtons(
        selector: "[data-filter-element]" | "[data-filter-rarity]",
        clickedBtn: Element,
    ) {
        filtersBarEl.querySelectorAll(selector).forEach((btn) => {
            const isActive = btn === clickedBtn;
            btn.classList.toggle("ui-control-active", isActive);
            btn.classList.toggle("ui-control-idle", !isActive);
            btn.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
    }

    const savedElementBtn = filtersBarEl.querySelector<HTMLElement>(
        `[data-filter-element="${CSS.escape(activeElement)}"]`,
    );
    if (savedElementBtn) {
        activateFilterButtons("[data-filter-element]", savedElementBtn);
    } else {
        activeElement = "all";
        const defaultBtn = filtersBarEl.querySelector<HTMLElement>('[data-filter-element="all"]');
        if (defaultBtn) {
            activateFilterButtons("[data-filter-element]", defaultBtn);
        }
    }

    const savedRarityBtn = filtersBarEl.querySelector<HTMLElement>(
        `[data-filter-rarity="${CSS.escape(activeRarity)}"]`,
    );
    if (savedRarityBtn) {
        activateFilterButtons("[data-filter-rarity]", savedRarityBtn);
    } else {
        activeRarity = "all";
        const defaultBtn = filtersBarEl.querySelector<HTMLElement>('[data-filter-rarity="all"]');
        if (defaultBtn) {
            activateFilterButtons("[data-filter-rarity]", defaultBtn);
        }
    }

    applyFilters();

    filtersBarEl.querySelectorAll<HTMLElement>("[data-filter-element]").forEach((btn) => {
        btn.addEventListener("click", () => {
            activeElement = btn.dataset.filterElement ?? "all";
            activateFilterButtons("[data-filter-element]", btn);
            updateUrlFilters({ element: activeElement, rarity: activeRarity });
            applyFilters();
        });
    });

    filtersBarEl.querySelectorAll<HTMLElement>("[data-filter-rarity]").forEach((btn) => {
        btn.addEventListener("click", () => {
            activeRarity = btn.dataset.filterRarity ?? "all";
            activateFilterButtons("[data-filter-rarity]", btn);
            updateUrlFilters({ element: activeElement, rarity: activeRarity });
            applyFilters();
        });
    });
}

if (!runtimeWindow.__characterFiltersPageLoadBound) {
    document.addEventListener("astro:page-load", initCharacterFilters);
    runtimeWindow.__characterFiltersPageLoadBound = true;
}
