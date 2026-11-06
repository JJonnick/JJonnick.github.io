import { initArrowNavigation } from "@/scripts/arrow-navigation";
import { focusPageStart } from "@/scripts/page-focus";
import { applyPlatformKeys } from "@/scripts/shortcut-map";
import { initShortcuts } from "@/scripts/shortcuts";
import { carrySidebarToDocument, initSidebarToggle, syncSidebarToggles } from "@/scripts/sidebar";

const runtimeWindow = window as Window & { __keyboardBound?: boolean };

const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

// Delegated on document, so one listener covers every page the ClientRouter swaps in.
if (!runtimeWindow.__keyboardBound) {
    initArrowNavigation(document);
    initShortcuts(document);
    initSidebarToggle(document, localStorage);

    // The ClientRouter swaps the <html> attributes: carry the sidebar state over and re-sync the
    // freshly rendered toggle buttons.
    document.addEventListener("astro:before-swap", (event) =>
        carrySidebarToDocument((event as Event & { newDocument: Document }).newDocument, document),
    );
    document.addEventListener("astro:page-load", () => syncSidebarToggles(document));

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
