import { onMessage } from "webext-bridge/content-script";

export default defineContentScript({
  matches: ["*://*.chaturbate.com/*"],
  main() {
    onMessage("open-dashboard", () => {});
  },
});
