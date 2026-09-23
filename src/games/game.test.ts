import assert from "node:assert/strict";
import test from "node:test";
import { findGameForPath, isInCharacterSection } from "./game.ts";

const root = { homePath: "/", charactersPath: "/characters" };
const nested = { homePath: "/hsr", charactersPath: "/hsr/characters" };
const games = [root, nested];

test("picks the game with the most specific home path", () => {
    assert.equal(findGameForPath(games, "/"), root);
    assert.equal(findGameForPath(games, "/characters/2"), root);
    assert.equal(findGameForPath(games, "/hsr"), nested);
    assert.equal(findGameForPath(games, "/hsr/characters/1001"), nested);
    assert.equal(findGameForPath(games, "/hsrx"), root);
});

test("detects the character section by path segment", () => {
    assert.ok(isInCharacterSection(nested, "/hsr/characters"));
    assert.ok(isInCharacterSection(nested, "/hsr/characters/3"));
    assert.ok(!isInCharacterSection(nested, "/hsr"));
    assert.ok(!isInCharacterSection(root, "/charactersx"));
});
