"use client"
import { useEffect } from "react"
import { PromoBanner } from "@/components/promo-banner"
import { useOrderStore } from "@/lib/orderStore"
import { useAdminStore } from "@/lib/adminStore"
import { FoodItemCard } from "@/components/food-item-card"
import type { FoodItem, Size } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export default function HomePage() {
  const { products, initListener } = useOrderStore()
  const { listenToPromoBanner } = useAdminStore()

  // تشغيل الاستماع لـ Firestore عند فتح الصفحة
  useEffect(() => {
    initListener()
    const unsubscribeBanner = listenToPromoBanner()
    return () => {
      unsubscribeBanner()
    }
  }, [initListener, listenToPromoBanner])

  return (
    <main className="container mx-auto px-4 py-6 space-y-8">
      <PromoBanner />
      
      <section>
        <h2 className="text-2xl font-bold mb-4">أحدث المنتجات</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              // تحويل بيانات المنتج من Firestore لتناسب شكل الكارت
              let foodItemSizes: Size[] = [];

              // التعامل مع الـ sizes سواء كان object أو array
              if (product.sizes && typeof product.sizes === 'object' && !Array.isArray(product.sizes)) {
                // الـ sizes عبارة عن object مثل { "50g": { price, image }, ... }
                const sizeOrder: Array<Size["name"]> = ["50g", "100g", "250g"];
                sizeOrder.forEach(key => {
                  const sizeData = (product.sizes as Record<string, { price: number; image: string }>)?.[key];
                  if (sizeData && Number(sizeData.price) > 0) {
                    foodItemSizes.push({
                      name: key,
                      price: Number(sizeData.price),
                      images: [sizeData.image || "/placeholder.svg"],
                    });
                  }
                });
              }

              // لو مفيش أحجام، نستخدم السعر والصورة الافتراضية
              if (foodItemSizes.length === 0) {
                foodItemSizes = [{ 
                  name: "100g", 
                  price: product.price, 
                  images: [product.image || "/placeholder.svg"] 
                }];
              }

              const foodItem: FoodItem = {
                id: product.id,
                name: product.name,
                description: product.description || product.category,
                categoryId: product.categoryId || product.category || 'coffee',
                featured: false,
                roastLevel: (product.roastLevel as FoodItem["roastLevel"]) || "وسط",
                sizes: foodItemSizes
              }
              return (
                <div key={product.id} className="h-full">
                  <FoodItemCard item={foodItem} />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">لا توجد منتجات متاحة حالياً.</p>
          </div>
        )}
      </section>

      {/* سكشن التواصل أسفل الصفحة الرئيسية */}
      <section className="py-12 flex flex-col items-center justify-center text-center bg-orange-50/50 rounded-2xl border border-orange-100 mt-12" dir="rtl">
        <h2 className="text-2xl font-bold text-[#b8682b] mb-4">عندك استفسار أو طلب خاص؟</h2>
        <p className="text-muted-foreground mb-6 max-w-md">إحنا دايماً هنا عشان نسمعك ونظبطلك مزاجك، تواصل معانا في أي وقت.</p>
        <Button asChild size="lg" className="bg-[#b8682b] hover:bg-[#904a17] text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg transition-transform hover:scale-105 border-none">
          <Link href="/contact" className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            تواصل معنا
          </Link>
        </Button>
      </section>

    </main>
  )
}