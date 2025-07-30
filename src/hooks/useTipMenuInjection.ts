import { toast } from "sonner";
import type { TipMenu } from "@/store/tipMenu";
import { useStoreTipMenu } from "@/store/tipMenu";
import type { emojiPosition, textCase } from "@/types";

export function useTipMenuInjection() {
  const tipMenus = useStoreTipMenu((state) => state.tipMenus);

  const injectTipMenu = async (menuId: string) => {
    const menu = tipMenus.find((m) => m.id === menuId);
    if (!menu) {
      console.error("Menu not found");
      return;
    }

    try {
      // Get the active tab
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab.id) return;

      // Inject the script to add tip menu items
      const results = await browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectMenuItems,
        args: [menu],
      });

      // Check the result from the injected script
      if (results[0].result) {
        toast.success(
          `Tip menu "${menu.name}" injected successfully! (${menu.items.length} items)`
        );
      } else {
        toast.error(`Failed to inject tip menu "${menu.name}".`);
      }
    } catch (error) {
      console.error("Error injecting tip menu:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      toast.error(`An error occurred: ${errorMessage}`);
    }
  };

  return {
    tipMenus,
    injectTipMenu,
  };
}
type GlobalSettings = {
  textFormat: textCase;
  emoji: string;
  emojiPosition: emojiPosition;
};
// Function that will be injected into the page
async function injectMenuItems(menu: TipMenu): Promise<boolean> {
  console.log("Starting injection for menu:", menu.name);

  // Injected types (cannot import from other files)
  type TipMenuItem = {
    id: string;
    text: string;
    price: number;
    settings: {
      textFormat: textCase;
      useGlobalEmoji?: boolean;
      emoji?: string;
      emojiPosition?: emojiPosition;
    };
  };

  // Injected formatters from /src/lib/formata.ts
  const formatText = (text: string, format: textCase): string => {
    switch (format) {
      case "capitalize":
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      case "capitalizeWords":
        return text
          .split(" ")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ");
      default:
        return text;
    }
  };

  const formatMenuItem = (
    item: TipMenuItem,
    globalSettings: GlobalSettings
  ): string => {
    const textFormat =
      item.settings.textFormat === "global"
        ? globalSettings.textFormat
        : item.settings.textFormat;

    const emoji =
      item.settings.textFormat === "global"
        ? globalSettings.emoji
        : item.settings.useGlobalEmoji
        ? globalSettings.emoji
        : item.settings.emoji || "";

    const emojiPosition =
      item.settings.textFormat === "global"
        ? globalSettings.emojiPosition
        : item.settings.emojiPosition || "start";

    const formattedText = formatText(item.text, textFormat);

    if (emojiPosition === "start" && emoji) {
      return `${emoji} ${formattedText}`;
    } else if (emojiPosition === "end" && emoji) {
      return `${formattedText} ${emoji}`;
    }

    return formattedText;
  };

  // Configurable selectors for different sites
  const siteConfigs = [
    {
      name: "stripchat",
      hostMatcher: /chaturbate\.com$/,
      tipMenuSectionSelector: ".tip-menu-settings-wrapper .settings",
      addButtonSelector: "button.add-more.btn.btn-default.btn-inline-block",
      rowSelector: ".tip-menu-settings-row",
      activityInputSelector: "input.col-activity",
      priceInputSelector: "input.col-price",
    },
    // Add more site configs here
  ];

  // Determine site config based on hostname or use default
  const host = window.location.hostname;
  const config =
    siteConfigs.find((c) => c.hostMatcher.test(host)) || siteConfigs[0];
  console.log("Using site config:", config.name);
  console.log("Current host:", host);
  if (host.includes("stripchat")) {
    console.log("stripChatInject called with menu:", menu);
    return await stripChatInject(menu);
  }
  if (host.includes("chaturbate")) {
    console.log("chaturbateInject called with menu:", menu);
    return await chaturbateInject(menu);
  }
  return false;

  async function stripChatInject(menu: TipMenu) {
    const config = {
      tipMenuSectionSelector: ".tip-menu-settings-wrapper .settings",
      addButtonSelector: "button.add-more.btn.btn-default.btn-inline-block",
      rowSelector: ".tip-menu-settings-row",
      activityInputSelector: "input.col-activity",
      priceInputSelector: "input.col-price",
    };
    const tipMenuSections = Array.from(
      document.querySelectorAll(config.tipMenuSectionSelector)
    );
    if (tipMenuSections.length === 0) {
      console.error(
        `Tip menu sections not found for selector: ${config.tipMenuSectionSelector}`
      );
      return false;
    }

    const addNewRow = (tipMenuSection: Element): Promise<Element> => {
      return new Promise((resolve, reject) => {
        const wrapper = tipMenuSection.closest(".tip-menu-settings-wrapper");
        let addButton: HTMLElement | null = null;

        if (wrapper) {
          // Look inside the wrapper first
          addButton = wrapper.querySelector(
            config.addButtonSelector
          ) as HTMLElement;
          // If not found, look in the wrapper's parent
          if (!addButton) {
            const parent = wrapper.parentElement;
            if (parent) {
              addButton = parent.querySelector(
                config.addButtonSelector
              ) as HTMLElement;
            }
          }
        }

        // Fallback to searching within the section itself
        if (!addButton) {
          addButton = tipMenuSection.querySelector(
            config.addButtonSelector
          ) as HTMLElement;
        }

        // As a last resort, search the entire document.
        // This is risky if the selector is not unique, but might solve the issue.
        if (!addButton) {
          console.warn(
            "Button not found relative to section, searching whole document."
          );
          addButton = document.querySelector(
            config.addButtonSelector
          ) as HTMLElement;
        }

        if (!addButton) {
          return reject(
            new Error(
              "Add activity button not found using any search strategy."
            )
          );
        }

        const timeout = setTimeout(() => {
          observer.disconnect();
          reject(new Error("New row did not appear after 2 seconds."));
        }, 2000);

        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
              // Check if the node itself is the row, or if it contains the row
              if (node instanceof Element) {
                if (node.matches(config.rowSelector)) {
                  clearTimeout(timeout);
                  observer.disconnect();
                  return resolve(node);
                }
                const childRow = node.querySelector(config.rowSelector);
                if (childRow) {
                  clearTimeout(timeout);
                  observer.disconnect();
                  return resolve(childRow);
                }
              }
            }
          }
        });

        observer.observe(tipMenuSection, { childList: true, subtree: true });
        addButton.click();
      });
    };

    const fillRow = (
      row: Element,
      item: TipMenuItem,
      globalSettings: GlobalSettings
    ) => {
      const formattedActivity = formatMenuItem(item, globalSettings);
      const activityInput = row.querySelector(config.activityInputSelector);
      const priceInput = row.querySelector(config.priceInputSelector);
      console.log("Row inputs:", activityInput, priceInput);
      if (activityInput) {
        (activityInput as HTMLInputElement).value = formattedActivity;
        activityInput.dispatchEvent(new Event("input", { bubbles: true }));
        activityInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (priceInput) {
        (priceInput as HTMLInputElement).value = item.price.toString();
        priceInput.dispatchEvent(new Event("input", { bubbles: true }));
        priceInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };

    // Main injection logic
    try {
      for (const section of tipMenuSections) {
        const rows = Array.from(section.querySelectorAll(config.rowSelector));
        if (rows.length === 0) {
          console.warn("No existing rows in section, skipping");
          continue;
        }
        // Fill first row in this section
        fillRow(rows[0], menu.items[0], menu.globalSettings);
        // Add and fill remaining items
        for (let i = 1; i < menu.items.length; i++) {
          const item = menu.items[i];
          const newRow = await addNewRow(section);
          fillRow(newRow, item, menu.globalSettings);
        }
      }
      return true;
    } catch (err) {
      console.error("Error during injection process:", err);
      return false;
    }
  }

  async function chaturbateInject(menu: TipMenu) {
    const MAX_ITEMS = 50;
    let itemCount = 1;
    for (const item of menu.items) {
      if (itemCount === MAX_ITEMS) {
        console.warn(
          `Maximum item limit reached (${MAX_ITEMS}), stopping injection.`
        );
        break;
      }
      const price = document.querySelector<HTMLInputElement>(
        `#id_price${itemCount}`
      );
      const input = document.querySelector<HTMLInputElement>(
        `#id_item${itemCount}`
      );
      if (!price || !input) {
        console.error(
          `Input fields not found for item ${itemCount}. Ensure the page is ready.`
        );
        return false;
      }
      const formattedActivity = formatMenuItem(item, menu.globalSettings);
      input.value = formattedActivity;
      price.value = item.price.toString();
      // Perform injection for the item
      itemCount++;
    }
    return true;
  }
}
