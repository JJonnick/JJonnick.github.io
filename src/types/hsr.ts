export interface HsrAccountStats {
    abyss_process?: string;
    achievement_num?: number;
    active_days?: number;
    avatar_num?: number;
    chest_num?: number;
    dreamscape_pass_sticker?: number;
}

export interface HsrAccount {
    avatar?: string;
    level?: number;
    nickname?: string;
    server?: string;
    stats?: HsrAccountStats;
}

export interface HsrLightCone {
    id?: number;
    icon?: string;
    level?: number;
    name?: string;
    rank?: number;
    rarity?: number;
}

export interface HsrMemosprite {
    icon?: string;
    name?: string;
}

export interface HsrCharacter {
    id: number;
    icon: string;
    name: string;
    rarity?: number;
    element?: string;
    level?: number;
    rank?: number;
    path?: string | number;
    equip?: HsrLightCone;
    memosprite?: HsrMemosprite;
}