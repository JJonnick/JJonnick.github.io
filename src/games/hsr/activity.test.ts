import assert from "node:assert/strict";
import test from "node:test";
import { toActivityView } from "./activity.ts";

const activity = {
    memory_of_chaos: {
        has_data: true,
        total_stars: 36,
        max_floor: "Memory of Chaos (XII)",
        total_battles: 14,
    },
    pure_fiction: null,
    apocalyptic_shadow: { has_data: false, total_stars: 0, max_floor: "", total_battles: 0 },
    simulated_universe: {
        unlocked_buff_num: 250,
        unlocked_miracle_num: 120,
        unlocked_skill_points: 42,
        finish_cnt: 3,
    },
    diary: {
        month: 9,
        current_hcoin: 8200,
        current_rails_pass: 4,
        last_hcoin: 12400,
        last_rails_pass: 6,
    },
    notes: {
        fetched_at: "2026-09-20T01:30:00+00:00",
        current_stamina: 180,
        max_stamina: 300,
        current_reserve_stamina: 2400,
        current_train_score: 500,
        max_train_score: 500,
        current_rogue_score: 14000,
        max_rogue_score: 14000,
        accepted_expedition_num: 4,
        total_expedition_num: 4,
        remaining_weekly_discounts: 1,
        max_weekly_discounts: 3,
    },
};

test("lists every endgame mode and marks the ones without data", () => {
    const { endgame } = toActivityView(activity);

    assert.deepEqual(
        endgame.map((group) => group.title),
        ["Memoria del Caos", "Ficción Pura", "Sombra Apocalíptica"],
    );
    assert.deepEqual(
        endgame[0]?.rows.map((row) => row.value),
        [36, "Memory of Chaos (XII)", 14],
    );
    assert.equal(endgame[1]?.rows[0]?.value, "Sin datos");
    assert.equal(endgame[2]?.rows[0]?.value, "Sin datos");
});

test("names the diary month and shows notes as ratios with their snapshot time", () => {
    const view = toActivityView(activity);

    assert.equal(view.diary?.title, "Ingresos de septiembre");
    assert.equal(view.notes?.rows[0]?.value, "180 / 300");
    assert.match(view.notes?.updatedText ?? "", /20 de septiembre de 2026.*3:30/);
});

test("drops sections that were not synced", () => {
    const view = toActivityView({
        ...activity,
        simulated_universe: null,
        diary: null,
        notes: null,
    });

    assert.equal(view.simulatedUniverse, null);
    assert.equal(view.diary, null);
    assert.equal(view.notes, null);
});
