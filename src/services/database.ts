import {
    type Character,
    type Account,
    type HsrAccount,
    type HsrCharacter,
} from "@/types";
import fs from 'fs';
import path from 'path';

function isSafeFilename(segment: string): boolean {
    return /^[a-zA-Z0-9_-]+\.json$/.test(segment);
}

function isSafeFolder(segment: string): boolean {
    if (!segment) return true;
    return /^[a-zA-Z0-9_-]+$/.test(segment);
}

function readPublicJSON<T>(filename: string, folder = ''): T | null {
    try {
        if (!isSafeFilename(filename)) {
            throw new Error('Invalid filename: contains forbidden characters or traversal patterns');
        }

        if (!isSafeFolder(folder)) {
            throw new Error('Invalid folder path: contains forbidden characters or traversal patterns');
        }

        const dataRoot = path.resolve(process.cwd(), 'public', 'data');
        const filePath = path.resolve(dataRoot, folder, filename);
        const relativePath = path.relative(dataRoot, filePath);
        if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
            throw new Error('Resolved path escapes data root');
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent) as T;
    } catch (error) {
        const label = folder ? `${folder}/${filename}` : filename;
        console.error(`Error reading ${label}:`, error);
        return null;
    }
}

export const getCharacters = async (): Promise<Character[]> => {
    const data = readPublicJSON<Character[]>('characters.json');
    return data || [];
}

export const getCharacterById = async (id: number): Promise<Character | null> => {
    const characters = await getCharacters();
    return characters.find(char => char.id === id) ?? null;
}

export const getAccount = async (): Promise<Account | null> => {
    return readPublicJSON<Account>('account.json');
}

export const getHsrCharacters = async (): Promise<HsrCharacter[]> => {
    const data = readPublicJSON<HsrCharacter[]>('characters.json', 'hsr');
    return data || [];
}

export const getHsrCharacterById = async (id: number): Promise<HsrCharacter | null> => {
    const characters = await getHsrCharacters();
    return characters.find(char => char.id === id) ?? null;
}

export const getHsrAccount = async (): Promise<HsrAccount | null> => {
    return readPublicJSON<HsrAccount>('account.json', 'hsr');
}
