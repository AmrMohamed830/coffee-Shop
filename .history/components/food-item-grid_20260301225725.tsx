"use client"

import { useEffect, useState } from "react"
import { FoodItemCard } from "@/components/food-item-card"
import { FoodItemSkeleton } from "@/components/food-item-skeleton"
import { useFoodStore } from "@/lib/foodStore"
import type { FoodItem } from "@/lib/types"

interface FoodItemGridProps {
  category?: string | null
  featured?: boolean
  limit?: number
}

export function FoodItemGrid({ category = null, featured = false, limit }: FoodItemGridProps) {
  const storeItems = useFoodStore((state) => state.items)
  const [items, setItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)

    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      let filteredItems = storeItems || []

      if (category) {
        filteredItems = filteredItems.filter((item) => item.categoryId === category)
      }

      if (featured) {
        filteredItems = filteredItems.filter((item) => item.featured)
      }

      if (limit) {
        filteredItems = filteredItems.slice(0, limit)
      }

      setItems(filteredItems)
      setLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [category, featured, limit, storeItems])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <FoodItemSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No items found</h3>
        <p className="text-muted-foreground mt-2">Try selecting a different category or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <FoodItemCard key={item.id} item={item} />
      ))}
    </div>
  )
}
