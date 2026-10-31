import { carryThemeToDocument } from "@/scripts/theme-toggle";

const runtimeWindow = window as Window & { __themePersistBound?: boolean };

// Document-level listener: one registration covers every page the ClientRouter swaps in.
if (!runtimeWindow.__themePersistBound) {
    document.addEventListener("astro:before-swap", (event) => {
        carryThemeToDocument((event as Event & { newDocument: Document }).newDocument, document);
    });
    runtimeWindow.__themePersistBound = true;
}
