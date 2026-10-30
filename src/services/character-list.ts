import { createLoader, parseAsString, parseAsStringLiteral } from "nuqs";

export const CHARACTER_PAGE_SIZE = 24;

const ALL = "all";

export interface ListableCharacter {
    name?: string | null | undefined;
    element?: string | null | undefined;
    rarity?: number | string | null | undefined;
}

export interface CharacterListOptions {
    /** Path of page 1, e.g. `/characters`; page N lives at `${basePath}/N`. */
    basePath: string;
    pageSize: number;
    /** Preferred order for element filter options; unknown elements are appended. */
    elementOrder?: readonly string[];
}

export interface CharacterListFilters {
    /** Active element, or `"all"`. Always one of `elementOptions` or `"all"`. */
    element: string;
    /** Active rarity, or `"all"`. Always one of `rarityOptions` or `"all"`. */
    rarity: string;
    /** Name search as typed in the URL (`?q=`), trimmed; empty when inactive. */
    query: string;
    elementOptions: string[];
    rarityOptions: string[];
}

export interface PageLink {
    page: number;
    href: string;
    isCurrent: boolean;
    isVisible: boolean;
}

export interface CharacterListPagination {
    /** True when there is nothing to paginate (no results or a single page). */
    isHidden: boolean;
    currentPage: number;
    totalPages: number;
    links: PageLink[];
    prev: { href: string; isDisabled: boolean };
    next: { href: string; isDisabled: boolean };
    showStartEllipsis: boolean;
    showEndEllipsis: boolean;
}

export interface CharacterListView<T> {
    /** Characters visible on the current page, after filtering. */
    items: T[];
    filters: CharacterListFilters;
    pagination: CharacterListPagination;
    /** Set when the requested page was out of range; the URL that should replace it. */
    canonicalUrl?: string;
    isEmpty: boolean;
}

export function normalizeElement(element: string | null | undefined): string {
    return element?.trim().toLowerCase() ?? "";
}

function normalizeRarity(rarity: number | string | null | undefined): string {
    const value = String(rarity ?? "").trim();
    return value === "0" ? "" : value;
}

function collectElementOptions(
    items: ListableCharacter[],
    elementOrder: readonly string[] = [],
): string[] {
    const present = new Set(items.map((item) => normalizeElement(item.element)).filter(Boolean));
    const ordered = elementOrder.filter((element) => present.has(element));
    const unknown = [...present].filter((element) => !elementOrder.includes(element));
    return [...ordered, ...unknown];
}

function collectRarityOptions(items: ListableCharacter[]): string[] {
    const present = new Set(items.map((item) => normalizeRarity(item.rarity)).filter(Boolean));
    return [...present].sort((a, b) => Number(b) - Number(a));
}

