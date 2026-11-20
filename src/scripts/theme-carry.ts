/**
 * The ClientRouter replaces the <html> attributes with the incoming document's, which has no
 * `dark` class, so dark mode would flash light until the inline script re-adds it. Carry the
 * current theme onto the incoming document before the swap.
 *
 * Lives apart from `theme-toggle.ts` on purpose: both are imported by different entry scripts,
 * and a module shared between them becomes an extra chunk that lengthens the critical request chain.
 */
export function carryThemeToDocument(incoming: Document, current: Document): void {
    incoming.documentElement.classList.toggle(
        "dark",
        current.documentElement.classList.contains("dark"),
    );
}
