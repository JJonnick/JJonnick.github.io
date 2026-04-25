import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://jjonnick.github.io',
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Quicksand",
      cssVariable: "--font-quicksand",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
    },
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
