import { type Account, type Character, type HsrAccount, type HsrCharacter } from "@/types";
import fs from "node:fs";
import path from "node:path";

type DatasetName = "characters" | "account" | "hsrCharacters" | "hsrAccount";

type DatasetValueMap = {
    characters: Character[];
    account: Account;
    hsrCharacters: HsrCharacter[];
    hsrAccount: HsrAccount;
};

const DATASET_FILE_MAP: Record<DatasetName, { folder: string; filename: string }> = {
    characters: { folder: "", filename: "characters.json" },
    account: { folder: "", filename: "account.json" },
    hsrCharacters: { folder: "hsr", filename: "characters.json" },
    hsrAccount: { folder: "hsr", filename: "account.json" },
};

const jsonCache = new Map<DatasetName, DatasetValueMap[DatasetName]>();

function readDataset<K extends DatasetName>(datasetName: K): DatasetValueMap[K] | null {
    if (jsonCache.has(datasetName)) {
        return jsonCache.get(datasetName) as DatasetValueMap[K];
    }

    const { folder, filename } = DATASET_FILE_MAP[datasetName];
    const dataRoot = path.resolve(process.cwd(), "public", "data");
    const filePath = path.resolve(dataRoot, folder, filename);
    const relativePath = path.relative(dataRoot, filePath);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
        console.error(`Error reading dataset ${datasetName}: resolved path escapes data root`);
        return null;
    }

    try {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(fileContent) as DatasetValueMap[K];
        jsonCache.set(datasetName, parsed);
        return parsed;
    } catch (error) {
        console.error(`Error reading dataset ${datasetName}:`, error);
        return null;
    }
}

export const getCharacters = async (): Promise<Character[]> => {
    const characters = readDataset("characters");
    return characters ?? [];
};

export const getCharacterById = async (id: number): Promise<Character | null> => {
    const characters = await getCharacters();
    return characters.find((char) => char.id === id) ?? null;
};

export const getAccount = async (): Promise<Account | null> => {
    return readDataset("account");
};

export const getHsrCharacters = async (): Promise<HsrCharacter[]> => {
    const characters = readDataset("hsrCharacters");
    return characters ?? [];
};

export const getHsrCharacterById = async (id: number): Promise<HsrCharacter | null> => {
    const characters = await getHsrCharacters();
    return characters.find((char) => char.id === id) ?? null;
};

export const getHsrAccount = async (): Promise<HsrAccount | null> => {
    return readDataset("hsrAccount");
};
