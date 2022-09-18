import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import turbolinks from "@astrojs/turbolinks";
import partytown from "@astrojs/partytown";
import deno from "@astrojs/deno";
import { config } from "dotenv";

config();

// https://astro.build/config
export default defineConfig({
  adapter: deno({
    port: 4000,
  }),
  output: "server",
  integrations: [react(), tailwind(), turbolinks(), partytown()],
  site:
    process.env.SECRET_NODE_ENV === "production"
      ? "https://auth.astralapp.io"
      : "http://localhost:4000",
});
