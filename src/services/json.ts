import json from "../../DATA.json";
import { type Stats } from "@/types";

export const getStats = (): Stats => {
    const { accounts, stats } = json;

    return {
        ...accounts[0],
        ...stats
    }
}
