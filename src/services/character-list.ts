export function collectPresentElements<T extends { element?: string | null }, E extends string>(
    items: T[],
    elements: readonly E[],
): E[] {
    return elements.filter((element) =>
        items.some((item) => item.element?.trim().toLowerCase() === element),
    );
}

export function collectRarities<T extends { rarity?: number | null }>(items: T[]): number[] {
    return [...new Set(items.map((item) => item.rarity ?? 0).filter(Boolean))].sort(
        (a, b) => b - a,
    );
}

interface CharacterFilterState {
    element: string;
    rarity: string;
}

interface FilterableCharacter {
    element?: string | null;
    rarity?: number | string | null;
}

interface CharacterPage<T> {
    items: T[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
}

export function getFilteredCharacterPage<T extends FilterableCharacter>(
    items: T[],
    filters: CharacterFilterState,
    requestedPage: number,
    pageSize: number,
): CharacterPage<T> {
    const filteredItems = items.filter((item) => {
        const element = item.element?.trim().toLowerCase() ?? "";
        const rarity = String(item.rarity ?? "");

        return (
            (filters.element === "all" || element === filters.element) &&
            (filters.rarity === "all" || rarity === filters.rarity)
        );
    });

    const safePageSize = Math.max(1, pageSize);
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / safePageSize));
    const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
    const pageStart = (currentPage - 1) * safePageSize;

    return {
        items: filteredItems.slice(pageStart, pageStart + safePageSize),
        currentPage,
        totalItems: filteredItems.length,
        totalPages,
    };
}
