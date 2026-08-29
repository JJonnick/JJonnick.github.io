import { createLoader, parseAsStringLiteral } from "nuqs";
import { z } from "zod";

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

    url.search = params.toString();
    const nextUrl = `${url.pathname}${url.search}`;
    window.history.replaceState({}, "", nextUrl);
}

function initCharacterFilters() {
    const grid = document.getElementById("character-grid");
    const noResults = document.getElementById("no-results");
    const filtersBar = document.getElementById("character-filters");
    if (!grid || !filtersBar) return;

    const gridEl = grid as HTMLElement;
    const filtersBarEl = filtersBar as HTMLElement;

    let activeElement = getFilterStateFromUrl().element;
    let activeRarity = getFilterStateFromUrl().rarity;

    function applyFilters() {
        const cards = gridEl.querySelectorAll<HTMLElement>("[data-filter-card]");
        let visible = 0;

        cards.forEach((card) => {
            const el = card.dataset.element ?? "";
            const rarity = card.dataset.rarity ?? "";
            const matchEl = activeElement === "all" || el === activeElement;
            const matchRarity = activeRarity === "all" || rarity === activeRarity;
            const show = matchEl && matchRarity;
            card.hidden = !show;
            if (show) visible++;
        });

        if (noResults) noResults.hidden = visible > 0;
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
        const defaultBtn = filtersBarEl.querySelector<HTMLElement>(
            '[data-filter-element="all"]',
        );
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
        const defaultBtn = filtersBarEl.querySelector<HTMLElement>(
            '[data-filter-rarity="all"]',
        );
        if (defaultBtn) {
            activateFilterButtons("[data-filter-rarity]", defaultBtn);
        }
    }

    applyFilters();

    filtersBarEl
        .querySelectorAll<HTMLElement>("[data-filter-element]")
        .forEach((btn) => {
            btn.addEventListener("click", () => {
                activeElement = btn.dataset.filterElement ?? "all";
                activateFilterButtons("[data-filter-element]", btn);
                updateUrlFilters({ element: activeElement, rarity: activeRarity });
                applyFilters();
            });
        });

    filtersBarEl
        .querySelectorAll<HTMLElement>("[data-filter-rarity]")
        .forEach((btn) => {
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
