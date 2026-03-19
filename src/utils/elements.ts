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

/** Base RGB values [r, g, b] for each Genshin element. */
const ELEMENT_RGB: Record<GenshinElement, [number, number, number]> = {
    anemo: [116, 194, 168],
    geo: [203, 164, 78],
    electro: [155, 114, 207],
    dendro: [109, 170, 79],
    hydro: [72, 120, 200],
    pyro: [226, 114, 27],
    cryo: [152, 200, 232],
};

function rgba(element: GenshinElement, alpha: number): string {
    const [r, g, b] = ELEMENT_RGB[element];
    return `rgba(${r},${g},${b},${alpha})`;
}

/** Very translucent tint for element icon badge background. */
export function elementBadgeBg(element: GenshinElement): string {
    return rgba(element, 0.2);
}
