import assert from "node:assert/strict";
import test from "node:test";
import { OCULUS_TOTALS, oculusProgress } from "./oculi.ts";

test("reports collected, total and a rounded percentage", () => {
    assert.deepEqual(oculusProgress(33, 66), { collected: 33, total: 66, percent: 50 });
    assert.deepEqual(oculusProgress(1, 3), { collected: 1, total: 3, percent: 33 });
});

test("has no progress when the total is unknown", () => {
    assert.equal(oculusProgress(10, undefined), null);
    assert.equal(oculusProgress(10, 0), null);
});

test("never exceeds 100% when the total is stale", () => {
    assert.deepEqual(oculusProgress(70, 66), { collected: 70, total: 66, percent: 100 });
});

test("clamps negative or non-finite counts to zero", () => {
    assert.equal(oculusProgress(-5, 66)?.percent, 0);
    assert.equal(oculusProgress(Number.NaN, 66)?.percent, 0);
});

test("lists a positive total for every type that has one", () => {
    for (const total of Object.values(OCULUS_TOTALS)) {
        assert.ok(total === undefined || (Number.isInteger(total) && total > 0));
    }
});
