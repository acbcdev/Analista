import { storage } from "@wxt-dev/storage";
import { create } from "zustand";
import { type PersistStorage, persist } from "zustand/middleware";
import type { Model } from "@/types/model";
import type { Stream } from "@/types/stream";

type StoreModelsState = {
	models: Model[];
	isAddingModel: boolean;
	setIsAddingModel: (isAdding: boolean) => void;
	addModel: (model: Model) => void;
	removeModel: (id: string) => void;
	updateModel: (id: string, updatedModel: Partial<Model>) => void;
	addStreamToModel: (modelId: string, stream: Stream) => void;
};

const extensionStore: PersistStorage<StoreModelsState> = {
	getItem: async (name) => {
		try {
			const value = await storage.getItem(`local:${name}`);
			if (!value) return null;
			// If value is a string, parse it; otherwise, assume it's already an object
			const parsed = typeof value === "string" ? JSON.parse(value) : value;
			// Ensure the parsed value has a 'state' property
			if (parsed && typeof parsed === "object" && "state" in parsed) {
				return parsed as { state: StoreModelsState; version?: number };
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

export const useModelsStore = create<StoreModelsState>()(
	persist(
		(set): StoreModelsState => ({
			models: [],
			isAddingModel: false,
			setIsAddingModel: (isAdding) => set({ isAddingModel: isAdding }),
			addModel: (model) =>
				set((state) => ({
					models: [...state.models, model],
				})),
			removeModel: (id) =>
				set((state) => ({
					models: state.models.filter((model) => model.id !== id),
				})),
			updateModel: (id, updatedModel) =>
				set((state) => {
					const index = state.models.findIndex((model) => model.id === id);
					if (index === -1) return state; // Model not found
					const modeloWith = state.models.with(index, {
						...state.models[index],
						...updatedModel,
						id: state.models[index].id, // Ensure id remains a string
					});
					return {
						models: modeloWith,
					};
				}),
			addStreamToModel: (modelId, stream) =>
				set((state) => {
					const index = state.models.findIndex((model) => model.id === modelId);
					if (index === -1) return state; // Model not found
					const updatedModel = {
						...state.models[index],
						streams: [...state.models[index].streams, stream],
						updatedAt: Date.now(),
					};
					const updatedModels = state.models.with(index, updatedModel);
					return {
						models: updatedModels,
					};
				}),
		}),
		{ name: "models", storage: extensionStore },
	),
);
