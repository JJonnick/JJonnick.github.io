import assert from "node:assert/strict";
import test from "node:test";
import type { Game } from "../game.ts";
import { toCharacterDetail } from "./detail.ts";

const game = {
    elementVisuals: { pyro: { iconPath: "/elements/pyro.svg", badgeBg: "" } },
} as unknown as Game;

const character = {
    id: 10000046,
    collab: false,
    constellation: 1,
    element: "Pyro",
    friendship: 10,
    icon: "hutao.png",
    level: 90,
    name: "Hu Tao",
    rarity: 5,
    weapon_type: 13,
};

test("formats stats and resolves the element icon", () => {
    const detail = toCharacterDetail(character, game);

    assert.equal(detail.elementIcon, "/elements/pyro.svg");
    assert.equal(detail.element, "Pyro");
    assert.deepEqual(
        detail.stats.map(({ value }) => value),
        ["90", "C1", "10", "Lanza"],
    );
});

test("falls back for blank names, unknown elements and weapons", () => {
    const detail = toCharacterDetail(
        { ...character, name: " ", icon: "", element: "", weapon_type: 99, rarity: 0 },
        game,
    );

    assert.equal(detail.name, "Personaje desconocido");
    assert.equal(detail.icon, "/fallbacks/icon.svg");
    assert.equal(detail.element, "Elemento desconocido");
    assert.equal(detail.elementIcon, "/fallbacks/icon.svg");
    assert.equal(detail.rarity, 1);
    assert.equal(detail.stats.at(-1)?.value, "Desconocido");
});
