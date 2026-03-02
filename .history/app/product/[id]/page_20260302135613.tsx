"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useOrderStore } from "@/lib/orderStore" // تغيير: استخدام مخزن المنتجات الجديد
import { useCartStore } from "@/lib/store"
import type { FoodItem, Size } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
// @ts-ignore - للتعامل مع مسار الاستيراد المختلف
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency, formatImagePath } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<FoodItem | null>(null)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [loading, setLoading] = useState(true)
  const { products } = useOrderStore() // تغيير: جلب المنتجات من المخزن الصحيح
  // @ts-ignore - التعامل مع اختلاف تسمية الدالة في الستور
  const cartStore = useCartStore()
  // @ts-ignore
  const addFunction = cartStore.addItem || cartStore.addToCart
  // @ts-ignore
  const { toast } = useToast() || { toast: console.log }

  useEffect(() => {
    setLoading(true)
    const product = products.find((p) => p.id === params.id)
    
    if (product) {
      // تحويل المنتج البسيط إلى هيكل FoodItem الذي تتوقعه الصفحة
      const foodItem: FoodItem = {
        id: product.id,
        name: product.name,
        description: product.category, // الوصف هو التصنيف حالياً
        categoryId: product.category,
        featured: false, // قيمة افتراضية
        roastLevel: "وسط", // قيمة افتراضية
        // إنشاء حجم واحد بناءً على بيانات المنتج المبسطة
        sizes: [{ name: "100g", price: product.price, images: [product.image] }]
      }
      setItem(foodItem)
      // تحديد الحجم الافتراضي (وهو الوحيد المتاح)
      if (foodItem.sizes.length > 0) {
        setSelectedSize(foodItem.sizes[0])
      }
    }
    setLoading(false)
  }, [params.id, products])

  const handleAddToCart = () => {
    if (item && selectedSize && addFunction) {
      // The cart expects a 'size' property on the top-level item
      addFunction({ ...item, quantity: 1, size: selectedSize.name })
      if (toast) {
        toast({
          title: "تمت الإضافة للسلة",
          description: `تمت إضافة ${item.name} (${selectedSize.name}) إلى سلتك.`,
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading product...</p>
      </div>
    )
  }

  if (!item) {
    // If you have a custom 404 page, Next.js will render it
    notFound()
    return null // notFound() doesn't abort rendering, so we must return null
  }
  
  const rawImage = selectedSize?.images[0] || item.sizes[0]?.images[0];
  const displayImage = formatImagePath(rawImage);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={displayImage}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* You could add thumbnails for more images here if needed */}
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{item.name}</h1>
            <p className="text-muted-foreground mt-2">{item.description}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Size</h2>
            <RadioGroup
              value={selectedSize?.name}
              onValueChange={(value) => {
                const newSize = item.sizes.find((s) => s.name === value)
                if (newSize) setSelectedSize(newSize)
              }}
              className="flex flex-col gap-2"
            >
              {item.sizes.map((size) => (
                <Label
                  key={size.name}
                  htmlFor={size.name}
                  className={`flex items-center justify-between p-4 rounded-md border cursor-pointer transition-colors ${
                    selectedSize?.name === size.name
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <span className="font-medium">{size.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">{formatCurrency(size.price)}</span>
                    <RadioGroupItem value={size.name} id={size.name} />
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>
          
          <Separator />

          {item.roastLevel && (
            <div>
              <h2 className="text-lg font-semibold">درجة التحميص</h2>
              <p>{item.roastLevel}</p>
            </div>
          )}

          <Button onClick={handleAddToCart} size="lg" className="w-full">
            إضافة للسلة
          </Button>
        </div>
      </div>
    </div>
  )
}
