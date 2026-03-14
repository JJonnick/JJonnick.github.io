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
    try {
        const data = readPublicJSON<Character[]>('characters.json');
        return data || [];
    } catch (error) {
        console.error('Error fetching characters:', error);
        return [];
    }
}

export const getCharacterById = async (id: number): Promise<Character | null> => {
    try {
        const characters = await getCharacters();
        const character = characters.find(char => char.id === id);
        return character || null;
    } catch (error) {
        console.error('Error fetching character:', error);
        return null;
    }
}

export const getAccount = async (): Promise<Account | null> => {
    try {
        const data = readPublicJSON<Account>('account.json');
        return data;
    } catch (error) {
        console.error('Error fetching account:', error);
        return null;
    }
}

export const getHsrCharacters = async (): Promise<HsrCharacter[]> => {
    try {
        const data = readPublicJSON<HsrCharacter[]>('characters.json', 'hsr');
        return data || [];
    } catch (error) {
        console.error('Error fetching HSR characters:', error);
        return [];
    }
}

export const getHsrCharacterById = async (id: number): Promise<HsrCharacter | null> => {
    try {
        const characters = await getHsrCharacters();
        const character = characters.find(char => char.id === id);
        return character || null;
    } catch (error) {
        console.error('Error fetching HSR character:', error);
        return null;
    }
}

export const getHsrAccount = async (): Promise<HsrAccount | null> => {
    try {
        const data = readPublicJSON<HsrAccount>('account.json', 'hsr');
        return data;
    } catch (error) {
        console.error('Error fetching HSR account:', error);
        return null;
    }
}