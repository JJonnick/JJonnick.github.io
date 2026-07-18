import { type HsrElement } from "@/utils/elements";

export type HsrLocale = "es" | "en";

export function getHsrLocale(): HsrLocale {
    const raw = import.meta.env.PUBLIC_HSR_TERMS_LOCALE;
    return typeof raw === "string" && raw.toLowerCase().startsWith("en")
        ? "en"
        : "es";
}

type HsrLabels = {
    unknownPath: string;
    unknownElement: string;
    unknownCharacter: string;
    noLightCone: string;
    memospriteFallback: string;
    pathPrefix: string;
    level: string;
    eidolon: string;
    path: string;
    lightCone: string;
    equippedLightCone: string;
    memosprite: string;
    notAvailableShort: string;
    avatarSuffix: string;
    iconSuffix: string;
    lightConeRarity: (n: number) => string;
};

export const HSR_LABELS: Record<HsrLocale, HsrLabels> = {
    es: {
        unknownPath: "Desconocida",
        unknownElement: "Desconocido",
        unknownCharacter: "Personaje desconocido",
        noLightCone: "Sin cono de luz",
        memospriteFallback: "Memosprite",
        pathPrefix: "Vía",
        level: "Nivel",
        eidolon: "Eidolón",
        path: "Vía",
        lightCone: "Cono de luz",
        equippedLightCone: "Cono equipado",
        memosprite: "Memosprite",
        notAvailableShort: "-",
        avatarSuffix: "avatar",
        iconSuffix: "icono",
        lightConeRarity: (n: number) =>
            `Rareza del cono: ${n} ${n === 1 ? "estrella" : "estrellas"}`,
    },
    en: {
        unknownPath: "Unknown",
        unknownElement: "Unknown",
        unknownCharacter: "Unknown character",
        noLightCone: "No Light Cone",
        memospriteFallback: "Memosprite",
        pathPrefix: "Path",
        level: "Level",
        eidolon: "Eidolon",
        path: "Path",
        lightCone: "Light Cone",
        equippedLightCone: "Equipped Light Cone",
        memosprite: "Memosprite",
        notAvailableShort: "-",
        avatarSuffix: "avatar",
        iconSuffix: "icon",
        lightConeRarity: (n: number) =>
            `Light Cone rarity: ${n} ${n === 1 ? "star" : "stars"}`,
    },
};

export const HSR_PATH_LABELS: Record<HsrLocale, Record<number, string>> = {
    es: {
        1: "Destrucción",
        2: "Cacería",
        3: "Erudición",
        4: "Armonía",
        5: "Nihilidad",
        6: "Preservación",
        7: "Abundancia",
        8: "Reminiscencia",
    },
    en: {
        1: "Destruction",
        2: "The Hunt",
        3: "Erudition",
        4: "Harmony",
        5: "Nihility",
        6: "Preservation",
        7: "Abundance",
        8: "Remembrance",
    },
};

export const HSR_ELEMENT_LABELS: Record<HsrLocale, Record<HsrElement, string>> =
    {
        es: {
            fire: "Fuego",
            ice: "Hielo",
            imaginary: "Imaginario",
            lightning: "Rayo",
            physical: "Físico",
            quantum: "Cuántico",
            wind: "Viento",
        },
        en: {
            fire: "Fire",
            ice: "Ice",
            imaginary: "Imaginary",
            lightning: "Lightning",
            physical: "Physical",
            quantum: "Quantum",
            wind: "Wind",
        },
    };
