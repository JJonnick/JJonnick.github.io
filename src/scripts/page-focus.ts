/** Moves focus to the page heading (or `main`) after a client-side navigation. */
export function focusPageStart(document: Document): void {
    const main = document.getElementById("main-content");
    const target = main?.querySelector<HTMLElement>("h1") ?? main;
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
}
