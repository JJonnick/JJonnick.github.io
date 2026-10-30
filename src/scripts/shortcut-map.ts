/**
 * Single source of truth for keyboard shortcuts: the handler, the help dialog,
 * the `Kbd` hints and `aria-keyshortcuts` all read from here.
 *
 * Every shortcut needs a modifier or a non-printable key (WCAG 2.1.4). Letters
 * match on `event.code` so Option+letter on macOS and non-US layouts still work.
 */
export type ShortcutId = "search" | "help" | "theme" | "gameMenu" | "prevPage" | "nextPage";

export interface KeyCombo {
    /** `KeyboardEvent.code`, e.g. `KeyK` or `ArrowLeft`. */
    code: string;
    /** Ctrl on Windows/Linux, Cmd on macOS. */
    mod?: boolean;
    alt?: boolean;
    shift?: boolean;
}

export interface Shortcut {
    id: ShortcutId;
    combo: KeyCombo;
    label: string;
    /** Whether it also fires while typing in a text field. */
    whileTyping: boolean;
}

export const SHORTCUTS: readonly Shortcut[] = [
    { id: "search", combo: { code: "KeyK", mod: true }, label: "Buscar personaje", whileTyping: true },
    { id: "help", combo: { code: "KeyH", alt: true }, label: "Ver atajos de teclado", whileTyping: true },
    { id: "theme", combo: { code: "KeyT", alt: true }, label: "Cambiar tema", whileTyping: true },
    { id: "gameMenu", combo: { code: "KeyG", alt: true }, label: "Cambiar de juego", whileTyping: true },
    { id: "prevPage", combo: { code: "ArrowLeft", shift: true }, label: "Página anterior", whileTyping: false },
    { id: "nextPage", combo: { code: "ArrowRight", shift: true }, label: "Página siguiente", whileTyping: false },
];

type ModifierState = Pick<KeyboardEvent, "code" | "ctrlKey" | "metaKey" | "altKey" | "shiftKey">;

export function matchesCombo(event: ModifierState, combo: KeyCombo): boolean {
    if (event.code !== combo.code) return false;
    if (event.shiftKey !== Boolean(combo.shift)) return false;
    if (combo.mod) return (event.ctrlKey || event.metaKey) && !event.altKey;
    // AltGr reports ctrl+alt, so Alt shortcuts must reject any ctrl/meta.
    return !event.ctrlKey && !event.metaKey && event.altKey === Boolean(combo.alt);
}

export function findShortcut(event: ModifierState): Shortcut | undefined {
    return SHORTCUTS.find((shortcut) => matchesCombo(event, shortcut.combo));
}

const KEY_LABELS: Record<string, string> = {
    ArrowLeft: "←",
    ArrowRight: "→",
    ArrowUp: "↑",
    ArrowDown: "↓",
    Escape: "Esc",
};

/** Key labels in display order; `Mod` is swapped for ⌘ on macOS at runtime. */
export function comboKeys({ code, mod, alt, shift }: KeyCombo): string[] {
    const key = KEY_LABELS[code] ?? code.replace(/^Key/, "");
    return [...(mod ? ["Mod"] : []), ...(alt ? ["Alt"] : []), ...(shift ? ["Shift"] : []), key];
}

/** Value for the `aria-keyshortcuts` attribute of the control a shortcut targets. */
export function ariaKeyShortcuts(id: ShortcutId): string {
    const shortcut = SHORTCUTS.find((item) => item.id === id);
    if (!shortcut) return "";
    const { code, mod, alt, shift } = shortcut.combo;
    const key = code.replace(/^Key/, "");
    const prefix = [...(alt ? ["Alt"] : []), ...(shift ? ["Shift"] : [])];
    if (!mod) return [...prefix, key].join("+");
    return [["Control", ...prefix, key].join("+"), ["Meta", ...prefix, key].join("+")].join(" ");
}

const MAC_KEYS: Record<string, string> = { Mod: "⌘", Alt: "⌥", Shift: "⇧" };

/** Swaps the display of modifier keys for the platform's own symbols. */
export function applyPlatformKeys(document: Document, isMac: boolean): void {
    if (!isMac) return;
    document.querySelectorAll<HTMLElement>("kbd[data-key]").forEach((kbd) => {
        const symbol = MAC_KEYS[kbd.dataset.key ?? ""];
        if (symbol) kbd.textContent = symbol;
    });
}
