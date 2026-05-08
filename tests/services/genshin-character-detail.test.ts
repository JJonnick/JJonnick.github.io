import { describe, expect, it } from "vitest";
import { buildGenshinCharacterDetailViewModel } from "@/services/genshin-character-detail";
import { type Character } from "@/types/character";

const baseCharacter: Character = {
    id: 1000,
    collab: false,
    constellation: 2,
    element: "pyro",
    friendship: 8,
    icon: "/icons/char.png",
    level: 90,
    name: "Hu Tao",
    rarity: 5,
    weapon_type: 1,
};

describe("buildGenshinCharacterDetailViewModel", () => {
    it("maps a valid character into display-ready values", () => {
        const model = buildGenshinCharacterDetailViewModel(baseCharacter);

        expect(model.safeName).toBe("Hu Tao");
        expect(model.safeElement).toBe("pyro");
        expect(model.safeIcon).toBe("/icons/char.png");
        expect(model.safeRarity).toBe(5);
        expect(model.safeLevel).toBe(90);
        expect(model.safeConstellation).toBe(2);
        expect(model.safeFriendship).toBe(8);
        expect(model.safeElementIcon).toBe("/elements/pyro.svg");
        expect(model.weaponName).toBe("Espada");
    });

    it("applies defensive fallbacks and clamps out-of-range values", () => {
        const model = buildGenshinCharacterDetailViewModel({
            ...baseCharacter,
            name: "   ",
            element: "unknown",
            icon: "",
            rarity: 999,
            level: Number.NaN,
            constellation: Number.POSITIVE_INFINITY,
            friendship: Number.NaN,
            weapon_type: 999,
        });

        expect(model.safeName).toBe("Personaje desconocido");
        expect(model.safeElement).toBe("unknown");
        expect(model.safeIcon).toBe("/fallbacks/icon.svg");
        expect(model.safeRarity).toBe(5);
        expect(model.safeLevel).toBe(0);
        expect(model.safeConstellation).toBe(0);
        expect(model.safeFriendship).toBe(0);
        expect(model.safeElementIcon).toBe("/fallbacks/icon.svg");
        expect(model.weaponName).toBe("Desconocido");
    });

    it("enforces minimum rarity when source value is invalid", () => {
        const model = buildGenshinCharacterDetailViewModel({
            ...baseCharacter,
            rarity: 0,
        });

        expect(model.safeRarity).toBe(1);
    });
});
