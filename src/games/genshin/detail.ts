import type { Character } from "../../schemas/datasets.ts";
import { normalizeElement } from "../../services/character-list.ts";
import { type Game, getElementIconSrc } from "../game.ts";
import { GENSHIN_WEAPON_TYPE_LABELS } from "./weapons.ts";

const FALLBACK_ICON = "/fallbacks/icon.svg";

export type GenshinStatKey = "level" | "constellation" | "friendship" | "weapon";

export interface GenshinCharacterDetail {
    id: number;
    name: string;
    icon: string;
    /** Element as written in the data, for the icon's alt text. */
    element: string;
    elementIcon: string;
    rarity: number;
    stats: { key: GenshinStatKey; label: string; value: string }[];
}

/** Ready-to-render values for a Genshin Character detail page. */
export function toCharacterDetail(char: Character, game: Game): GenshinCharacterDetail {
    const element = char.element.trim() || "Elemento desconocido";

    return {
        id: char.id,
        name: char.name.trim() || "Personaje desconocido",
        icon: char.icon || FALLBACK_ICON,
        element,
        elementIcon: getElementIconSrc(game, normalizeElement(element)) ?? FALLBACK_ICON,
        rarity: Math.min(5, Math.max(1, char.rarity)),
        stats: [
            { key: "level", label: "Nivel", value: String(char.level) },
            { key: "constellation", label: "Constelación", value: `C${char.constellation}` },
            { key: "friendship", label: "Amistad", value: String(char.friendship) },
            {
                key: "weapon",
                label: "Arma",
                value: GENSHIN_WEAPON_TYPE_LABELS[char.weapon_type] ?? "Desconocido",
            },
        ],
    };
}
