import { initArrowNavigation } from "@/scripts/arrow-navigation";
import { focusPageStart } from "@/scripts/page-focus";
import { initShortcuts } from "@/scripts/shortcuts";

const runtimeWindow = window as Window & { __keyboardBound?: boolean };

// Delegated on document, so one listener covers every page the ClientRouter swaps in.
if (!runtimeWindow.__keyboardBound) {
    initArrowNavigation(document);
    initShortcuts(document);
    // Fires only on client-side navigations, never on the first load.
    document.addEventListener("astro:after-swap", () => focusPageStart(document));
    runtimeWindow.__keyboardBound = true;
}
