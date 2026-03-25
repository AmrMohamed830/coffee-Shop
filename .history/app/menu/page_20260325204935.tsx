"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { FoodItemGrid } from "@/components/food-item-grid"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// خريطة لتحويل الكلمات من الرابط إلى قيمها الأصلية
const slugToValue: Record<string, string> = {
  'sada': 'سادة',
  'mohawag': 'محوج',
  'fath': 'فاتح',
  'wast': 'وسط',
  'ghameq': 'غامق (محروق)',
  'classic': 'الكلاسيك',
  'gold': 'الجولد',
  'special': 'السبشيال'
};

export default function SubCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string[] || []

  // نتوقع الرابط بهذا الشكل: [categoryId, blendType, roastLevel]
  const [categoryId, blendTypeSlug, roastLevelSlug] = slug

  // تحويل الكلمات من الرابط إلى أسماء للعرض وقيم للفلترة
  const categoryName = slugToValue[categoryId] || categoryId
  const blendType = slugToValue[blendTypeSlug] || blendTypeSlug
  const roastLevel = slugToValue[roastLevelSlug] || roastLevelSlug

  // شريط التنقل (Breadcrumbs)
  const breadcrumbs = [
    { name: "المنيو", href: "/menu" },
    { name: categoryName, href: `/menu` },
    { name: `${blendType} ${roastLevel}`, href: "#" }
  ]

  return (
    <div className="container py-8" dir="rtl">
      <div className="flex items-center mb-8 text-sm text-muted-foreground">
        <button onClick={() => router.back()} className="flex items-center hover:text-primary transition-colors">
          <ChevronRight className="w-4 h-4 ml-1" />
          <span>العودة</span>
        </button>
        <span className="mx-2">/</span>
        <div className="flex items-center space-x-2 space-x-reverse">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.name}>
              {index > 0 && <ChevronLeft className="w-4 h-4 text-gray-400" />}
              <a href={crumb.href} className={`font-medium ${index === breadcrumbs.length - 1 ? 'text-primary' : 'hover:text-primary'}`}>
                {crumb.name}
              </a>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">
        {`جميع منتجات: ${categoryName} - ${blendType} ${roastLevel}`}
      </h1>

      <FoodItemGrid 
        category={categoryId} 
        blendType={blendType}
        roastLevel={roastLevel}
      />
    </div>
  )
}