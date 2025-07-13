import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    key: "cnifdnnmkllcmcgkggfalobodlhbkdab",
    author: {
      email: "acbc.dev@gmail.com",
    },

    name: "Analista",
    host_permissions: [
      "*://*.chaturbate.com/*",
      "*://*.stripchat.com/*",
      "*://*.camsoda.com/*",
      "*://*.acbc.dev/*",
    ],
    permissions: ["tabs", "scripting", "storage", "clipboardWrite", "cookies"],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
