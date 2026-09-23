import type { ImageMetadata } from "astro";

export type GameId = "genshin" | "hsr";

export type ElementVisual = {
    iconPath: string | ImageMetadata;
    badgeBg: string;
};

/** Everything that differs between supported games in shared pages and components. */
export interface Game {
    id: GameId;
    label: string;
    shortLabel: string;
    homePath: string;
    /** Character list page 1; character N lives at `${charactersPath}/${id}`. */
    charactersPath: string;
    /** Canonical element order, used for filter buttons. */
    elements: readonly string[];
    elementLabels: Record<string, string>;
    elementVisuals: Record<string, ElementVisual>;
    portrait: {
        width: number;
        height: number;
        aspectClass: string;
        imageClass: string;
    };
    copy: {
        tagline: string;
        listTitle: string;
        listHeading: string;
        listDescription: string;
        emptyMessage: string;
    };
}

/** Very translucent tint of an element colour, for icon badge backgrounds. */
export function elementBadgeBg([r, g, b]: readonly [number, number, number]): string {
    return `rgba(${r},${g},${b},0.2)`;
}

export function getElementIconSrc(game: Game, element: string): string | undefined {
    const iconPath = game.elementVisuals[element]?.iconPath;
    if (!iconPath) return undefined;
    return typeof iconPath === "string" ? iconPath : iconPath.src;
}

function isUnder(pathname: string, path: string): boolean {
    return path === "/" || pathname === path || pathname.startsWith(`${path}/`);
}

/** The Game a URL path belongs to: the one with the most specific matching home path. */
export function findGameForPath<G extends Pick<Game, "homePath">>(
    games: readonly G[],
    pathname: string,
): G | undefined {
    return games
        .filter((game) => isUnder(pathname, game.homePath))
        .sort((a, b) => b.homePath.length - a.homePath.length)[0];
}

export function isInCharacterSection(
    game: Pick<Game, "charactersPath">,
    pathname: string,
): boolean {
    return isUnder(pathname, game.charactersPath);
}
