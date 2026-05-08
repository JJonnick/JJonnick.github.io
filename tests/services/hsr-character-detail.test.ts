import { describe, expect, it } from "vitest";
import { buildHsrCharacterDetailViewModel } from "@/services/hsr-character-detail";
import { type HsrCharacter } from "@/types";

const baseCharacter: HsrCharacter = {
    id: 1201,
    icon: "/hsr/icon.png",
    name: "March 7th",
    rarity: 4,
    element: "ice",
    level: 80,
    rank: 6,
    path: 7,
    equip: {
        icon: "/hsr/lc.png",
        level: 80,
        name: "Memories of the Past",
        rank: 5,
        rarity: 4,
    },
    memosprite: {
        icon: "/hsr/memo.png",
        name: "Memo",
    },
};

describe("buildHsrCharacterDetailViewModel", () => {
    it("maps locale-dependent labels and branch-heavy fields in English", () => {
        const model = buildHsrCharacterDetailViewModel(baseCharacter, "en-US");

        expect(model.preferredLocale).toBe("en");
        expect(model.safeName).toBe("March 7th");
        expect(model.safeIcon).toBe("/hsr/icon.png");
        expect(model.safeRarity).toBe(4);
        expect(model.safePath).toBe("Abundance");
        expect(model.safeElement).toBe("Ice");
        expect(model.hasLightCone).toBe(true);
        expect(model.lightConeName).toBe("Memories of the Past");
        expect(model.lightConeIcon).toBe("/hsr/lc.png");
        expect(model.lightConeRarity).toBe(4);
        expect(model.memospriteName).toBe("Memo");
        expect(model.memospriteIcon).toBe("/hsr/memo.png");
        expect(model.levelText).toBe("80");
        expect(model.rankText).toBe("6");
        expect(model.lightConeLevelText).toBe("80");
        expect(model.lightConeRankText).toBe("S5");
        expect(model.labels.lightCone).toBe("Light Cone");
    });

    it("falls back safely in Spanish when optional values are missing or invalid", () => {
        const model = buildHsrCharacterDetailViewModel(
            {
                ...baseCharacter,
                name: " ",
                icon: "",
                rarity: 999,
                element: "",
                level: Number.NaN,
                rank: Number.NaN,
                path: " ",
                equip: {
                    icon: "",
                    level: 0,
                    name: " ",
                    rank: 0,
                    rarity: 0,
                },
                memosprite: {
                    icon: "",
                    name: " ",
                },
            },
            "es",
        );

        expect(model.preferredLocale).toBe("es");
        expect(model.safeName).toBe("Personaje desconocido");
        expect(model.safeIcon).toBe("/fallbacks/icon.svg");
        expect(model.safeRarity).toBe(5);
        expect(model.safePath).toBe("Desconocida");
        expect(model.safeElement).toBe("Desconocido");
        expect(model.hasLightCone).toBe(true);
        expect(model.lightConeName).toBe("Sin cono de luz");
        expect(model.lightConeIcon).toBe("/fallbacks/icon.svg");
        expect(model.lightConeRarity).toBe(0);
        expect(model.memospriteName).toBe("Memosprite");
        expect(model.memospriteIcon).toBe("/fallbacks/icon.svg");
        expect(model.levelText).toBe("0");
        expect(model.rankText).toBe("0");
        expect(model.lightConeLevelText).toBe("-");
        expect(model.lightConeRankText).toBe("-");
        expect(model.labels.lightCone).toBe("Cono de luz");
    });

    it("handles unknown numeric path and custom element fallback formatting", () => {
        const model = buildHsrCharacterDetailViewModel(
            {
                ...baseCharacter,
                path: 99,
                element: "chaos",
                equip: undefined,
            },
            "es-ES",
        );

        expect(model.safePath).toBe("Vía 99");
        expect(model.safeElement).toBe("Chaos");
        expect(model.hasLightCone).toBe(false);
        expect(model.lightConeName).toBe("Sin cono de luz");
    });
});