/** Lowercase and strip diacritics so "ayaka" matches "Ayaka" and "jose" matches "José". */
function normalizeSearch(text: string | null | undefined): string {
    return (text ?? "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim();
}

function readFilters(
    search: string,
    elementOptions: string[],
    rarityOptions: string[],
): Pick<CharacterListFilters, "element" | "rarity" | "query"> {
    const { q, ...rest } = createLoader({
        element: parseAsStringLiteral([ALL, ...elementOptions]).withDefault(ALL),
        rarity: parseAsStringLiteral([ALL, ...rarityOptions]).withDefault(ALL),
        q: parseAsString.withDefault(""),
    })(search);
    return { ...rest, query: q.trim() };
}

function readRequestedPage(pathname: string, basePath: string): number {
    const escapedBasePath = basePath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = pathname.match(new RegExp(`^${escapedBasePath}/(\\d+)/?$`));
    return Number(match?.[1] ?? "1");
}

function pagePath(basePath: string, page: number): string {
    return page === 1 ? basePath : `${basePath}/${page}`;
}

function getVisiblePageNumbers(currentPage: number, lastPage: number): number[] {
    if (lastPage <= 7) {
        return Array.from({ length: lastPage }, (_, index) => index + 1);
    }

    if (currentPage <= 4) return [1, 2, 3, 4, 5, lastPage];
    if (currentPage >= lastPage - 3) {
        return [1, lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
    }

    return [1, currentPage - 1, currentPage, currentPage + 1, lastPage];
}

/**
 * Everything the Character list shows for a list of characters and a URL.
 * Rendered by the server for the first paint and recomputed by the client on
 * every filter change, so both sides always agree.
 */
export function getCharacterListView<T extends ListableCharacter>(
    items: T[],
    url: URL,
    { basePath, pageSize, elementOrder }: CharacterListOptions,
): CharacterListView<T> {
    const elementOptions = collectElementOptions(items, elementOrder);
    const rarityOptions = collectRarityOptions(items);
    const { element, rarity, query } = readFilters(url.search, elementOptions, rarityOptions);
    const needle = normalizeSearch(query);

    const filteredItems = items.filter(
        (item) =>
            (element === ALL || normalizeElement(item.element) === element) &&
            (rarity === ALL || normalizeRarity(item.rarity) === rarity) &&
            (needle === "" || normalizeSearch(item.name).includes(needle)),
    );

    const safePageSize = Math.max(1, pageSize);
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / safePageSize));
    const requestedPage = readRequestedPage(url.pathname, basePath);
    const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
    const pageStart = (currentPage - 1) * safePageSize;
    const isEmpty = filteredItems.length === 0;

    const href = (page: number) => `${pagePath(basePath, page)}${url.search}`;
    const visiblePages = getVisiblePageNumbers(currentPage, totalPages);
    const visiblePageSet = new Set(visiblePages);

    return {
        items: filteredItems.slice(pageStart, pageStart + safePageSize),
        filters: { element, rarity, query, elementOptions, rarityOptions },
        pagination: {
            isHidden: isEmpty || totalPages <= 1,
            currentPage,
            totalPages,
            links: Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                return {
                    page,
                    href: href(page),
                    isCurrent: page === currentPage,
                    isVisible: visiblePageSet.has(page),
                };
            }),
            prev: { href: href(Math.max(1, currentPage - 1)), isDisabled: currentPage <= 1 },
            next: {
                href: href(Math.min(totalPages, currentPage + 1)),
                isDisabled: currentPage >= totalPages,
            },
            showStartEllipsis: (visiblePages[1] ?? 0) > 2,
            showEndEllipsis: (visiblePages.at(-2) ?? totalPages) < totalPages - 1,
        },
        ...(currentPage !== requestedPage && !isEmpty && { canonicalUrl: href(currentPage) }),
        isEmpty,
    };
}

/**
 * URL for the Character list with new filters applied. Always points at page 1
 * so the URL stays consistent with the static page routes.
 */
export function getFilteredListUrl(
    url: URL,
    basePath: string,
    filters: Pick<CharacterListFilters, "element" | "rarity"> & { query?: string },
): string {
    const params = new URLSearchParams(url.search);
    for (const key of ["element", "rarity"] as const) {
        if (filters[key] === ALL) params.delete(key);
        else params.set(key, filters[key]);
    }
    if (filters.query !== undefined) {
        if (filters.query.trim() === "") params.delete("q");
        else params.set("q", filters.query);
    }
    const search = params.toString();
    return `${basePath}${search ? `?${search}` : ""}`;
}

export interface CharacterNeighbor {
    id: number | string;
    name: string;
}

export interface CharacterNeighbors {
    prev?: CharacterNeighbor;
    next?: CharacterNeighbor;
}

/**
 * The Characters before and after one in the Character list order, without
 * wrapping around. Filters are not applied: a detail URL carries none.
 */
export function getCharacterNeighbors(
    items: readonly CharacterNeighbor[],
    id: number | string,
): CharacterNeighbors {
    const index = items.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return {};

    const pick = (item: CharacterNeighbor | undefined) =>
        item && { id: item.id, name: item.name };
    return {
        ...(index > 0 && { prev: pick(items[index - 1]) }),
        ...(index < items.length - 1 && { next: pick(items[index + 1]) }),
    };
}
