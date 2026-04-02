import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://teohsinyee.github.io",
  base: "/daily-bread-library",
  trailingSlash: "always",
  integrations: [sitemap()]
});
