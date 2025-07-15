export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async () => {
    await storage.setItem("local:tags", []);
    await storage.setItem("local:selectedTag", null);
  });
});
