"use client"

import { useEffect, useState } from "react"
import { FoodItemCard } from "@/components/food-item-card"
import { FoodItemSkeleton } from "@/components/food-item-skeleton"
import { useOrderStore } from "@/lib/orderStore"
import type { FoodItem } from "@/lib/types"

interface FoodItemGridProps {
  category?: string | null
  featured?: boolean
  limit?: number
}

export function FoodItemGrid({ category = null, featured = false, limit }: FoodItemGridProps) {
  const { products, isProductsLoading } = useOrderStore()
  const [items, setItems] = useState<FoodItem[]>([])

  useEffect(() => {
    // تحويل المنتجات من المخزن الجديد (orderStore) إلى الشكل الذي يتوقعه الكارت (FoodItem)
    let filteredItems: FoodItem[] = products.map((product) => {
      let foodItemSizes: any[] = [];
      
      if (product.sizes && typeof product.sizes === 'object' && !Array.isArray(product.sizes)) {
        const sizeOrder: any[] = ["50g", "100g", "250g"];
        sizeOrder.forEach(key => {
          const sizeData = (product.sizes as Record<string, { price: number; image: string }>)?.[key];
          if (sizeData && Number(sizeData.price) > 0) {
            foodItemSizes.push({
              name: key,
              price: Number(sizeData.price),
              images: [sizeData.image || product.image || "/placeholder.svg"],
            });
          }
        });
      }

      if (foodItemSizes.length === 0) {
        foodItemSizes = [{ 
          name: "100g", 
          price: product.price, 
          images: [product.image || "/placeholder.svg"] 
        }];
      }

      return {
        id: product.id,
        name: product.name,
        description: product.description || product.category,
        categoryId: product.categoryId || product.category,
        featured: false,
        roastLevel: (product.roastLevel as any) || "وسط",
        sizes: foodItemSizes
      };
    });

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
  }, [category, featured, limit, products])

  if (isProductsLoading) {
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
