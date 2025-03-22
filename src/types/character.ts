export interface Characters {
    characters: Character[];
}

export interface Character {
    id: number;
    collab: boolean;
    constellation: number;
    element: string;
    friendship: number;
    icon: string;
    level: number;
    name: string;
    rarity: number;
    weapon_type: number;
}

export interface Weapon {
    icon: string;
    level: number;
    name: string;
    rarity: number;
    refinement: number;
}