import { Admin, Model } from "@/types/model";
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";
import { storage } from "@wxt-dev/storage";

type StoreModelsState = {
  models: Model[];
  isAddingModel: boolean;
  setIsAddingModel: (isAdding: boolean) => void;
  addModel: (model: Model) => void;
  removeModel: (id: string) => void;
  updateModel: (id: string, updatedModel: Partial<Model>) => void;
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
    }),
    { name: "models", storage: extensionStore }
  )
);
