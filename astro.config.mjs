import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";
import simpleStackForm from "simple-stack-form";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [tailwind(), db(), simpleStackForm()],
  vite: {
    esbuild: {
      keepNames: true,
    },
  },
});
