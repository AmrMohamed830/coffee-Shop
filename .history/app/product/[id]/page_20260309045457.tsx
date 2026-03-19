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
import { db } from "@/config/firebase"
import { collection, getDocs } from "firebase/firestore"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<FoodItem | null>(null)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [loading, setLoading] = useState(true)
  const { products, initListener } = useOrderStore() // تغيير: جلب المنتجات من المخزن الصحيح
  // @ts-ignore - التعامل مع اختلاف تسمية الدالة في الستور
  const cartStore = useCartStore()
  // @ts-ignore
  const addFunction = cartStore.addToCart
  // @ts-ignore
  const { toast } = useToast() || { toast: console.log }

  useEffect(() => {
    initListener()
  }, [initListener])

  // اختبار اتصال قاعدة البيانات (يمكنك حذفه بعد التأكد)
  useEffect(() => {
    const testConnection = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"))
        console.log("✅ اتصال Firestore ناجح! عدد المستندات:", querySnapshot.size)
      } catch (error) {
        console.error("❌ فشل الاتصال بـ Firestore:", error)
      }
    }
    testConnection()
  }, [])

  useEffect(() => {
    setLoading(true)
    // @ts-ignore - The product from the store now has a more complex shape
    const product = products.find((p) => p.id === params.id)
    
    if (product) {
      let foodItem: FoodItem

      // Check if the product has the new detailed 'sizes' object structure
      // @ts-ignore
      if (product.sizes && typeof product.sizes === 'object') {
        // تحديد الترتيب المفضل للأحجام
        const sizeOrder = ["50g", "100g", "250g"];
        const foodItemSizes: Size[] = [];

        // تحويل الأحجام إلى مصفوفة سواء كانت Object أو Array
        const sizesSource = Array.isArray(product.sizes) ? product.sizes : product.sizes;

        if (Array.isArray(sizesSource)) {
             // إذا كانت مصفوفة بالفعل (البيانات القديمة أو المهيئة)
             sizesSource.forEach((s: any) => {
                if (s.name && s.price) {
                    foodItemSizes.push({
                        name: s.name,
                        price: Number(s.price),
                        images: s.images || [product.image || "/placeholder.svg"]
                    })
                }
             })
        } else {
            // إذا كانت كائن (Object) كما في التحديث الجديد
        // محاولة جلب الأحجام بالترتيب المحدد
        sizeOrder.forEach(key => {
            // @ts-ignore
                const sizeDetails = sizesSource[key];
            // عرض الحجم فقط إذا كان له سعر محدد (أكبر من 0)
            if (sizeDetails && Number(sizeDetails.price) > 0) {
                foodItemSizes.push({
                    name: key as Size["name"],
                    price: Number(sizeDetails.price),
                    images: [sizeDetails.image || "/placeholder.svg"],
                });
            }
        });

        // في حالة عدم العثور على الأحجام القياسية، نجلب أي أحجام أخرى موجودة
        // نقوم بإضافة الأحجام الأخرى التي لم تكن في القائمة المرتبة
            Object.entries(sizesSource).forEach(([key, val]: [string, any]) => {
            // نتأكد أن الحجم لم تتم إضافته مسبقاً وأن له سعراً
            const alreadyAdded = foodItemSizes.some(s => s.name === key);
            if (!alreadyAdded && val && Number(val.price) > 0) {
                foodItemSizes.push({
                    name: key as Size["name"],
                    price: Number(val.price),
                    images: [val.image || "/placeholder.svg"]
                })
            }
        })
        }

        // إذا فشل استخراج أي أحجام، نضع حجم افتراضي
        if (foodItemSizes.length === 0) {
             foodItemSizes.push({ 
                name: "100g", 
                price: Number(product.price), 
                images: [product.image || "/placeholder.svg"] 
            });
        }

        foodItem = {
          id: product.id,
          name: product.name,
          // @ts-ignore
          description: product.description || product.category,
          // @ts-ignore
          categoryId: product.categoryId || product.category,
          featured: false,
          // @ts-ignore
          roastLevel: product.roastLevel || "وسط",
          sizes: foodItemSizes,
        };
      } else {
        // Fallback for old/simple product structure
        foodItem = {
          id: product.id,
          name: product.name,
          description: product.category,
          categoryId: product.category,
          featured: false,
          roastLevel: "وسط",
          sizes: [{ name: "100g", price: product.price, images: [product.image || "/placeholder.svg"] }],
        };
      }
      
      setItem(foodItem)
      // تعيين الحجم الافتراضي مع الحفاظ على اختيار المستخدم وتحديث بياناته إذا لزم الأمر
      setSelectedSize((prev) => {
        // إذا كان هناك حجم مختار سابقاً وموجود في البيانات الجديدة، نحتفظ به
        const currentSelection = prev ? foodItem.sizes.find((s) => s.name === prev.name) : null;
        // إذا لم يكن، نختار 100g، وإذا لم يوجد نختار أول حجم متاح
        return currentSelection || foodItem.sizes.find((s) => s.name === "100g") || foodItem.sizes[0] || null;
      })
    }
    setLoading(false)
  }, [params.id, products])

  const handleAddToCart = () => {
    if (item && selectedSize) {
      // The cart expects a 'size' property on the top-level item
      addFunction({
        ...item,
        id: item.id, // Ensure ID is passed explicitly
        price: selectedSize.price, // تأكيد إرسال سعر الحجم المختار بدقة
        image: selectedSize.images[0] || "/placeholder.svg", // حماية ضد الصور المفقودة
        quantity: 1,
        size: selectedSize.name,
      })
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
  
  const rawImage = selectedSize?.images[0] || item.sizes[0]?.images[0] || "/placeholder.svg";
  const displayImage = formatImagePath(rawImage);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen" dir="rtl">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <div className="relative aspect-square w-full rounded-xl overflow-hidden border shadow-sm bg-white">
            <Image
              src={displayImage}
              alt={item.name}
              fill
              className="object-cover transition-all duration-500 ease-in-out"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-primary mb-2">{item.name}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">{item.description}</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-lg font-bold">اختر الحجم (الوزن)</h2>
            <RadioGroup
              value={selectedSize?.name}
              onValueChange={(value) => {
                const newSize = item.sizes.find((s) => s.name === value)
                if (newSize) setSelectedSize(newSize)
              }}
              className="grid grid-cols-1 gap-3"
            >
              {item.sizes.map((size) => (
                <Label
                  key={size.name}
                  htmlFor={size.name}
                  className={`flex items-center justify-between w-full p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-secondary/10 ${
                    selectedSize?.name === size.name
                      ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                      : "border-transparent bg-secondary/20 hover:bg-secondary/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={size.name} id={size.name} className="text-primary" />
                    <span className="font-bold text-lg">{size.name}</span>
                  </div>
                  <span className="text-xl font-black text-primary">{formatCurrency(size.price)}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
          
          <Separator />

          {item.roastLevel && (
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">درجة التحميص:</h2>
              <span className="px-3 py-1 bg-secondary/20 rounded-full text-primary font-medium">{item.roastLevel}</span>
            </div>
          )}

          <div className="pt-4 mt-auto">
            <Button onClick={handleAddToCart} size="lg" className="w-full text-lg font-bold py-6 rounded-xl shadow-lg hover:scale-[1.02] transition-transform">
              إضافة للسلة - {selectedSize ? formatCurrency(selectedSize.price) : ''}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
