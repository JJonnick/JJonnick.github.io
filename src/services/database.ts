import {
    type Character,
    type Account,
    type HsrAccount,
    type HsrCharacter,
} from "@/types";
import fs from 'fs';
import path from 'path';

function readPublicJSON<T>(filename: string, folder = ''): T | null {
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', folder, filename);
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