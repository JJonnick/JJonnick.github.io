const runtimeWindow = window as Window & {
    __characterFiltersPageLoadBound?: boolean;
};

function initCharacterFilters() {
    const grid = document.getElementById("character-grid");
    const noResults = document.getElementById("no-results");
    const filtersBar = document.getElementById("character-filters");
    if (!grid) return;

    const filterNs = filtersBar?.dataset.filterNs ?? "";
    const storageKey = filterNs ? `char-filters:${filterNs}` : null;

    let savedState: { element?: string; rarity?: string } = {};
    if (storageKey) {
        try {
            savedState = JSON.parse(
                sessionStorage.getItem(storageKey) ?? "{}",
            );
        } catch {
            // ignore parse errors
        }
    }

    let activeElement = savedState.element ?? "all";
    let activeRarity = savedState.rarity ?? "all";

    function saveState() {
        if (!storageKey) return;
        try {
            sessionStorage.setItem(
                storageKey,
                JSON.stringify({
                    element: activeElement,
                    rarity: activeRarity,
                }),
            );
        } catch {
            // ignore storage errors
        }
    }

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

    // Restore saved filter button visual state
    if (activeElement !== "all") {
        const savedBtn = document.querySelector<HTMLElement>(
            `[data-filter-element="${CSS.escape(activeElement)}"]`,
        );
        if (savedBtn) {
            activateFilterButtons("[data-filter-element]", savedBtn);
        } else {
            activeElement = "all";
        }
    }
    if (activeRarity !== "all") {
        const savedBtn = document.querySelector<HTMLElement>(
            `[data-filter-rarity="${CSS.escape(activeRarity)}"]`,
        );
        if (savedBtn) {
            activateFilterButtons("[data-filter-rarity]", savedBtn);
        } else {
            activeRarity = "all";
        }
    }

    applyFilters();

    document
        .querySelectorAll<HTMLElement>("[data-filter-element]")
        .forEach((btn) => {
            btn.addEventListener("click", () => {
                activeElement = btn.dataset.filterElement ?? "all";
                activateFilterButtons("[data-filter-element]", btn);
                applyFilters();
                saveState();
            });
        });

    document
        .querySelectorAll<HTMLElement>("[data-filter-rarity]")
        .forEach((btn) => {
            btn.addEventListener("click", () => {
                activeRarity = btn.dataset.filterRarity ?? "all";
                activateFilterButtons("[data-filter-rarity]", btn);
                applyFilters();
                saveState();
            });
        });
}

if (!runtimeWindow.__characterFiltersPageLoadBound) {
    document.addEventListener("astro:page-load", initCharacterFilters);
    runtimeWindow.__characterFiltersPageLoadBound = true;
}
