"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { FoodItemGrid } from "@/components/food-item-grid"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { useOrderStore } from "@/lib/orderStore"
import type { FoodItem } from "@/lib/types"
import { ProductRow } from "@/components/product-row"
import { FoodItemSkeleton } from "@/components/food-item-skeleton"
import { FoodCategories } from "@/components/food-categories"

// خريطة لتحويل الكلمات من الرابط إلى قيمها الأصلية في قاعدة البيانات
const slugToValue: Record<string, string> = {
  'sada': 'سادة',
  'mohawag': 'محوج',
  'fath': 'فاتح',
  'wast': 'وسط',
  'ghameq': 'غامق (محروق)',
  'classic': 'كلاسـيك',
  'gold': 'جولـد',
  'espresso': 'اسـبريـسو',
  'special': 'سبشيال',
  'coffee-derivatives': 'مشتقات القهوة'
};

// دالة مساعدة لتحويل المنتجات إلى النوع الذي تستخدمه الكروت
const mapProductsToFoodItems = (products: any[]): FoodItem[] => {
  return products.map((product) => {
    let foodItemSizes: any[] = [];
    
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      foodItemSizes = product.sizes.map((s: any) => ({
        name: s.name,
        price: Number(s.price),
        images: s.images || [s.image || product.image || "/placeholder.svg"]
      }));
    } else if (product.sizes && typeof product.sizes === 'object' && !Array.isArray(product.sizes)) {
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
        price: Number(product.price) || 0, 
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
      blendType: (product.blendType as any) || "سادة",
      sizes: foodItemSizes
    };
  });
};

export default function MenuPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string[] || []
// تعريف الهيكل الجديد للمنيو: أقسام كبيرة (سادة/محوج) وداخلها صفوف (فاتح/وسط/غامق)
const menuStructure = [
  {
    id: 'كلاسـيك', // يجب أن يطابق الموجود في lib/data.ts
    title: 'الكلاسيك',
    groups: [
      { title: 'سادة', blendType: 'سادة', rows: ['فاتح', 'وسط', 'غامق (محروق)'] },
      { title: 'محوج', blendType: 'محوج', rows: ['فاتح', 'وسط', 'غامق (محروق)'] }
    ]
  },
  {
    id: 'جولـد',
    title: 'الجولد',
    groups: [
      { title: 'سادة', blendType: 'سادة', rows: ['فاتح', 'وسط', 'غامق (محروق)'] },
      { title: 'محوج', blendType: 'محوج', rows: ['فاتح', 'وسط', 'غامق (محروق)'] }
    ]
  },
  {
    id: 'اسـبريـسو',
    title: 'إسبريسو',
    groups: [
      { title: 'سادة', blendType: 'سادة', rows: ['فاتح', 'وسط', 'غامق (محروق)'] },
      { title: 'محوج', blendType: 'محوج', rows: ['فاتح', 'وسط', 'غامق (محروق)'] }
    ]
  },
  {
    id: 'سبشيال',
    title: 'السبشيال',
    groups: [
      { title: 'سادة', blendType: 'سادة', rows: ['فاتح', 'وسط', 'غامق (محروق)'] },
      { title: 'محوج', blendType: 'محوج', rows: ['فاتح', 'وسط', 'غامق (محروق)'] }
    ]
  },
  {
    id: 'مشتقات القهوة',
    title: 'مشتقات القهوة'
    // هذا القسم بسيط ولا يحتوي على تقسيمات فرعية مثل نوع الخلطة أو درجة التحميص
  }
];

  // نتوقع الرابط بهذا الشكل: [categoryId, blendType, roastLevel]
  const [categoryIdSlug, blendTypeSlug, roastLevelSlug] = slug
