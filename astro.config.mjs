import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

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
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Quicksand",
      cssVariable: "--font-quicksand",
      weights: ["300 700"],
      styles: ["normal"],
    },
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
