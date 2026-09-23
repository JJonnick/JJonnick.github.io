import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createDatasetLoader } from "./dataset-loader.ts";

function dataRoot(files: Record<string, string>): string {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "datasets-"));
    for (const [relativePath, content] of Object.entries(files)) {
        const filePath = path.join(root, relativePath);
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, content);
    }
    return root;
}

const hsrCharacter = { id: 1001, icon: "march.png", name: "March 7th", rarity: 4, equip: null };

test("loads and validates a game's dataset from its folder", () => {
    const loadDataset = createDatasetLoader(
        dataRoot({ "hsr/characters.json": JSON.stringify([hsrCharacter]) }),
    );

    const [character] = loadDataset("hsr", "characters");
    assert.equal(character?.name, "March 7th");
    assert.equal(character?.equip, undefined);
});

test("caches datasets after the first read", () => {
    const root = dataRoot({ "hsr/characters.json": JSON.stringify([hsrCharacter]) });
    const loadDataset = createDatasetLoader(root);

    const first = loadDataset("hsr", "characters");
    fs.rmSync(path.join(root, "hsr/characters.json"));

    assert.equal(loadDataset("hsr", "characters"), first);
});

test("throws when the dataset file is missing", () => {
    const loadDataset = createDatasetLoader(dataRoot({}));

    assert.throws(() => loadDataset("genshin", "account"), /account\.json no válido: falta/);
});

test("throws when the dataset is not JSON", () => {
    const loadDataset = createDatasetLoader(dataRoot({ "characters.json": "{ nope" }));

    assert.throws(() => loadDataset("genshin", "characters"), /no es JSON válido/);
});

test("throws with the schema issues when the dataset does not match", () => {
    const loadDataset = createDatasetLoader(
        dataRoot({ "hsr/characters.json": JSON.stringify([{ ...hsrCharacter, name: 7 }]) }),
    );

    assert.throws(
        () => loadDataset("hsr", "characters"),
        (error: Error) =>
            error.message.includes("hsr/characters.json no válido: no cumple el esquema") &&
            error.message.includes("name"),
    );
});
