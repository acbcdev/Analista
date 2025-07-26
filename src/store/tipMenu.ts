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
		tipMenuItem: TipMenuItem,
	) => void;
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
						(tipMenu) => tipMenu.id === id,
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
						(tipMenu) => tipMenu.id === tipMenuId,
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
		}),
		{ name: "tipMenus", storage: extensionStore },
	),
);
