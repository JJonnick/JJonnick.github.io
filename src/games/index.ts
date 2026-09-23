import { findGameForPath, type Game } from "@/games/game";
import { genshin } from "@/games/genshin";
import { hsr } from "@/games/hsr";

export type { ElementVisual, Game, GameId } from "@/games/game";
export { isInCharacterSection } from "@/games/game";
export { genshin, hsr };

export const GAMES: readonly Game[] = [genshin, hsr];

export function getGameForPath(pathname: string): Game {
    return findGameForPath(GAMES, pathname) ?? genshin;
}
