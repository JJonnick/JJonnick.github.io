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
}

const ENDGAME_MODES = [
    ["memory_of_chaos", "Memoria del Caos"],
    ["pure_fiction", "Ficción Pura"],
    ["apocalyptic_shadow", "Sombra Apocalíptica"],
] as const;

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
    const { simulated_universe: universe, diary } = activity;

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
    };
}
