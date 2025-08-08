// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // @ts-ignore
  vite: { plugins: [tailwindcss()] },
  site: "https://arg.rileyperalta.com",
  integrations: [react(), sitemap()],
  trailingSlash: "always",
});
