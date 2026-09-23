import assert from "node:assert/strict";
import test from "node:test";
import { toCharacterDetail } from "./detail.ts";

const character = {
    id: 1005,
    icon: "kafka.png",
    name: "Kafka",
    rarity: 5,
    element: "Lightning",
    level: 80,
    rank: 2,
    path: 5,
    equip: { name: "Patience Is All You Need", icon: "lc.png", level: 80, rank: 1, rarity: 5 },
    memosprite: undefined,
};

test("localises element, path and numbers", () => {
    const es = toCharacterDetail(character, "es");
    const en = toCharacterDetail(character, "en");

    assert.equal(es.element, "Rayo");
    assert.equal(es.path, "Nihilidad");
    assert.equal(en.element, "Lightning");
    assert.equal(en.path, "Nihility");
    assert.equal(toCharacterDetail({ ...character, level: 1234 }, "es").levelText, "1234");
    assert.equal(toCharacterDetail({ ...character, level: 12345 }, "en").levelText, "12,345");
});

test("describes the equipped light cone", () => {
    const { lightCone } = toCharacterDetail(character, "es");

    assert.deepEqual(lightCone, {
        isEquipped: true,
        name: "Patience Is All You Need",
        icon: "lc.png",
        rarity: 5,
        levelText: "80",
        rankText: "S1",
    });
});

test("falls back when optional data is missing", () => {
    const detail = toCharacterDetail(
        {
            id: 1,
            icon: "",
            name: " ",
            element: "void",
            path: 42,
            equip: undefined,
            memosprite: undefined,
        },
        "es",
    );

    assert.equal(detail.name, "Personaje desconocido");
    assert.equal(detail.icon, "/fallbacks/icon.svg");
    assert.equal(detail.element, "Void");
    assert.equal(detail.path, "Vía 42");
    assert.equal(detail.rarity, 1);
    assert.equal(detail.lightCone.isEquipped, false);
    assert.equal(detail.lightCone.name, "Sin cono de luz");
    assert.equal(detail.lightCone.rankText, "-");
    assert.equal(detail.memosprite, undefined);
});

test("keeps memosprite data with fallbacks", () => {
    const detail = toCharacterDetail({ ...character, memosprite: { icon: "m.png" } }, "en");

    assert.deepEqual(detail.memosprite, { name: "Memosprite", icon: "m.png" });
});
