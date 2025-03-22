import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import icon from "astro-icon";

const SERVER_PORT = 4321;
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
  server: {
    port: SERVER_PORT
  },
  site: BASE_URL,
  integrations: [
    tailwind(),
    icon({
      include: {
        tabler: ["home", "users", "user", "star", "calendar", "award", "map-pins", "map", "spiral", "star-filled"],
      }
    })]
});