import json from "../../DATA.json";
import { type CharacterJson } from "../types/character";

export const getCharacters = (): CharacterJson[] => {
    const { characters } = json;

    return characters.map((char, idx) => {
        return {
            id: char.name.toLowerCase().replace(/\s+/g, '-'),
            pos: idx
        }
    })
}

export const getCharacterByIndex = (index: number) => {
    const { characters } = json;

    return characters[index];
}

export const getStats = () => {
    const { accounts, stats } = json;

    return {
        ...accounts[0],
        ...stats
    }
}