export const OCULUS_TYPES = [
    "anemo",
    "geo",
    "electro",
    "dendro",
    "hydro",
    "pyro",
    "luno",
] as const;

export type OculusType = (typeof OCULUS_TYPES)[number];

/**
 * Collectable oculi per type. They change with game versions, so update them when a patch adds
 * more. `undefined` means the total is not confirmed yet: the tile shows no progress bar.
 */
export const OCULUS_TOTALS: Record<OculusType, number | undefined> = {
    anemo: 66,
    geo: 131,
    electro: 181,
    dendro: 271,
    hydro: 271,
    pyro: 133,
    luno: undefined,
};

export interface OculusProgress {
    collected: number;
    total: number;
    /** Whole number 0–100. */
    percent: number;
}

/** Progress towards a total, or `null` when the total is unknown. Clamped so a stale total never shows > 100%. */
export function oculusProgress(collected: number, total: number | undefined): OculusProgress | null {
    if (total === undefined || total <= 0) return null;
    const safeCollected = Number.isFinite(collected) ? Math.max(0, collected) : 0;
    const percent = Math.min(100, Math.round((safeCollected / total) * 100));
    return { collected: safeCollected, total, percent };
}
