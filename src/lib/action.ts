export const openDashboard = async (path = "", customUrl?: string) => {
  const baseUrl = customUrl ?? browser.runtime.getURL("/dashboard.html");
  const tabs = await browser.tabs.query({ currentWindow: true });

  // Buscar si ya existe una pestaña del dashboard abierta
  for (const tab of tabs) {
    if (tab.url?.includes(baseUrl)) {
      browser.tabs.update(tab.id ?? 0, { active: true });
      return;
    }
  }

  // Abrir nueva pestaña del dashboard
  const finalUrl = customUrl || `${baseUrl}#${path}`;
  window.open(finalUrl);
};
