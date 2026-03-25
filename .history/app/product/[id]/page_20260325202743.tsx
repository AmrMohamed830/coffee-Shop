"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useOrderStore } from "@/lib/orderStore"
import { useCartStore } from "@/lib/store"
import { formatCurrency, formatImagePath } from "@/lib/utils"
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  
  // جلب المنتجات من الـ Store الجديد
  const { products, isProductsLoading } = useOrderStore()
  const { addItem } = useCartStore()
  
  const [product, setProduct] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!isProductsLoading && products.length > 0) {
      // البحث عن المنتج برقم الـ ID
      const foundProduct = products.find((p) => p.id === params.id)
      
      if (foundProduct) {
        // تهيئة الأوزان بنفس الطريقة التي استخدمناها في الشبكة
        let foodItemSizes: any[] = [];
        
        if (Array.isArray(foundProduct.sizes) && foundProduct.sizes.length > 0) {
          foodItemSizes = foundProduct.sizes.map((s: any) => ({
            name: s.name,
            price: Number(s.price),
            images: s.images || [s.image || foundProduct.image || "/placeholder.svg"]
          }));
        } else if (foundProduct.sizes && typeof foundProduct.sizes === 'object' && !Array.isArray(foundProduct.sizes)) {
          const sizeOrder: any[] = ["50g", "100g", "250g"];
          sizeOrder.forEach(key => {
            const sizeData = (foundProduct.sizes as any)?.[key];
            if (sizeData && Number(sizeData.price) > 0) {
              foodItemSizes.push({
                name: key,
                price: Number(sizeData.price),
                images: [sizeData.image || foundProduct.image || "/placeholder.svg"],
              });
            }
          });
        }

        if (foodItemSizes.length === 0) {
          foodItemSizes = [{ 
            name: "حجم افتراضي", 
            price: Number(foundProduct.price) || 0, 
            images: [foundProduct.image || "/placeholder.svg"] 
          }];
        }

        const formattedProduct = {
          ...foundProduct,
          sizes: foodItemSizes
        };

        setProduct(formattedProduct)
        setSelectedSize(foodItemSizes[0]) // اختيار أول حجم كافتراضي
      }
    }
  }, [params.id, products, isProductsLoading])

  if (isProductsLoading) {
    return (
      <div className="container py-20 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">المنتج غير موجود أو غير متاح</h2>
        <Button onClick={() => router.push('/menu')}>العودة للمنيو</Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: selectedSize.price,
      size: selectedSize.name,
      quantity: quantity,
      image: selectedSize.images[0] || product.image,
      description: product.description
    });
    
    alert("تمت الإضافة إلى السلة بنجاح!");
  }

  return (
    <div className="container py-8 md:py-12" dir="rtl">
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors"
      >
        <ChevronRight className="w-5 h-5 ml-1" />
        العودة
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* صورة المنتج */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
          <Image
            src={formatImagePath(selectedSize?.images[0] || product.image || "/placeholder.svg")}
            alt={product.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        {/* تفاصيل المنتج */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-black mb-2">{product.name}</h1>
          <p className="text-xl font-bold text-primary mb-6">{formatCurrency(selectedSize?.price || 0)}</p>
          
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {product.description || "لا يوجد وصف متاح لهذا المنتج."}
          </p>

          {/* اختيار الحجم/الوزن */}
          <div className="mb-8">
            <h3 className="font-bold mb-3">اختر الوزن:</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size: any) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2 rounded-xl border-2 font-bold transition-all ${
                    selectedSize?.name === size.name 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-gray-200 dark:border-gray-800 hover:border-primary/50"
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* اختيار الكمية والإضافة للسلة */}
          <div className="flex items-center gap-4 mt-auto">
            <div className="flex items-center border-2 border-gray-200 dark:border-gray-800 rounded-xl p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <Button 
              onClick={handleAddToCart}
              size="lg" 
              className="flex-1 h-14 text-lg font-bold rounded-xl gap-2 shadow-lg hover:scale-[1.02] transition-transform"
            >
              <ShoppingCart className="w-5 h-5" />
              إضافة للسلة
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}