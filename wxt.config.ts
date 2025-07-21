import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";
// See https://wxt.dev/api/config.html
export default defineConfig({
	modules: ["@wxt-dev/module-react", "@wxt-dev/webextension-polyfill"],
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
			"*://*.sodahours.com/*",
			"*://*.cbhours.com/*",
			"*://*.striphours.com/*",
		],
		permissions: ["tabs", "scripting", "storage", "clipboardWrite", "cookies"],
	},
	vite: () => ({
		plugins: [tailwindcss()],
	}),
});
