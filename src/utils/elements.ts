import type { ImageMetadata } from "astro";
import hsrFire from "@assets/elements/hsr/fire.png";
import hsrIce from "@assets/elements/hsr/ice.png";
import hsrWind from "@assets/elements/hsr/wind.png";
import hsrLightning from "@assets/elements/hsr/lightning.png";
import hsrPhysical from "@assets/elements/hsr/physical.png";
import hsrQuantum from "@assets/elements/hsr/quantum.png";
import hsrImaginary from "@assets/elements/hsr/imaginary.png";

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
    iconPath: string | ImageMetadata;
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
        iconPath: hsrFire,
        badgeBg: hsrBadgeBg("fire"),
    },
    ice: {
        iconPath: hsrIce,
        badgeBg: hsrBadgeBg("ice"),
    },
    wind: {
        iconPath: hsrWind,
        badgeBg: hsrBadgeBg("wind"),
    },
    lightning: {
        iconPath: hsrLightning,
        badgeBg: hsrBadgeBg("lightning"),
    },
    physical: {
        iconPath: hsrPhysical,
        badgeBg: hsrBadgeBg("physical"),
    },
    quantum: {
        iconPath: hsrQuantum,
        badgeBg: hsrBadgeBg("quantum"),
    },
    imaginary: {
        iconPath: hsrImaginary,
        badgeBg: hsrBadgeBg("imaginary"),
    },
};
