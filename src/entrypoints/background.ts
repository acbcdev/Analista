export default defineBackground(() => {
	browser.runtime.onInstalled.addListener(async () => {
		await storage.setItem("local:tags", []);
		await storage.setItem("local:selectedTag", null);
		await storage.setItem("local:hours", {});
		browser.contextMenus.create({
			id: "open-dashboard",
			title: "Open Dashboard",
			contexts: ["all"],
		});
	});
	browser.contextMenus.onClicked.addListener(async (info) => {
		if (info.menuItemId === "open-dashboard") {
			const url = browser.runtime.getURL("/dashboard.html");
			browser.tabs.create({ url });
		}
	});
});
