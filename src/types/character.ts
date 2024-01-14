export interface Characters {
    characters: Character[];
}

export interface Character {
    constellation: number;
    element:       string;
    friendship:    number;
    icon:          string;
    level:         number;
    name:          string;
    rarity:        number;
    weapon:        Weapon;
}

export interface Weapon {
    icon:       string;
    level:      number;
    name:       string;
    rarity:     number;
    refinement: number;
}

export interface CharacterJson {
    id: string;
    pos: number;
}