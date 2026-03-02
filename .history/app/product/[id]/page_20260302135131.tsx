"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/store"
import { useOrderStore } from "@/lib/orderStore"
import { formatCurrency, formatImagePath } from "@/lib/utils"
// @ts-ignore
import { useToast } from "@/components/ui/use-toast"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  // @ts-ignore
  const { toast } = useToast() || { toast: console.log }
  
  // استخدام useOrderStore بدلاً من useFoodStore لأن المنتجات موجودة هناك
  const { products } = useOrderStore()
  
  // @ts-ignore - التعامل مع اختلاف تسمية الدالة في الستور
  const cartStore = useCartStore()
  // @ts-ignore
  const addToCartFn = cartStore.addItem || cartStore.addToCart

  const [quantity, setQuantity] = useState(1)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const id = params.id as string
  // البحث عن المنتج في قائمة المنتجات القادمة من الأدمن
  const product = products.find((p) => p.id === id)

  if (!isMounted) return null

  if (!product) {
    return (
      <div className="container flex flex-col items-center justify-center py-20 text-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
        <p className="text-muted-foreground mb-6">عذراً، لم نتمكن من العثور على المنتج الذي تبحث عنه.</p>
        <Button onClick={() => router.push('/')}>العودة للرئيسية</Button>
      </div>
    )
  }

  // تجهيز البيانات للعرض
  const imagePath = formatImagePath(product.image)
  const description = product.category || "وصف المنتج غير متوفر"

  const handleAddToCart = () => {
    if (addToCartFn) {
      addToCartFn({
        id: product.id,
        name: product.name,
        description: description,
        price: product.price,
        image: product.image,
        size: "100g", // حجم افتراضي
        quantity: quantity,
        sizes: [{ name: "100g", price: product.price, images: [product.image] }]
      })
      
      if (toast) {
        toast({
          title: "تمت الإضافة للسلة",
          description: `تم إضافة ${product.name} إلى سلتك`,
        })
      }
    } else {
      console.error("Add to cart function not found in store")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.back()}>
        <ArrowRight className="h-4 w-4" /> العودة
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* قسم الصورة */}
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
          <Image 
            src={imagePath} 
            alt={product.name} 
            fill 
            className="object-cover hover:scale-105 transition-transform duration-500"
            priority
          />
        </div>

        {/* قسم التفاصيل */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black mt-4 mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed text-lg">
            {description}
          </p>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-700 space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-bold text-lg">الكمية:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1 gap-2 text-lg py-6 font-bold" onClick={handleAddToCart}>
                <ShoppingCart className="h-6 w-6" />
                إضافة للسلة - {formatCurrency(product.price * quantity)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
