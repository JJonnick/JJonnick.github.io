import { type Character, type Account } from "@/types";
import fs from 'fs';
import path from 'path';

// Helper to read JSON files from public directory
function readPublicJSON<T>(filename: string): T | null {
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', filename);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent) as T;
    } catch (error) {
        console.error(`Error reading ${filename}:`, error);
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