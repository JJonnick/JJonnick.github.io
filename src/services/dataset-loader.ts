import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { GameId } from "@/games/game";
import {
    type Account,
    type Character,
    GenshinAccountSchema,
    GenshinCharactersSchema,
    type HsrAccount,
    HsrAccountSchema,
    type HsrActivity,
    HsrActivitySchema,
    type HsrCharacter,
    HsrCharactersSchema,
} from "../schemas/datasets.ts";

type DatasetValueMap = {
    genshin: { characters: Character[]; account: Account };
    hsr: { characters: HsrCharacter[]; account: HsrAccount; activity: HsrActivity };
};

export type DatasetKind<G extends GameId = GameId> = keyof DatasetValueMap[G] & string;

const DATASETS = {
    genshin: {
        folder: "",
        schemas: { characters: GenshinCharactersSchema, account: GenshinAccountSchema },
    },
    hsr: {
        folder: "hsr",
        schemas: {
            characters: HsrCharactersSchema,
            account: HsrAccountSchema,
            activity: HsrActivitySchema,
        },
    },
} as const;

export type LoadDataset = <G extends GameId, K extends DatasetKind<G>>(
    game: G,
    kind: K,
) => DatasetValueMap[G][K];

/**
 * Loads a Game's Dataset from `<dataRoot>/<game folder>/<kind>.json`, validates it and caches it.
 * Throws when the file is missing, is not JSON, or does not match its schema, so a bad data sync
 * fails the build instead of publishing empty pages.
 */
export function createDatasetLoader(dataRoot: string): LoadDataset {
    const cache = new Map<string, unknown>();

    return <G extends GameId, K extends DatasetKind<G>>(game: G, kind: K) => {
        const { folder } = DATASETS[game];
        const schemas: Record<string, z.ZodType> = DATASETS[game].schemas;
        const relativePath = path.posix.join(folder, `${kind}.json`);
        const cached = cache.get(relativePath);
        if (cached !== undefined) return cached as DatasetValueMap[G][K];

        const filePath = path.join(dataRoot, relativePath);
        const invalid = (reason: string) =>
            new Error(`Dataset ${relativePath} no válido: ${reason}`);

        if (!fs.existsSync(filePath)) throw invalid(`falta el archivo ${filePath}.`);

        let json: unknown;
        try {
            json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        } catch (error) {
            throw invalid(`no es JSON válido (${(error as Error).message}).`);
        }

        const parsed = schemas[kind].safeParse(json);
        if (!parsed.success)
            throw invalid(`no cumple el esquema.\n${z.prettifyError(parsed.error)}`);

        cache.set(relativePath, parsed.data);
        return parsed.data as DatasetValueMap[G][K];
    };
}

/**
 * Loads every Dataset of every Game from `dataRoot` and returns the error message of each invalid
 * one, so a data sync can reject all broken files at once before they reach the build.
 */
export function validateDatasets(dataRoot: string): string[] {
    const load = createDatasetLoader(dataRoot);
    const errors: string[] = [];
    for (const [game, { schemas }] of Object.entries(DATASETS)) {
        for (const kind of Object.keys(schemas)) {
            try {
                load(game as GameId, kind as DatasetKind);
            } catch (error) {
                errors.push((error as Error).message);
            }
        }
    }
    return errors;
}

export const loadDataset = createDatasetLoader(path.resolve(process.cwd(), "public", "data"));
