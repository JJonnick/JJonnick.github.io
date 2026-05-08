import { type HsrCharacter } from "@/types";
import { toSafeNumber } from "@/utils/numbers";

type SupportedLocale = "es" | "en";

const localizedLabels = {
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

const pathMap: Record<SupportedLocale, Record<number, string>> = {
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

const elementMap: Record<SupportedLocale, Record<string, string>> = {
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

export interface HsrCharacterDetailViewModel {
    preferredLocale: SupportedLocale;
    labels: (typeof localizedLabels)[SupportedLocale];
    formatter: Intl.NumberFormat;
    safeName: string;
    safeIcon: string;
    safeRarity: number;
    safePath: string;
    safeElement: string;
    hasLightCone: boolean;
    lightConeName: string;
    lightConeIcon: string;
    lightConeRarity: number;
    memospriteName: string;
    memospriteIcon: string;
    levelText: string;
    rankText: string;
    lightConeLevelText: string;
    lightConeRankText: string;
}

export const buildHsrCharacterDetailViewModel = (
    char: HsrCharacter,
    preferredLocaleRaw: unknown,
): HsrCharacterDetailViewModel => {
    const preferredLocale =
        typeof preferredLocaleRaw === "string" &&
        preferredLocaleRaw.toLowerCase().startsWith("en")
            ? "en"
            : "es";

    const labels = localizedLabels[preferredLocale];
    const formatter = new Intl.NumberFormat(
        preferredLocale === "en" ? "en-US" : "es-ES",
    );
    const safeName = char.name?.trim() || labels.unknownCharacter;
    const safeIcon = char.icon || "/fallbacks/icon.svg";
    const safeRarity = Math.min(5, Math.max(1, toSafeNumber(char.rarity) || 1));
    const safeLevel = toSafeNumber(char.level);
    const safeRank = toSafeNumber(char.rank);
    const rawPath = char.path;
    const safePath =
        typeof rawPath === "number"
            ? (pathMap[preferredLocale][rawPath] ??
              `${labels.pathPrefix} ${rawPath}`)
            : rawPath?.trim() || labels.unknownPath;
    const rawElement = char.element?.trim().toLowerCase() || "";
    const safeElement =
        elementMap[preferredLocale][rawElement] ??
        (rawElement
            ? rawElement[0].toUpperCase() + rawElement.slice(1)
            : labels.unknownElement);
    const hasLightCone = Boolean(
        char.equip?.name ||
            char.equip?.icon ||
            char.equip?.level ||
            char.equip?.rank ||
            char.equip?.rarity,
    );
    const lightConeName = char.equip?.name?.trim() || labels.noLightCone;
    const lightConeIcon = char.equip?.icon || "/fallbacks/icon.svg";
    const lightConeLevel = toSafeNumber(char.equip?.level);
    const lightConeRank = toSafeNumber(char.equip?.rank);
    const lightConeRarity = Math.min(
        5,
        Math.max(0, toSafeNumber(char.equip?.rarity) || 0),
    );
    const memospriteName =
        char.memosprite?.name?.trim() || labels.memospriteFallback;
    const memospriteIcon = char.memosprite?.icon || "/fallbacks/icon.svg";
    const levelText = formatter.format(safeLevel);
    const rankText = formatter.format(safeRank);
    const lightConeLevelText =
        lightConeLevel > 0
            ? formatter.format(lightConeLevel)
            : labels.notAvailableShort;
    const lightConeRankText =
        lightConeRank > 0
            ? `S${formatter.format(lightConeRank)}`
            : labels.notAvailableShort;

    return {
        preferredLocale,
        labels,
        formatter,
        safeName,
        safeIcon,
        safeRarity,
        safePath,
        safeElement,
        hasLightCone,
        lightConeName,
        lightConeIcon,
        lightConeRarity,
        memospriteName,
        memospriteIcon,
        levelText,
        rankText,
        lightConeLevelText,
        lightConeRankText,
    };
};
