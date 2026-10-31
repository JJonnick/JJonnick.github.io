interface ThemeStorage {
    setItem(key: string, value: string): void;
}

export function initThemeToggle(document: Document, storage: ThemeStorage): () => void {
    const input = document.querySelector<HTMLInputElement>("[data-theme-toggle]");
    if (!input) return () => undefined;

    input.checked = document.documentElement.classList.contains("dark");

    const onChange = () => {
        const theme = input.checked ? "dark" : "light";
        document.documentElement.classList.toggle("dark", input.checked);
        try {
            storage.setItem("theme", theme);
        } catch {
            // Storage can be unavailable; the current document still updates.
        }
    };

    input.addEventListener("change", onChange);
    return () => input.removeEventListener("change", onChange);
}

/**
 * The ClientRouter replaces the <html> attributes with the incoming document's, which has no
 * `dark` class, so dark mode would flash light until the inline script re-adds it. Carry the
 * current theme onto the incoming document before the swap.
 */
export function carryThemeToDocument(incoming: Document, current: Document): void {
    incoming.documentElement.classList.toggle(
        "dark",
        current.documentElement.classList.contains("dark"),
    );
}