// دالة لتحويل الأسماء إلى صيغة مناسبة للروابط
const urlFriendly = (text: string) => {
  if (text === 'سادة') return 'sada';
  if (text === 'محوج') return 'mohawag';
  if (text === 'فاتح') return 'fath';
  if (text === 'وسط') return 'wast';
  if (text === 'غامق (محروق)') return 'ghameq';
  if (text === 'كلاسـيك') return 'classic';
  if (text === 'جولـد') return 'gold';
  if (text === 'اسـبريـسو') return 'espresso';
  if (text === 'سبشيال') return 'special';
  if (text === 'مشتقات القهوة') return 'coffee-derivatives';
  return text.toLowerCase();
}

  // تحويل الكلمات الإنجليزية من الرابط إلى الكلمات العربية
  const categoryName = slugToValue[categoryIdSlug] || categoryIdSlug || ""
  const blendType = slugToValue[blendTypeSlug] || blendTypeSlug || ""
  const roastLevel = slugToValue[roastLevelSlug] || roastLevelSlug || ""

  const { products, isProductsLoading } = useOrderStore();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // شريط التنقل (Breadcrumbs)
  const breadcrumbs = [
    { name: "المنيو", href: "/menu" },
    { name: categoryName.replace('ـ', ''), href: `/menu` },
    { name: `${blendType} ${roastLevel}`, href: "#" }
  ]
  useEffect(() => {
    if (products.length > 0) {
      setFoodItems(mapProductsToFoodItems(products));
    }
  }, [products]);

  if (isProductsLoading) {
    return (
      <div className="container py-8" dir="rtl">
        <h1 className="text-3xl font-bold mb-8">قائمة المنتجات</h1>
        <div className="space-y-12">{Array.from({ length: 3 }).map((_, i) => <div key={i}><FoodItemSkeleton /></div>)}</div>
      </div>
    );
  }

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
      <h1 className="text-4xl font-black mb-4 text-center">قائمتنا</h1>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">اكتشف مجموعتنا المتنوعة من أجود أنواع البن المحمص بعناية ليناسب كل الأذواق.</p>
      
      {/* استرجاع شريط التصنيفات العلوية */}
      <div className="mb-12 sticky top-[4rem] z-40 bg-background/95 backdrop-blur py-4 border-b border-dashed border-gray-200 dark:border-gray-800">
        <FoodCategories 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
      </div>
      
      {slug.length > 0 && <h1 className="text-3xl font-bold mb-8 text-primary">
        {`${categoryName.replace('ـ', '')} - ${blendType} ${roastLevel.replace(' (محروق)', '')}`}
      </h1>}
      <div className="space-y-12">
        {menuStructure
          .filter(cat => selectedCategory === null || cat.id === selectedCategory)
          .map(category => {
          const categoryItems = foodItems.filter(item => item.categoryId === category.id);
          if (categoryItems.length === 0) return null;

          // استدعاء شبكة المنتجات مع تمرير الفلاتر الصحيحة
          // <FoodItemGrid 
          //   category={categoryName} 
          //   blendType={blendType}
          //   roastLevel={roastLevel}
          // />
          return (
            <section key={category.id} className="pt-4">
              <div className="bg-primary/10 rounded-2xl p-4 text-center mb-8 border-2 border-primary/20 shadow-sm">
                <h2 className="text-3xl font-extrabold text-primary">{category.title}</h2>
              </div>

              {/* التحقق إذا كان القسم يحتوي على تقسيمات فرعية (groups) أم لا */}
              {category.groups ? (
                <div className="grid grid-cols-1 gap-12 px-2 lg:px-6">
                  {category.groups.map(group => {
                    const groupItems = categoryItems.filter(item => item.blendType === group.blendType);
                    if (groupItems.length === 0) return null;

                    return (
                      <div key={group.title} className="bg-gray-50/50 dark:bg-gray-900/20 rounded-3xl p-4 md:p-8 border border-gray-100 dark:border-gray-800">
                        <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-gray-800 dark:text-gray-100 border-b-2 border-dashed border-gray-200 dark:border-gray-700 pb-4">
                          <span className="w-3 h-8 bg-primary rounded-full inline-block"></span>
                          {group.title}
                        </h3>
                        
                        <div className="space-y-2">
                          {group.rows.map(roastLevel => {
                            const rowItems = groupItems.filter(item => item.roastLevel === roastLevel);
                            if (rowItems.length === 0) return null;

                            const viewAllLink = `/menu/${urlFriendly(category.id)}/${urlFriendly(group.blendType)}/${urlFriendly(roastLevel)}`;
                            const displayTitle = roastLevel === 'غامق (محروق)' ? 'غامق' : roastLevel;

                            return <ProductRow key={roastLevel} title={displayTitle} items={rowItems} viewAllLink={viewAllLink} />;
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // عرض المنتجات مباشرة للأقسام البسيطة التي لا تحتوي على groups
                <div className="px-2 lg:px-6">
                  <div className="bg-gray-50/50 dark:bg-gray-900/20 rounded-3xl p-4 md:p-8 border border-gray-100 dark:border-gray-800">
                    <ProductRow title="منتجات متنوعة" items={categoryItems} viewAllLink={`/menu/${urlFriendly(category.id)}`} />
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}