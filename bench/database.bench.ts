import fs from "node:fs";
import path from "node:path";
import { bench, describe } from "vitest";
import {
    getCharacterById,
    getCharacters,
    getHsrCharacterById,
    getHsrCharacters,
} from "@/services/database";

const dataRoot = path.resolve(process.cwd(), "public", "data");
const charactersJson = fs.readFileSync(path.join(dataRoot, "characters.json"), "utf-8");
const hsrCharactersJson = fs.readFileSync(path.join(dataRoot, "hsr", "characters.json"), "utf-8");

const characters = await getCharacters();
const hsrCharacters = await getHsrCharacters();
const characterIds = characters.map((character) => character.id);
const hsrCharacterIds = hsrCharacters.map((character) => character.id);

describe("dataset parsing", () => {
    bench("parse the Genshin characters dataset", () => {
        JSON.parse(charactersJson);
    });

    bench("parse the HSR characters dataset", () => {
        JSON.parse(hsrCharactersJson);
    });
});

describe("cached dataset access", () => {
    bench("read the cached Genshin roster", async () => {
        await getCharacters();
    });

    bench("look up every Genshin character by id", async () => {
        for (const id of characterIds) {
            await getCharacterById(id);
        }
    });

    bench("look up every HSR character by id", async () => {
        for (const id of hsrCharacterIds) {
            await getHsrCharacterById(id);
        }
    });
});
