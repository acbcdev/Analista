import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    host_permissions: [
      "*://*.chaturbate.com/*",
      "*.stripchat.com/*",
      "*.camsoda.com/*",
    ],
    permissions: ["tabs", "scripting", "storage"],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
