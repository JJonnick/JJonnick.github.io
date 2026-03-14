export const toSafeNumber = (value: unknown): number => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
};
