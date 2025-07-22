import { openDashboard } from "@/lib/action";

export default defineContentScript({
  matches: ["*://*.chaturbate.com/*"],
  main() {
    browser.runtime.onMessage.addListener((message) => {
      if (message.type === "openDashboard") {
        openDashboard();
      }
    });
  },
});
