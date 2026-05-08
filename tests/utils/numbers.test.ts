import { describe, expect, it } from "vitest";
import { toSafeNumber } from "@/utils/numbers";

describe("toSafeNumber", () => {
    it("returns finite numbers", () => {
        expect(toSafeNumber(12)).toBe(12);
        expect(toSafeNumber("42")).toBe(42);
    });

    it("returns 0 for invalid numeric values", () => {
        expect(toSafeNumber(undefined)).toBe(0);
        expect(toSafeNumber(null)).toBe(0);
        expect(toSafeNumber("NaN")).toBe(0);
        expect(toSafeNumber(Number.POSITIVE_INFINITY)).toBe(0);
    });
});
