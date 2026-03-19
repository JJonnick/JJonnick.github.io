const runtimeWindow = window as Window & {
    __characterFiltersPageLoadBound?: boolean;
};

function initCharacterFilters() {
    const grid = document.getElementById("character-grid");
    const noResults = document.getElementById("no-results");
    if (!grid) return;

    let activeElement = "all";
    let activeRarity = "all";

    function applyFilters() {
        const cards = grid!.querySelectorAll<HTMLElement>("[data-filter-card]");
        let visible = 0;
        cards.forEach((card) => {
            const el = card.dataset.element ?? "";
            const rarity = card.dataset.rarity ?? "";
            const matchEl = activeElement === "all" || el === activeElement;
            const matchRarity =
                activeRarity === "all" || rarity === activeRarity;
            const show = matchEl && matchRarity;
            card.hidden = !show;
            if (show) visible++;
        });
        if (noResults) noResults.hidden = visible > 0;
    }

    function activateFilterButtons(selector: string, clickedBtn: Element) {
        document.querySelectorAll(selector).forEach((btn) => {
            const isActive = btn === clickedBtn;
            btn.classList.toggle("ui-control-active", isActive);
            btn.classList.toggle("ui-control-idle", !isActive);
            btn.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
    }

    document.querySelectorAll<HTMLElement>("[data-filter-element]").forEach((btn) => {
        btn.addEventListener("click", () => {
            activeElement = btn.dataset.filterElement ?? "all";
            activateFilterButtons("[data-filter-element]", btn);
            applyFilters();
        });
    });

    document.querySelectorAll<HTMLElement>("[data-filter-rarity]").forEach((btn) => {
        btn.addEventListener("click", () => {
            activeRarity = btn.dataset.filterRarity ?? "all";
            activateFilterButtons("[data-filter-rarity]", btn);
            applyFilters();
        });
    });
}

if (!runtimeWindow.__characterFiltersPageLoadBound) {
    document.addEventListener("astro:page-load", initCharacterFilters);
    runtimeWindow.__characterFiltersPageLoadBound = true;
}
