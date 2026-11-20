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
