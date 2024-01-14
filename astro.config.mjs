import { defineConfig } from 'astro/config';

const SERVER_PORT = 3000;
const LIVE_URL = 'https://JJonnick.github.io';
const LOCAL_URL = `http://localhost:${SERVER_PORT}`;

const SCRIPT = process.env.npm_lifecycle_script || "";
const isBuild = SCRIPT.includes("astro build");
let BASE_URL = LOCAL_URL;

if (isBuild) {
    BASE_URL = LIVE_URL;
}

// https://astro.build/config
export default defineConfig({
    server: { port: SERVER_PORT },
    site: BASE_URL,
    base: '/JJonnick.github.io',
    outDir: 'public',
    publicDir: 'static',
});
