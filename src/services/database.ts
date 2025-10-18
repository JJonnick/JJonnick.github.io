import { type Character, type Account } from "@/types";

// Local JSON data imports
import charactersData from '@/data/characters.json';
import accountData from '@/data/account.json';

export const getCharacters = async (): Promise<Character[]> => {
    try {
        return charactersData as Character[];
    } catch (error) {
        console.error('Error fetching characters:', error);
        return [];
    }
}

export const getCharacterById = async (id: number): Promise<Character | null> => {
    try {
        const characters = charactersData as Character[];
        const character = characters.find(char => char.id === id);
        return character || null;
    } catch (error) {
        console.error('Error fetching character:', error);
        return null;
    }
}

export const getAccount = async (): Promise<Account | null> => {
    try {
        return accountData as Account;
    } catch (error) {
        console.error('Error fetching account:', error);
        return null;
    }
}