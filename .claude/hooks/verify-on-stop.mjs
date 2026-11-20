// Stop hook: block "done" while tests or lint fail and the working tree has changes.
import { execSync, spawnSync } from "node:child_process";

let input = {};
try {
    input = JSON.parse(await new Promise((r) => {
        let d = "";
        process.stdin.on("data", (c) => (d += c));
        process.stdin.on("end", () => r(d || "{}"));
    }));
} catch {}

// Avoid loops: if we already blocked once this turn, let it stop.
if (input.stop_hook_active) process.exit(0);

const dirty = execSync("git status --porcelain", { encoding: "utf8" }).trim();
if (!dirty) process.exit(0);

for (const cmd of ["test", "lint"]) {
    const r = spawnSync(`pnpm ${cmd}`, { encoding: "utf8", shell: true });
    if (r.status !== 0) {
        const out = `${r.stdout}\n${r.stderr}`.split("\n").slice(-40).join("\n");
        console.error(`pnpm ${cmd} failed. Fix it before finishing:\n${out}`);
        process.exit(2);
    }
}
