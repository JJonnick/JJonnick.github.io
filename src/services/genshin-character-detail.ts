import { type Character } from "@/types/character";
import { toSafeNumber } from "@/utils/numbers";

const weaponTypeMap: Record<number, string> = {
    1: "Espada",
    10: "Catalizador",
    11: "Mandoble",
    12: "Arco",
    13: "Lanza",
};

const validElements = [
    "anemo",
    "geo",
    "electro",
    "dendro",
    "hydro",
    "pyro",
    "cryo",
];

export interface GenshinCharacterDetailViewModel {
    safeName: string;
    safeElement: string;
    safeIcon: string;
    safeRarity: number;
    safeLevel: number;
    safeConstellation: number;
    safeFriendship: number;
    safeElementIcon: string;
    weaponName: string;
}

export const buildGenshinCharacterDetailViewModel = (
    char: Character,
): GenshinCharacterDetailViewModel => {
    const safeName = char.name?.trim() || "Personaje desconocido";
    const safeElement = char.element?.trim() || "Elemento desconocido";
    const safeIcon = char.icon || "/fallbacks/icon.svg";
    const safeRarity = Math.min(5, Math.max(1, toSafeNumber(char.rarity) || 1));
    const safeLevel = toSafeNumber(char.level);
    const safeConstellation = toSafeNumber(char.constellation);
    const safeFriendship = toSafeNumber(char.friendship);
    const elementKey = safeElement.toLowerCase();
    const safeElementIcon = validElements.includes(elementKey)
        ? `/elements/${elementKey}.svg`
        : "/fallbacks/icon.svg";
    const weaponName = weaponTypeMap[char.weapon_type] ?? "Desconocido";

    return {
        safeName,
        safeElement,
        safeIcon,
        safeRarity,
        safeLevel,
        safeConstellation,
        safeFriendship,
        safeElementIcon,
        weaponName,
    };
};
