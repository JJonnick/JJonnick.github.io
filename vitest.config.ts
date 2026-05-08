import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(rootDir, "src"),
            "@assets": path.resolve(rootDir, "src/assets"),
        },
    },
    test: {
        include: ["tests/**/*.test.ts"],
    },
});
