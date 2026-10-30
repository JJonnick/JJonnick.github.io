const ITEM_SELECTOR = "a[href], button";
const KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"]);

export interface ItemRect {
    left: number;
    top: number;
    width: number;
}

/** Index to focus after `key` from `current`, or `current` when there is nowhere to go. */
export function nextIndex(
    rects: ItemRect[],
    current: number,
    key: string,
    isGrid: boolean,
): number {
    const last = rects.length - 1;
    if (key === "Home") return 0;
    if (key === "End") return last;

    const isBackward = key === "ArrowLeft" || key === "ArrowUp";
    const isVertical = key === "ArrowUp" || key === "ArrowDown";

    if (!isGrid || !isVertical) {
        return Math.min(last, Math.max(0, current + (isBackward ? -1 : 1)));
    }

    const from = rects[current];
    if (!from) return current;
    const rows = rects.filter((rect) => (isBackward ? rect.top < from.top : rect.top > from.top));
    if (rows.length === 0) return current;

    const targetTop = isBackward
        ? Math.max(...rows.map((rect) => rect.top))
        : Math.min(...rows.map((rect) => rect.top));
    const fromCenter = from.left + from.width / 2;
    let best = current;
    let bestDistance = Number.POSITIVE_INFINITY;
    rects.forEach((rect, index) => {
        if (rect.top !== targetTop) return;
        const distance = Math.abs(rect.left + rect.width / 2 - fromCenter);
        if (distance < bestDistance) {
            best = index;
            bestDistance = distance;
        }
    });
    return best;
}

function getItems(container: Element): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
        (item) => !item.closest("[hidden]") && item.getAttribute("aria-disabled") !== "true",
    );
}

/**
 * Arrow/Home/End navigation inside `[data-arrow-nav]` (linear) and
 * `[data-arrow-nav="grid"]` (also moves by rows) containers. Tab order is untouched.
 */
export function initArrowNavigation(document: Document): () => void {
    const onKeyDown = (event: KeyboardEvent) => {
        if (!KEYS.has(event.key) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }
        const target = event.target as Element | null;
        const container = target?.closest("[data-arrow-nav]");
        if (!container) return;

        const items = getItems(container);
        const current = items.findIndex((item) => item === target || item.contains(target));
        if (current === -1) return;

        const rects = items.map((item) => item.getBoundingClientRect());
        const isGrid = container.getAttribute("data-arrow-nav") === "grid";
        const next = nextIndex(rects, current, event.key, isGrid);

        event.preventDefault();
        if (next !== current) items[next]?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
}
