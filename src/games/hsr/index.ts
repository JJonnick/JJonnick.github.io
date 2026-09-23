import hsrFire from "@assets/elements/hsr/fire.png";
import hsrIce from "@assets/elements/hsr/ice.png";
import hsrImaginary from "@assets/elements/hsr/imaginary.png";
import hsrLightning from "@assets/elements/hsr/lightning.png";
import hsrPhysical from "@assets/elements/hsr/physical.png";
import hsrQuantum from "@assets/elements/hsr/quantum.png";
import hsrWind from "@assets/elements/hsr/wind.png";
import { type ElementVisual, elementBadgeBg, type Game } from "@/games/game";
import { getHsrLocale, HSR_ELEMENT_LABELS } from "@/games/hsr/i18n";

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

const ELEMENT_VISUALS: Record<HsrElement, ElementVisual> = {
    fire: { iconPath: hsrFire, badgeBg: elementBadgeBg([228, 115, 57]) },
    ice: { iconPath: hsrIce, badgeBg: elementBadgeBg([122, 195, 236]) },
    wind: { iconPath: hsrWind, badgeBg: elementBadgeBg([104, 201, 159]) },
    lightning: { iconPath: hsrLightning, badgeBg: elementBadgeBg([201, 121, 255]) },
    physical: { iconPath: hsrPhysical, badgeBg: elementBadgeBg([176, 146, 110]) },
    quantum: { iconPath: hsrQuantum, badgeBg: elementBadgeBg([103, 95, 208]) },
    imaginary: { iconPath: hsrImaginary, badgeBg: elementBadgeBg([243, 197, 102]) },
};

export const hsr: Game = {
    id: "hsr",
    label: "Honkai: Star Rail",
    shortLabel: "Honkai",
    homePath: "/hsr",
    charactersPath: "/hsr/characters",
    elements: HSR_ELEMENTS,
    elementLabels: HSR_ELEMENT_LABELS[getHsrLocale()],
    elementVisuals: ELEMENT_VISUALS,
    portrait: {
        width: 120,
        height: 141,
        aspectClass: "aspect-[40/47]",
        imageClass: "min-h-[141px] rounded-2xl",
    },
    copy: {
        tagline: "Consulta tu progreso y personajes en Honkai: Star Rail.",
        listTitle: "Lista de personajes de Honkai: Star Rail",
        listHeading: "Tus personajes de Honkai: Star Rail",
        listDescription: "Selecciona uno para ver nivel, eidolón, vía y cono de luz.",
        emptyMessage:
            "No encontramos personajes en tus datos de Honkai: Star Rail todavía. Actualiza el archivo e inténtalo de nuevo.",
    },
};
