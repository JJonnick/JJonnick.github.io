/**
 * Validates the Datasets in `public/data` (or the folder given as the first argument) against the
 * site's schemas. genshinStats runs it before pushing a data sync, so a broken export never lands.
 */
import path from "node:path";
import { validateDatasets } from "../src/services/dataset-loader.ts";

const dataRoot = path.resolve(process.argv[2] ?? path.join("public", "data"));
const errors = validateDatasets(dataRoot);

if (errors.length > 0) {
    for (const message of errors) console.error(message);
    process.exit(1);
}
console.log(`Datasets válidos en ${dataRoot}`);
