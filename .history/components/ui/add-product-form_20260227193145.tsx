"use client"
import React, { useState } from "react"

export function AddProductForm() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-8">
      {/* زرار الإضافة بتنسيق البن */}
      <button 
        onClick={() => setIsOpen(true)}
        className="admin-btn-primary px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2"
      >
        <span>+</span> إضافة صنف جديد للمحمصة
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-6">
          <div className="admin-card w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-8 border-b border-[#D8D2C2] pb-4">
              <h2 className="text-2xl font-black text-[#6F4E37]">إضافة منتج جديد - بن آسر</h2>
              <button onClick={() => setIsOpen(false)} className="text-3xl hover:text-red-500 transition">&times;</button>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">اسم نوع البن</label>
                <input type="text" className="w-full p-4 rounded-xl border admin-border bg-white/50 outline-none focus:ring-2 focus:ring-[#B17457]" placeholder="مثلاً: بن يمني إكسبريسو" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">السعر (ج.م)</label>
                <input type="number" className="w-full p-4 rounded-xl border admin-border bg-white/50 outline-none" placeholder="250" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">درجة التحميص</label>
                <select className="w-full p-4 rounded-xl border admin-border bg-white/50 outline-none">
                  <option>فاتح</option>
                  <option>وسط</option>
                  <option>غامق (محروق)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">وصف النكهة</label>
                <textarea className="w-full p-4 rounded-xl border admin-border bg-white/50 outline-none h-32" placeholder="اكتبي تفاصيل الطعم والإيحاءات..."></textarea>
              </div>

              <div className="md:col-span-2 flex gap-4 mt-4">
                <button type="submit" className="admin-btn-primary flex-1 py-4 rounded-xl font-black text-white">حفظ في المخزن</button>
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-4 border-2 border-[#D8D2C2] rounded-xl font-bold hover:bg-gray-100 transition">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}