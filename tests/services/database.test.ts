import fs from "fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("fs", () => ({
    default: {
        readFileSync: vi.fn(),
    },
}));

const mockedReadFileSync = vi.mocked(fs.readFileSync);

describe("database service", () => {
    beforeEach(() => {
        vi.resetModules();
        mockedReadFileSync.mockReset();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns parsed characters on successful read", async () => {
        mockedReadFileSync.mockReturnValueOnce(
            JSON.stringify([
                {
                    id: 1,
                    name: "Amber",
                    rarity: 4,
                },
            ]),
        );

        const { getCharacters } = await import("@/services/database");
        const result = await getCharacters();

        expect(result).toEqual([
            {
                id: 1,
                name: "Amber",
                rarity: 4,
            },
        ]);
        expect(mockedReadFileSync).toHaveBeenCalledWith(
            expect.stringContaining("/public/data/characters.json"),
            "utf-8",
        );
    });

    it("returns empty list for characters when file read fails", async () => {
        mockedReadFileSync.mockImplementationOnce(() => {
            throw new Error("file not found");
        });

        const { getCharacters } = await import("@/services/database");
        const result = await getCharacters();

        expect(result).toEqual([]);
        expect(console.error).toHaveBeenCalledTimes(1);
    });

    it("returns account data or null fallback on read failure", async () => {
        mockedReadFileSync
            .mockReturnValueOnce(JSON.stringify({ uid: 100, nickname: "A" }))
            .mockImplementationOnce(() => {
                throw new Error("broken");
            });

        const { getAccount } = await import("@/services/database");

        await expect(getAccount()).resolves.toEqual({ uid: 100, nickname: "A" });
        await expect(getAccount()).resolves.toBeNull();
    });

    it("resolves character by id and returns null when not found", async () => {
        mockedReadFileSync.mockReturnValue(
            JSON.stringify([
                { id: 10, name: "Keqing" },
                { id: 20, name: "Furina" },
            ]),
        );

        const { getCharacterById } = await import("@/services/database");

        await expect(getCharacterById(20)).resolves.toEqual({
            id: 20,
            name: "Furina",
        });
        await expect(getCharacterById(999)).resolves.toBeNull();
    });

    it("reads HSR data from hsr folder and applies fallbacks", async () => {
        mockedReadFileSync
            .mockReturnValueOnce(JSON.stringify([{ id: 1101, name: "Bronya" }]))
            .mockImplementationOnce(() => {
                throw new Error("missing hsr account");
            });

        const { getHsrCharacters, getHsrAccount } = await import(
            "@/services/database"
        );

        await expect(getHsrCharacters()).resolves.toEqual([
            { id: 1101, name: "Bronya" },
        ]);
        await expect(getHsrAccount()).resolves.toBeNull();
        expect(mockedReadFileSync).toHaveBeenCalledWith(
            expect.stringContaining("/public/data/hsr/characters.json"),
            "utf-8",
        );
        expect(mockedReadFileSync).toHaveBeenCalledWith(
            expect.stringContaining("/public/data/hsr/account.json"),
            "utf-8",
        );
    });

    it("resolves HSR character by id and returns null when not found", async () => {
        mockedReadFileSync.mockReturnValue(
            JSON.stringify([
                { id: 1001, name: "Asta" },
                { id: 1008, name: "Herta" },
            ]),
        );

        const { getHsrCharacterById } = await import("@/services/database");

        await expect(getHsrCharacterById(1008)).resolves.toEqual({
            id: 1008,
            name: "Herta",
        });
        await expect(getHsrCharacterById(4040)).resolves.toBeNull();
    });
});
