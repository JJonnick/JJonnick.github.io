import { initArrowNavigation } from "@/scripts/arrow-navigation";
import { focusPageStart } from "@/scripts/page-focus";
import { applyPlatformKeys } from "@/scripts/shortcut-map";
import { initShortcuts } from "@/scripts/shortcuts";

const runtimeWindow = window as Window & { __keyboardBound?: boolean };

const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

// Delegated on document, so one listener covers every page the ClientRouter swaps in.
if (!runtimeWindow.__keyboardBound) {
    initArrowNavigation(document);
    initShortcuts(document);

    // Fires only on client-side navigations, never on the first load.
    document.addEventListener("astro:after-swap", () => focusPageStart(document));
    document.addEventListener("astro:page-load", () => applyPlatformKeys(document, isMac));

    document.addEventListener("click", (event) => {
        const target = event.target as Element | null;
        const dialog = document.getElementById("shortcuts-dialog") as HTMLDialogElement | null;
        if (target?.closest("[data-shortcuts-trigger]")) dialog?.showModal();
        // A click on the backdrop lands on the dialog element itself.
        else if (dialog?.open && target === dialog) dialog.close();
    });

    runtimeWindow.__keyboardBound = true;
}

applyPlatformKeys(document, isMac);
