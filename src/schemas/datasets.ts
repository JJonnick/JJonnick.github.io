import { z } from "zod";

const nonNegativeInteger = z.number().int().nonnegative();

const genshinStatsSchema = z.object({
    account_uid: nonNegativeInteger,
    achievements: nonNegativeInteger,
    days_active: nonNegativeInteger,
    characters: nonNegativeInteger,
    spiral_abyss: z.string(),
    anemoculi: nonNegativeInteger,
    geoculi: nonNegativeInteger,
    electroculi: nonNegativeInteger,
    dendroculi: nonNegativeInteger,
    hydroculi: nonNegativeInteger,
    pyroculi: nonNegativeInteger,
    lunoculi: nonNegativeInteger,
    common_chests: nonNegativeInteger,
    exquisite_chests: nonNegativeInteger,
    precious_chests: nonNegativeInteger,
    luxurious_chests: nonNegativeInteger,
    remarkable_chests: nonNegativeInteger,
    unlocked_waypoints: nonNegativeInteger,
    unlocked_domains: nonNegativeInteger,
    max_friendship_characters: nonNegativeInteger.optional(),
    stygian: z
        .object({
            difficulty: nonNegativeInteger,
            has_data: z.boolean(),
            name: z.string(),
            unlocked: z.boolean(),
        })
        .optional(),
    theater: z
        .object({
            has_data: z.boolean(),
            has_detail_data: z.boolean(),
            max_act: nonNegativeInteger,
            unlocked: z.boolean(),
        })
        .optional(),
});

const genshinAccountSchema = z.object({
    uid: nonNegativeInteger,
    nickname: z.string(),
    level: nonNegativeInteger,
    server: z.string(),
    server_name: z.string(),
    game_biz: z.string(),
    stats: genshinStatsSchema,
});

const genshinCharacterSchema = z.object({
    id: nonNegativeInteger,
    collab: z.boolean(),
    constellation: nonNegativeInteger,
    element: z.string(),
    friendship: nonNegativeInteger,
    icon: z.string(),
    level: nonNegativeInteger,
    name: z.string(),
    rarity: nonNegativeInteger,
    weapon_type: nonNegativeInteger,
});

const hsrAccountSchema = z.object({
    avatar: z.string().optional(),
    level: nonNegativeInteger.optional(),
    nickname: z.string().optional(),
    server: z.string().optional(),
    stats: z
        .object({
            abyss_process: z.string().optional(),
            achievement_num: nonNegativeInteger.optional(),
            active_days: nonNegativeInteger.optional(),
            avatar_num: nonNegativeInteger.optional(),
            chest_num: nonNegativeInteger.optional(),
            dreamscape_pass_sticker: nonNegativeInteger.optional(),
        })
        .optional(),
});

const hsrCharacterSchema = z.object({
    id: nonNegativeInteger,
    icon: z.string(),
    name: z.string(),
    rarity: nonNegativeInteger.optional(),
    element: z.string().optional(),
    level: nonNegativeInteger.optional(),
    rank: nonNegativeInteger.optional(),
    path: z.union([z.string(), nonNegativeInteger]).optional(),
    equip: z
        .object({
            id: nonNegativeInteger.optional(),
            icon: z.string().optional(),
            level: nonNegativeInteger.optional(),
            name: z.string().optional(),
            rank: nonNegativeInteger.optional(),
            rarity: nonNegativeInteger.optional(),
        })
        .nullish()
        .transform((value) => value ?? undefined),
    memosprite: z
        .object({
            icon: z.string().optional(),
            name: z.string().optional(),
        })
        .nullish()
        .transform((value) => value ?? undefined),
});

const hsrChallengeSchema = z
    .object({
        has_data: z.boolean(),
        total_stars: nonNegativeInteger,
        max_floor: z.string(),
        total_battles: nonNegativeInteger,
    })
    .nullable();

const hsrActivitySchema = z.object({
    memory_of_chaos: hsrChallengeSchema,
    pure_fiction: hsrChallengeSchema,
    apocalyptic_shadow: hsrChallengeSchema,
    simulated_universe: z
        .object({
            unlocked_buff_num: nonNegativeInteger,
            unlocked_miracle_num: nonNegativeInteger,
            unlocked_skill_points: nonNegativeInteger,
            finish_cnt: nonNegativeInteger,
        })
        .nullable(),
    diary: z
        .object({
            month: z.number().int().min(1).max(12),
            current_hcoin: nonNegativeInteger,
            current_rails_pass: nonNegativeInteger,
            last_hcoin: nonNegativeInteger,
            last_rails_pass: nonNegativeInteger,
        })
        .nullable(),
});

export const GenshinAccountSchema = z.compile(genshinAccountSchema, { strict: true });
export const GenshinCharactersSchema = z.compile(z.array(genshinCharacterSchema), {
    strict: true,
});
export const HsrAccountSchema = z.compile(hsrAccountSchema, { strict: true });
export const HsrCharactersSchema = z.compile(z.array(hsrCharacterSchema), { strict: true });
export const HsrActivitySchema = z.compile(hsrActivitySchema, { strict: true });

export type Account = z.infer<typeof GenshinAccountSchema>;
export type Character = z.infer<typeof genshinCharacterSchema>;
export type HsrAccount = z.infer<typeof HsrAccountSchema>;
export type HsrCharacter = z.infer<typeof hsrCharacterSchema>;
export type HsrActivity = z.infer<typeof HsrActivitySchema>;
export type HsrChallenge = NonNullable<HsrActivity["memory_of_chaos"]>;
export type HsrAccountStats = NonNullable<HsrAccount["stats"]>;
export type HsrLightCone = NonNullable<HsrCharacter["equip"]>;
export type HsrMemosprite = NonNullable<HsrCharacter["memosprite"]>;
