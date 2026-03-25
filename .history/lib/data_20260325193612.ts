import type { Category, FoodItem } from "./types"

export const categories: Category[] = [
  { id: "كلاسـيك", name: "كلاسـيك" },
  { id: "جولـد", name: "جولـد" },
  { id: "اسـبريـسو", name: "اسـبريـسو" },
  { id: "أخـري", name: "أخـري" },
  { id: "مشتقات القهوة", name: "مشتقات القهوة" },
]

export function getFoodItems(): FoodItem[] {
  return []
}
