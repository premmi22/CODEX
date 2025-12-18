import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { Item, WearEvent } from "@closetclear/shared";
import { dbRepository } from "../lib/db";

export type ClosetState = {
  items: Item[];
  wearEvents: WearEvent[];
  loading: boolean;
  error?: string;
  initialize: () => Promise<void>;
  addItem: (item: Omit<Item, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  markWorn: (itemId: string) => Promise<void>;
};

export const useClosetStore = create<ClosetState>()(
  devtools((set, get) => ({
    items: [],
    wearEvents: [],
    loading: false,
    error: undefined,
    initialize: async () => {
      set({ loading: true, error: undefined });
      try {
        const [items, wearEvents] = await Promise.all([dbRepository.listItems(), dbRepository.listWearEvents()]);
        set({ items, wearEvents, loading: false });
      } catch (error) {
        set({ loading: false, error: (error as Error).message });
      }
    },
    addItem: async (input) => {
      const now = new Date().toISOString();
      const item: Item = { ...input, id: uuidv4(), createdAt: now, updatedAt: now };
      await dbRepository.addItem(item);
      set({ items: [item, ...get().items] });
    },
    markWorn: async (itemId) => {
      const event: WearEvent = { id: uuidv4(), itemId, wornAt: new Date().toISOString() };
      await dbRepository.addWearEvent(event);
      set({ wearEvents: [event, ...get().wearEvents] });
    }
  }))
);
