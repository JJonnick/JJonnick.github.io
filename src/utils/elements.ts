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
export type ElementVisual = {
    iconPath: string;
    badgeBg: string;
};

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

export const GENSHIN_ELEMENT_VISUALS: Record<GenshinElement, ElementVisual> = {
    anemo: {
        iconPath: "/elements/anemo.svg",
        badgeBg: elementBadgeBg("anemo"),
    },
    geo: {
        iconPath: "/elements/geo.svg",
        badgeBg: elementBadgeBg("geo"),
    },
    electro: {
        iconPath: "/elements/electro.svg",
        badgeBg: elementBadgeBg("electro"),
    },
    dendro: {
        iconPath: "/elements/dendro.svg",
        badgeBg: elementBadgeBg("dendro"),
    },
    hydro: {
        iconPath: "/elements/hydro.svg",
        badgeBg: elementBadgeBg("hydro"),
    },
    pyro: {
        iconPath: "/elements/pyro.svg",
        badgeBg: elementBadgeBg("pyro"),
    },
    cryo: {
        iconPath: "/elements/cryo.svg",
        badgeBg: elementBadgeBg("cryo"),
    },
};

export const HSR_ELEMENTS = [
    "fire",
    "ice",
    "wind",
    "lightning",
    "physical",
    "quantum",
    "imaginary",
] as const;

export type HsrElement = (typeof HSR_ELEMENTS)[number];

const HSR_ELEMENT_RGB: Record<HsrElement, [number, number, number]> = {
    fire: [228, 115, 57],
    ice: [122, 195, 236],
    wind: [104, 201, 159],
    lightning: [201, 121, 255],
    physical: [176, 146, 110],
    quantum: [103, 95, 208],
    imaginary: [243, 197, 102],
};

function hsrBadgeBg(element: HsrElement): string {
    const [r, g, b] = HSR_ELEMENT_RGB[element];
    return `rgba(${r},${g},${b},0.2)`;
}

export const HSR_ELEMENT_VISUALS: Record<HsrElement, ElementVisual> = {
    fire: {
        iconPath: "/elements/pyro.svg",
        badgeBg: hsrBadgeBg("fire"),
    },
    ice: {
        iconPath: "/elements/cryo.svg",
        badgeBg: hsrBadgeBg("ice"),
    },
    wind: {
        iconPath: "/elements/anemo.svg",
        badgeBg: hsrBadgeBg("wind"),
    },
    lightning: {
        iconPath: "/elements/electro.svg",
        badgeBg: hsrBadgeBg("lightning"),
    },
    physical: {
        iconPath: "/elements/geo.svg",
        badgeBg: hsrBadgeBg("physical"),
    },
    quantum: {
        iconPath: "/elements/dendro.svg",
        badgeBg: hsrBadgeBg("quantum"),
    },
    imaginary: {
        iconPath: "/elements/hydro.svg",
        badgeBg: hsrBadgeBg("imaginary"),
    },
};
