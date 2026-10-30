import { initArrowNavigation } from "@/scripts/arrow-navigation";
import { initShortcuts } from "@/scripts/shortcuts";

const runtimeWindow = window as Window & { __keyboardBound?: boolean };

// Delegated on document, so one listener covers every page the ClientRouter swaps in.
if (!runtimeWindow.__keyboardBound) {
    initArrowNavigation(document);
    initShortcuts(document);
    runtimeWindow.__keyboardBound = true;
}
