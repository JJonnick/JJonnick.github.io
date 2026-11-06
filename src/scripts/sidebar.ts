const STORAGE_KEY = "sidebar";
const COLLAPSED = "collapsed";

interface SidebarStorage {
    setItem(key: string, value: string): void;
}

interface ToggleOptions {
    /** Keyboard toggles skip the transition: they repeat too often to animate. */
    instant?: boolean;
}

function isCollapsed(document: Document): boolean {
    return document.documentElement.dataset.sidebar === COLLAPSED;
}

function setCollapsed(document: Document, collapsed: boolean): void {
    if (collapsed) document.documentElement.dataset.sidebar = COLLAPSED;
    else delete document.documentElement.dataset.sidebar;
}

/** Mirrors the state on every toggle button; call after each navigation. */
export function syncSidebarToggles(document: Document): void {
    const collapsed = isCollapsed(document);
    for (const button of document.querySelectorAll<HTMLElement>("[data-sidebar-toggle]")) {
        button.setAttribute("aria-expanded", String(!collapsed));
        button.setAttribute("aria-label", collapsed ? "Expandir menú" : "Contraer menú");
    }
}

// Restoring the saved state happens in the inline <head> script of Layout.astro, before first
// paint, so the sidebar never flashes the wrong width.
export function toggleSidebar(
    document: Document,
    storage: SidebarStorage,
    { instant = false }: ToggleOptions = {},
): void {
    const root = document.documentElement;
    if (instant) {
        root.setAttribute("data-sidebar-instant", "");
        // Two frames: the layout change must paint once without a transition before it comes back.
        const view = document.defaultView;
        view?.requestAnimationFrame(() =>
            view.requestAnimationFrame(() => root.removeAttribute("data-sidebar-instant")),
        );
    } else {
        root.removeAttribute("data-sidebar-instant");
    }

    const collapsed = !isCollapsed(document);
    setCollapsed(document, collapsed);
    syncSidebarToggles(document);
    try {
        storage.setItem(STORAGE_KEY, collapsed ? COLLAPSED : "expanded");
    } catch {
        // The current document still updates.
    }
}

/** Wires every `[data-sidebar-toggle]` button. Returns a cleanup function. */
export function initSidebarToggle(document: Document, storage: SidebarStorage): () => void {
    syncSidebarToggles(document);
    const onClick = (event: Event) => {
        if ((event.target as Element | null)?.closest("[data-sidebar-toggle]")) {
            toggleSidebar(document, storage);
        }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
}

/** The ClientRouter swaps the <html> attributes, so carry the state onto the incoming document. */
export function carrySidebarToDocument(incoming: Document, current: Document): void {
    setCollapsed(incoming, isCollapsed(current));
}
