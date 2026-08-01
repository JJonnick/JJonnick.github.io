export function collectPresentElements<
    T extends { element?: string | null },
    E extends string,
>(items: T[], elements: readonly E[]): E[] {
    return elements.filter((element) =>
        items.some((item) => item.element?.trim().toLowerCase() === element),
    );
}

export function collectRarities<T extends { rarity?: number | null }>(items: T[]): number[] {
    return [...new Set(items.map((item) => item.rarity ?? 0).filter(Boolean))].sort((a, b) => b - a);
}
