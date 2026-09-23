import type { HsrCharacter } from "../../schemas/datasets.ts";
import { normalizeElement } from "../../services/character-list.ts";
import {
    HSR_ELEMENT_LABELS,
    HSR_LABELS,
    HSR_PATH_LABELS,
    type HsrLabels,
    type HsrLocale,
} from "./i18n.ts";

const FALLBACK_ICON = "/fallbacks/icon.svg";

export interface HsrCharacterDetail {
    id: number;
    name: string;
    icon: string;
    element: string;
    path: string;
    rarity: number;
    levelText: string;
    rankText: string;
    lightCone: {
        isEquipped: boolean;
        name: string;
        icon: string;
        rarity: number;
        levelText: string;
        rankText: string;
    };
    memosprite?: { name: string; icon: string };
    labels: HsrLabels;
}

function capitalize(value: string): string {
    return value ? value[0].toUpperCase() + value.slice(1) : value;
}

/** Ready-to-render values for an HSR Character detail page. */
export function toCharacterDetail(char: HsrCharacter, locale: HsrLocale): HsrCharacterDetail {
    const labels = HSR_LABELS[locale];
    const formatter = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-ES");
    const element = normalizeElement(char.element);
    const equip = char.equip;
    const lightConeLevel = equip?.level ?? 0;
    const lightConeRank = equip?.rank ?? 0;

    return {
        id: char.id,
        name: char.name.trim() || labels.unknownCharacter,
        icon: char.icon || FALLBACK_ICON,
        element:
            (HSR_ELEMENT_LABELS[locale] as Record<string, string>)[element] ??
            (capitalize(element) || labels.unknownElement),
        path:
            typeof char.path === "number"
                ? (HSR_PATH_LABELS[locale][char.path] ?? `${labels.pathPrefix} ${char.path}`)
                : char.path?.trim() || labels.unknownPath,
        rarity: Math.min(5, Math.max(1, char.rarity || 1)),
        levelText: formatter.format(char.level ?? 0),
        rankText: formatter.format(char.rank ?? 0),
        lightCone: {
            isEquipped: Boolean(
                equip?.name || equip?.icon || equip?.level || equip?.rank || equip?.rarity,
            ),
            name: equip?.name?.trim() || labels.noLightCone,
            icon: equip?.icon || FALLBACK_ICON,
            rarity: Math.min(5, equip?.rarity ?? 0),
            levelText:
                lightConeLevel > 0 ? formatter.format(lightConeLevel) : labels.notAvailableShort,
            rankText:
                lightConeRank > 0
                    ? `S${formatter.format(lightConeRank)}`
                    : labels.notAvailableShort,
        },
        ...(char.memosprite && {
            memosprite: {
                name: char.memosprite.name?.trim() || labels.memospriteFallback,
                icon: char.memosprite.icon || FALLBACK_ICON,
            },
        }),
        labels,
    };
}
