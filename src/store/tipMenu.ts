import { type PersistStorage, persist } from "zustand/middleware";
import { create } from "zustand/react";
import type { emojiPosition, textCase } from "@/types";

export interface TipMenuItem {
  id: string;
  text: string;
  price: number;
  settings: {
    textFormat: textCase;
    emoji?: string;
    emojiPosition?: emojiPosition;
    useGlobalEmoji?: boolean;
  };
}

export type TipMenu = {
  id: string;
  name: string;
  description: string;
  items: TipMenuItem[];
  globalSettings: {
    textFormat: textCase;
    emoji: string;
    emojiPosition: emojiPosition;
  };
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
};

type StoreTipMenuState = {
  tipMenus: TipMenu[];
  isAddingTipMenu: boolean;
  setIsAddingTipMenu: (isAdding: boolean) => void;
  addTipMenu: (tipMenu: TipMenu) => void;
  removeTipMenu: (id: string) => void;
  updateTipMenu: (id: string, updatedTipMenu: Partial<TipMenu>) => void;
  addTipMenuItemToTipMenu: (
    tipMenuId: string,
    tipMenuItem: TipMenuItem
  ) => void;
  updateTipMenuItem: (
    tipMenuId: string,
    itemId: string,
    updatedItem: TipMenuItem
  ) => void;
  onToggleTipMenu: (id: string) => void;
  removeTipMenuItem: (tipMenuId: string, itemId: string) => void;
};

const extensionStore: PersistStorage<StoreTipMenuState> = {
  getItem: async (name) => {
    try {
      const value = await storage.getItem(`local:${name}`);
      if (!value) return null;
      // If value is a string, parse it; otherwise, assume it's already an object
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      // Ensure the parsed value has a 'state' property
      if (parsed && typeof parsed === "object" && "state" in parsed) {
        return parsed as { state: StoreTipMenuState; version?: number };
      }
      return null;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    storage.setItem(`local:${name}`, value);
  },
  removeItem: (name) => {
    storage.removeItem(`local:${name}`);
  },
};

export const useStoreTipMenu = create<StoreTipMenuState>()(
  persist(
    (set): StoreTipMenuState => ({
      tipMenus: [],
      isAddingTipMenu: false,
      setIsAddingTipMenu: (isAdding) => set({ isAddingTipMenu: isAdding }),
      addTipMenu: (tipMenu) =>
        set((state) => ({
          tipMenus: [...state.tipMenus, tipMenu],
        })),
      removeTipMenu: (id) =>
        set((state) => ({
          tipMenus: state.tipMenus.filter((tipMenu) => tipMenu.id !== id),
        })),
      updateTipMenu: (id, updatedTipMenu) =>
        set((state) => {
          const index = state.tipMenus.findIndex(
            (tipMenu) => tipMenu.id === id
          );
          if (index === -1) return state; // TipMenu not found
          const tipMenuWith = state.tipMenus.with(index, {
            ...state.tipMenus[index],
            ...updatedTipMenu,
            id: state.tipMenus[index].id, // Ensure id remains a string
          });
          return {
            tipMenus: tipMenuWith,
          };
        }),
      addTipMenuItemToTipMenu: (tipMenuId, tipMenuItem) =>
        set((state) => {
          const index = state.tipMenus.findIndex(
            (tipMenu) => tipMenu.id === tipMenuId
          );
          if (index === -1) return state; // TipMenu not found
          const updatedTipMenu = {
            ...state.tipMenus[index],
            items: [...state.tipMenus[index].items, tipMenuItem],
            updatedAt: Date.now(),
          };
          const updatedTipMenus = state.tipMenus.with(index, updatedTipMenu);
          return {
            tipMenus: updatedTipMenus,
          };
        }),
      updateTipMenuItem: (tipMenuId, itemId, updatedItem) =>
        set((state) => {
          const tipMenuIndex = state.tipMenus.findIndex(
            (tipMenu) => tipMenu.id === tipMenuId
          );
          if (tipMenuIndex === -1) return state; // TipMenu not found

          const itemIndex = state.tipMenus[tipMenuIndex].items.findIndex(
            (item) => item.id === itemId
          );
          if (itemIndex === -1) return state; // Item not found

          const updatedItems = state.tipMenus[tipMenuIndex].items.with(
            itemIndex,
            updatedItem
          );
          const updatedTipMenu = {
            ...state.tipMenus[tipMenuIndex],
            items: updatedItems,
            updatedAt: Date.now(),
          };
          const updatedTipMenus = state.tipMenus.with(
            tipMenuIndex,
            updatedTipMenu
          );
          return {
            tipMenus: updatedTipMenus,
          };
        }),
      removeTipMenuItem: (tipMenuId, itemId) =>
        set((state) => {
          const tipMenuIndex = state.tipMenus.findIndex(
            (tipMenu) => tipMenu.id === tipMenuId
          );
          if (tipMenuIndex === -1) return state; // TipMenu not found

          const updatedItems = state.tipMenus[tipMenuIndex].items.filter(
            (item) => item.id !== itemId
          );
          const updatedTipMenu = {
            ...state.tipMenus[tipMenuIndex],
            items: updatedItems,
            updatedAt: Date.now(),
          };
          const updatedTipMenus = state.tipMenus.with(
            tipMenuIndex,
            updatedTipMenu
          );
          return {
            tipMenus: updatedTipMenus,
          };
        }),
      onToggleTipMenu: (id) =>
        set((state) => {
          const index = state.tipMenus.findIndex(
            (tipMenu) => tipMenu.id === id
          );
          if (index === -1) return state; // TipMenu not found
          const tipMenuWith = state.tipMenus.with(index, {
            ...state.tipMenus[index],
            isActive: !state.tipMenus[index].isActive,
            updatedAt: Date.now(),
          });
          return {
            tipMenus: tipMenuWith,
          };
        }),
    }),
    { name: "tipMenus", storage: extensionStore }
  )
);
