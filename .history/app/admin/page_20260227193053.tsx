"use client"
import React from "react"
import { Coffee, Package, Users, ShoppingCart, BarChart3 } from "lucide-react"
import { AddProductForm } from "@/components/"

export default function AdminDashboard() {
  return (
    <div className="admin-layout flex flex-col md:flex-row">
      {/* Sidebar - القائمة الجانبية */}
      <aside className="admin-sidebar w-full md:w-64 p-6 space-y-8">
        <h1 className="text-2xl font-bold border-b border-white/20 pb-4">لوحة التحكم</h1>
        <nav className="space-y-4">
          <a href="#" className="flex items-center gap-3 hover:opacity-80 transition"><BarChart3 size={20}/> الإحصائيات</a>
          <a href="#" className="flex items-center gap-3 hover:opacity-80 transition"><Package size={20}/> المنتجات</a>
          <a href="#" className="flex items-center gap-3 hover:opacity-80 transition"><ShoppingCart size={20}/> الطلبات</a>
          <a href="#" className="flex items-center gap-3 hover:opacity-80 transition"><Users size={20}/> العملاء</a>
        </nav>
      </aside>

      {/* Main Content - المحتوى الأساسي */}
      <main className="flex-1 p-8 space-y-8">
        <header className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">ملخص مبيعات بن آسر</h2>
          <button className="admin-btn-primary px-6 py-2 rounded-lg font-medium">تحديث البيانات</button>
        </header>

        {/* Stats Cards - كروت الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="admin-card flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600"><ShoppingCart /></div>
            <div>
              <p className="text-sm opacity-70">إجمالي الطلبات</p>
              <h3 className="text-2xl font-bold">128</h3>
            </div>
          </div>
          <div className="admin-card flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600"><Coffee /></div>
            <div>
              <p className="text-sm opacity-70">المبيعات اليومية</p>
              <h3 className="text-2xl font-bold">4,500 ج.م</h3>
            </div>
          </div>
          <div className="admin-card flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600"><Users /></div>
            <div>
              <p className="text-sm opacity-70">عملاء جدد</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
        </div>

        {/* Recent Orders Table - جدول الطلبات الأخيرة */}
        <div className="admin-card overflow-hidden">
          <h3 className="text-xl font-bold mb-4">آخر الطلبات</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b opacity-50">
                <th className="py-3 px-4">رقم الطلب</th>
                <th className="py-3 px-4">العميل</th>
                <th className="py-3 px-4">المنتج</th>
                <th className="py-3 px-4">الحالة</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
                <td className="py-4 px-4">#1024</td>
                <td className="py-4 px-4">أحمد محمد</td>
                <td className="py-4 px-4">بن برازيلي محمض</td>
                <td className="py-4 px-4"><span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm">قيد التنفيذ</span></td>
              </tr>
              <tr className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
                <td className="py-4 px-4">#1025</td>
                <td className="py-4 px-4">سارة علي</td>
                <td className="py-4 px-4">بن يمني ممتاز</td>
                <td className="py-4 px-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">مكتمل</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}