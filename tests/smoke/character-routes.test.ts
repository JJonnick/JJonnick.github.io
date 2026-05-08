import { describe, expect, it } from "vitest";
import {
    getCharacterById,
    getCharacters,
    getHsrCharacterById,
    getHsrCharacters,
} from "@/services/database";
import { buildGenshinCharacterDetailViewModel } from "@/services/genshin-character-detail";
import { buildHsrCharacterDetailViewModel } from "@/services/hsr-character-detail";

describe("critical route smoke coverage", () => {
    it("supports representative Genshin character IDs and detail transformations", async () => {
        const characters = await getCharacters();
        expect(characters.length).toBeGreaterThan(1);

        const representativeIds = [characters[0].id, characters[characters.length - 1].id];

        for (const id of representativeIds) {
            const character = await getCharacterById(id);
            expect(character).not.toBeNull();

            const viewModel = buildGenshinCharacterDetailViewModel(character!);
            expect(viewModel.safeName.length).toBeGreaterThan(0);
            expect(viewModel.safeIcon.length).toBeGreaterThan(0);
            expect(viewModel.safeRarity).toBeGreaterThanOrEqual(1);
            expect(viewModel.safeRarity).toBeLessThanOrEqual(5);
        }
    });

    it("supports representative HSR character IDs and detail transformations", async () => {
        const characters = await getHsrCharacters();
        expect(characters.length).toBeGreaterThan(1);

        const representativeIds = [characters[0].id, characters[characters.length - 1].id];

        for (const id of representativeIds) {
            const character = await getHsrCharacterById(id);
            expect(character).not.toBeNull();

            const viewModelEs = buildHsrCharacterDetailViewModel(character!, "es");
            const viewModelEn = buildHsrCharacterDetailViewModel(character!, "en");
            expect(viewModelEs.safeName.length).toBeGreaterThan(0);
            expect(viewModelEn.safeName.length).toBeGreaterThan(0);
            expect(viewModelEs.safeRarity).toBeGreaterThanOrEqual(1);
            expect(viewModelEn.safeRarity).toBeLessThanOrEqual(5);
        }
    });
});
