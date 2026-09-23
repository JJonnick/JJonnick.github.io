import { elementBadgeBg, type ElementVisual, type Game } from "@/games/game";

export const GENSHIN_ELEMENTS = [
    "anemo",
    "geo",
    "electro",
    "dendro",
    "hydro",
    "pyro",
    "cryo",
] as const;

export type GenshinElement = (typeof GENSHIN_ELEMENTS)[number];

const ELEMENT_RGB: Record<GenshinElement, [number, number, number]> = {
    anemo: [116, 194, 168],
    geo: [203, 164, 78],
    electro: [155, 114, 207],
    dendro: [109, 170, 79],
    hydro: [72, 120, 200],
    pyro: [226, 114, 27],
    cryo: [152, 200, 232],
};

const ELEMENT_LABELS: Record<GenshinElement, string> = {
    anemo: "Anemo",
    geo: "Geo",
    electro: "Electro",
    dendro: "Dendro",
    hydro: "Hydro",
    pyro: "Pyro",
    cryo: "Cryo",
};

const ELEMENT_VISUALS = Object.fromEntries(
    GENSHIN_ELEMENTS.map((element) => [
        element,
        { iconPath: `/elements/${element}.svg`, badgeBg: elementBadgeBg(ELEMENT_RGB[element]) },
    ]),
) as Record<GenshinElement, ElementVisual>;

export const genshin: Game = {
    id: "genshin",
    label: "Genshin Impact",
    shortLabel: "Genshin",
    homePath: "/",
    charactersPath: "/characters",
    elements: GENSHIN_ELEMENTS,
    elementLabels: ELEMENT_LABELS,
    elementVisuals: ELEMENT_VISUALS,
    portrait: {
        width: 120,
        height: 120,
        aspectClass: "aspect-square",
        imageClass: "min-h-25 rounded-full",
    },
    copy: {
        tagline: "Consulta tu progreso y personajes en Genshin Impact.",
        listTitle: "Lista de personajes",
        listHeading: "Tus personajes",
        listDescription: "Selecciona uno para ver nivel, constelación, amistad y arma.",
        emptyMessage:
            "No encontramos personajes en tus datos todavía. Actualiza el archivo e inténtalo de nuevo.",
    },
};
