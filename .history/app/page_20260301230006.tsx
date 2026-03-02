import { FoodCategories } from "@/components/food-categories"
import { FoodItemGrid } from "@/components/food-item-grid"
import { PromoBanner } from "@/components/promo-banner"


export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-6 space-y-8">
      <PromoBanner />
      
      <section>
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <FoodCategories />
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Products</h2>
        {/* إزالة الفلتر featured={true} لعرض كل المنتجات الجديدة المضافة */}
        <FoodItemGrid />
      </section>

    </main>
  )
}