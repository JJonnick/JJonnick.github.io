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

// Type for the genshin.json structure
interface GenshinData {
    characters?: Character[];
    account?: Account;
}

export const getCharacters = async (): Promise<Character[]> => {
    try {
        // Try reading from genshin.json first (new format)
        const genshinData = readPublicJSON<GenshinData>('genshin.json');
        if (genshinData?.characters) {
            return genshinData.characters;
        }
        
        // Fallback to characters.json (old format)
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
        // Try reading from genshin.json first (new format)
        const genshinData = readPublicJSON<GenshinData>('genshin.json');
        if (genshinData?.account) {
            return genshinData.account;
        }
        
        // Fallback to account.json (old format)
        const data = readPublicJSON<Account>('account.json');
        return data;
    } catch (error) {
        console.error('Error fetching account:', error);
        return null;
    }
}