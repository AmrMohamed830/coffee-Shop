import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { FoodItem } from "./types"

interface FoodState {
  items: FoodItem[]
  addItem: (item: FoodItem) => void
}

export const useFoodStore = create<FoodState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [item, ...state.items] })),
    }),
    {
      name: "food-storage", // name of the item in the storage (must be unique)
    }
  )
)
