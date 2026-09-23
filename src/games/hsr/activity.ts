import type { StatRow } from "@/components/StatsList.astro";
import type { HsrActivity, HsrChallenge } from "@/types/hsr";

export interface ActivityGroup {
    title: string;
    rows: StatRow[];
}

export interface ActivityView {
    /** One group per endgame mode, in the game's menu order. */
    endgame: ActivityGroup[];
    simulatedUniverse: ActivityGroup | null;
    diary: ActivityGroup | null;
    notes: (ActivityGroup & { updatedText: string }) | null;
}

const TIME_ZONE = "Europe/Madrid";

const ENDGAME_MODES = [
    ["memory_of_chaos", "Memoria del Caos"],
    ["pure_fiction", "Ficción Pura"],
    ["apocalyptic_shadow", "Sombra Apocalíptica"],
] as const;

const ratio = (current: number, max: number) => `${current} / ${max}`;

function challengeRows(challenge: HsrChallenge | null): StatRow[] {
    if (!challenge?.has_data)
        return [{ icon: "CircleOff", value: "Sin datos", label: "Periodo actual" }];
    return [
        { icon: "Star", value: challenge.total_stars, label: "Estrellas" },
        { icon: "Trophy", value: challenge.max_floor || "-", label: "Mejor nivel" },
        { icon: "Swords", value: challenge.total_battles, label: "Combates" },
    ];
}

function monthName(month: number): string {
    const name = new Intl.DateTimeFormat("es-ES", { month: "long", timeZone: "UTC" }).format(
        new Date(Date.UTC(2000, month - 1, 1)),
    );
    return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Turns the HSR activity Dataset into ready-to-render groups; missing sections become null. */
export function toActivityView(activity: HsrActivity): ActivityView {
    const { simulated_universe: universe, diary, notes } = activity;

    return {
        endgame: ENDGAME_MODES.map(([key, title]) => ({
            title,
            rows: challengeRows(activity[key]),
        })),
        simulatedUniverse: universe && {
            title: "Universo Simulado",
            rows: [
                {
                    icon: "Flag",
                    value: universe.finish_cnt,
                    label: "Partidas completadas esta semana",
                },
                {
                    icon: "Sparkles",
                    value: universe.unlocked_buff_num,
                    label: "Bendiciones desbloqueadas",
                },
                {
                    icon: "Gem",
                    value: universe.unlocked_miracle_num,
                    label: "Objetos raros desbloqueados",
                },
                {
                    icon: "Zap",
                    value: universe.unlocked_skill_points,
                    label: "Puntos de habilidad",
                },
            ],
        },
        diary: diary && {
            title: `Ingresos de ${monthName(diary.month).toLowerCase()}`,
            rows: [
                { icon: "Gem", value: diary.current_hcoin, label: "Jade Estelar este mes" },
                { icon: "TicketPlus", value: diary.current_rails_pass, label: "Pases este mes" },
                {
                    icon: "CalendarClock",
                    value: diary.last_hcoin,
                    label: "Jade Estelar el mes pasado",
                },
                {
                    icon: "CalendarClock",
                    value: diary.last_rails_pass,
                    label: "Pases el mes pasado",
                },
            ],
        },
        notes: notes && {
            title: "Notas en tiempo real",
            updatedText: new Intl.DateTimeFormat("es-ES", {
                dateStyle: "long",
                timeStyle: "short",
                timeZone: TIME_ZONE,
            }).format(new Date(notes.fetched_at)),
            rows: [
                {
                    icon: "BatteryCharging",
                    value: ratio(notes.current_stamina, notes.max_stamina),
                    label: "Poder de Trazacaminos",
                },
                {
                    icon: "BatteryFull",
                    value: notes.current_reserve_stamina,
                    label: "Poder de reserva",
                },
                {
                    icon: "ListChecks",
                    value: ratio(notes.current_train_score, notes.max_train_score),
                    label: "Entrenamiento diario",
                },
                {
                    icon: "Orbit",
                    value: ratio(notes.current_rogue_score, notes.max_rogue_score),
                    label: "Puntos semanales del Universo",
                },
                {
                    icon: "Send",
                    value: ratio(notes.accepted_expedition_num, notes.total_expedition_num),
                    label: "Encargos",
                },
                {
                    icon: "Percent",
                    value: ratio(notes.remaining_weekly_discounts, notes.max_weekly_discounts),
                    label: "Descuentos de Eco de la Guerra",
                },
            ],
        },
    };
}
