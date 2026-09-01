import { bench, describe } from "vitest";
import { getCharacters } from "@/services/database";
import {
    elementBadgeBg,
    GENSHIN_ELEMENTS,
    type GenshinElement,
    getGenshinElementIconPath,
} from "@/utils/elements";

const characters = await getCharacters();
const rawElements = characters.map((character) => character.element);
const messyElements = [...rawElements, "  PYRO ", "unknown", "", null, undefined];

describe("element helpers", () => {
    bench("resolve icon paths for the whole roster", () => {
        for (const element of rawElements) {
            getGenshinElementIconPath(element);
        }
    });

    bench("resolve icon paths for unnormalized input", () => {
        for (const element of messyElements) {
            getGenshinElementIconPath(element);
        }
    });

    bench("build badge backgrounds for every element", () => {
        for (const element of GENSHIN_ELEMENTS as readonly GenshinElement[]) {
            elementBadgeBg(element);
        }
    });
});
