import { initCharacterFilters } from "@/scripts/character-filter-controller";

const runtimeWindow = window as Window & {
    __characterFiltersCleanup?: () => void;
    __characterFiltersPageLoadBound?: boolean;
};

function initializeCharacterFilters() {
    runtimeWindow.__characterFiltersCleanup?.();
    runtimeWindow.__characterFiltersCleanup = initCharacterFilters(document, window);
}

if (!runtimeWindow.__characterFiltersPageLoadBound) {
    document.addEventListener("astro:page-load", initializeCharacterFilters);
    runtimeWindow.__characterFiltersPageLoadBound = true;
}

initializeCharacterFilters();
