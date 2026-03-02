"use client"
import React, { useState } from "react"
import { useFoodStore } from "@/lib/foodStore"
import type { FoodItem, Size } from "@/lib/types"

// Helper to generate a unique ID
const generateId = () => `food_${new Date().getTime()}`

export function AddProductForm() {
  const [isOpen, setIsOpen] = useState(false)
  const addItem = useFoodStore((state) => state.addItem)

  // الحالة الأولية للمنتج - تم تعديلها لتشمل صورة واحدة فقط لكل حجم
  const initialProductState = {
    name: "",
    description: "",
    roastLevel: "وسط" as FoodItem["roastLevel"],
    sizes: {
      "50g": { price: 0, image: "" },
      "100g": { price: 0, image: "" },
      "250g": { price: 0, image: "" },
    },
  }

  const [newProduct, setNewProduct] = useState(initialProductState)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewProduct(prev => ({ ...prev, [name]: value }))
  }

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>, size: keyof typeof initialProductState.sizes) => {
    const { name, value } = e.target
    setNewProduct(prev => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: { ...prev.sizes[size], [name]: name === 'price' ? parseFloat(value) : value },
      },
    }))
  }

  // دالة التعامل مع تغيير الصورة (حقل واحد فقط الآن)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, size: keyof typeof initialProductState.sizes) => {
    const { value } = e.target
    setNewProduct(prev => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: { ...prev.sizes[size], image: value },
      },
    }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const finalProduct: FoodItem = {
      id: generateId(),
      name: newProduct.name,
      description: newProduct.description,
      roastLevel: newProduct.roastLevel,
      featured: false, // Default value
      categoryId: 'coffee', // Default value
      sizes: (Object.keys(newProduct.sizes) as Array<keyof typeof newProduct.sizes>).map(sizeName => ({
        name: sizeName,
        price: newProduct.sizes[sizeName].price,
        // نقوم بوضع الصورة في مصفوفة لأن نوع البيانات FoodItem يتوقع مصفوفة صور
        images: newProduct.sizes[sizeName].image ? [newProduct.sizes[sizeName].image] : [],
      })),
    }
    
    addItem(finalProduct)
    setIsOpen(false)
    setNewProduct(initialProductState) // Reset form
  }

  return (
    <div className="mt-8">
      <button 
        onClick={() => setIsOpen(true)}
        className="admin-btn-primary px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2"
      >
        <span>+</span> إضافة صنف جديد للمحمصة
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-6">
          <div className="admin-card w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-8 border-b border-[#D8D2C2] pb-4 sticky top-0 bg-inherit z-10">
              <h2 className="text-2xl font-black text-[#6F4E37]">إضافة منتج جديد - بن آسر</h2>
              <button onClick={() => setIsOpen(false)} className="text-3xl hover:text-red-500 transition">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Details */}
              <div className="space-y-4 p-1">
                <h3 className="text-xl font-bold text-center text-[#8B5E3C] border-b-2 border-[#D8D2C2] pb-2 mb-6">تفاصيل المنتج الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">اسم نوع البن</label>
                    <input name="name" value={newProduct.name} onChange={handleChange} type="text" className="w-full p-3 rounded-lg border admin-border bg-white/50 outline-none focus:ring-2 focus:ring-[#B17457]" placeholder="مثلاً: بن يمني إكسبريسو" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">درجة التحميص</label>
                    <select name="roastLevel" value={newProduct.roastLevel} onChange={handleChange} className="w-full p-3 rounded-lg border admin-border bg-white/50 outline-none">
                      <option value="فاتح">فاتح</option>
                      <option value="وسط">وسط</option>
                      <option value="غامق (محروق)">غامق (محروق)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2">وصف النكهة</label>
                    <textarea name="description" value={newProduct.description} onChange={handleChange} className="w-full p-3 rounded-lg border admin-border bg-white/50 outline-none h-24" placeholder="اكتبي تفاصيل الطعم والإيحاءات..."></textarea>
                  </div>
                </div>
              </div>

              {/* Sizes Details */}
              <div className="space-y-8 p-1">
                <h3 className="text-xl font-bold text-center text-[#8B5E3C] border-b-2 border-[#D8D2C2] pb-2 mb-6">الأحجام والأسعار والصور</h3>
                
                {(Object.keys(newProduct.sizes) as Array<keyof typeof newProduct.sizes>).map(sizeName => (
                  <div key={sizeName} className="p-4 border rounded-lg admin-border space-y-4 bg-white/20">
                    <h4 className="font-bold text-lg">حجم: {sizeName}</h4>
                    {/* تم تعديل الشبكة لتكون عمودين فقط: السعر والصورة */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-sm font-bold mb-1">السعر (ج.م)</label>
                        <input
                          type="number"
                          name="price"
                          value={newProduct.sizes[sizeName].price}
                          onChange={(e) => handleSizeChange(e, sizeName)}
                          className="w-full p-2 rounded-md border admin-border"
                          placeholder="السعر"
                          required
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm font-bold mb-1">مسار الصورة</label>
                        <input
                          type="text"
                          value={newProduct.sizes[sizeName].image}
                          onChange={(e) => handleImageChange(e, sizeName)}
                          className="w-full p-2 rounded-md border admin-border"
                          placeholder="e.g., /image.png"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 mt-8 pt-4 border-t border-[#D8D2C2]">
                <button type="submit" className="admin-btn-primary flex-1 py-3 rounded-lg font-black text-white">حفظ في المخزن</button>
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 border-2 border-[#D8D2C2] rounded-lg font-bold hover:bg-gray-100 transition">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
