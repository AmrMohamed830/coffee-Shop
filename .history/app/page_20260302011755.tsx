"use client"
import { FoodCategories } from "@/components/food-categories"
import { PromoBanner } from "@/components/promo-banner"
import { useOrderStore } from "@/lib/orderStore"
import { FoodItemCard } from "@/components/food-item-card"
import type { FoodItem } from "@/lib/types"

export default function HomePage() {
  const { products } = useOrderStore()

  return (
    <main className="container mx-auto px-4 py-6 space-y-8">
      <PromoBanner />
      
      <section>
        <h2 className="text-2xl font-bold mb-4">التصنيفات</h2>
        <FoodCategories />
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">أحدث المنتجات</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            // تحويل بيانات المنتج البسيطة لتناسب شكل الكارت
            const foodItem: FoodItem = {
              id: product.id,
              name: product.name,
              description: product.category,
              categoryId: 'coffee',
              featured: false,
              roastLevel: "وسط",
              sizes: [{ name: "100g", price: product.price, images: [product.image] }]
            }
            return (
              <div key={product.id} className="h-full">
                <FoodItemCard item={foodItem} />
              </div>
            )
          })}
        </div>
      </section>

    </main>
  )
}