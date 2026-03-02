"use client"
import React from "react"
import { Coffee, Package, Users, ShoppingCart, BarChart3, History } from "lucide-react"
import { AddProductForm } from "@/components/add-product-form"
import { useOrderStore } from "@/lib/orderStore"

export default function AdminDashboard() {
  // @ts-ignore - تأكد من وجود دالة updateOrderStatus في الـ Store
  const { orders, updateOrderStatus } = useOrderStore()

  const totalSales = orders.reduce((acc, order) => acc + order.total, 0)

  // تقسيم الطلبات: الطلبات النشطة (غير المكتملة) والطلبات المكتملة (الأرشيف)
  const activeOrders = orders.filter((order) => order.status !== 'Completed')
  const historyOrders = orders.filter((order) => order.status === 'Completed')

  const statusOptions = [
    { value: 'New', label: 'جديد', color: 'bg-blue-100 text-blue-700' },
    { value: 'Processing', label: 'قيد التنفيذ', color: 'bg-orange-100 text-orange-700' },
    { value: 'Shipping', label: 'جاري الشحن', color: 'bg-purple-100 text-purple-700' },
    { value: 'Completed', label: 'مكتمل', color: 'bg-green-100 text-green-700' },
  ]

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(o => o.value === status)
    return option ? option.color : 'bg-gray-100 text-gray-700'
  }
  
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
              <h3 className="text-2xl font-bold">{orders.length}</h3>
            </div>
          </div>
          <div className="admin-card flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600"><Coffee /></div>
            <div>
              <p className="text-sm opacity-70">إجمالي المبيعات</p>
              <h3 className="text-2xl font-bold">{totalSales.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</h3>
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
        <div className="admin-card overflow-x-auto mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ShoppingCart size={20}/> الطلبات الحالية</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b opacity-50">
                <th className="py-3 px-4">رقم الطلب</th>
                <th className="py-3 px-4">التاريخ</th>
                <th className="py-3 px-4">العميل</th>
                <th className="py-3 px-4">رقم الهاتف</th>
                <th className="py-3 px-4">العنوان</th>
                <th className="py-3 px-4">المنتجات</th>
                <th className="py-3 px-4">الملاحظات</th>
                <th className="py-3 px-4">الإجمالي</th>
                <th className="py-3 px-4">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.length > 0 ? activeOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
                  <td className="py-4 px-4">#{order.id.slice(-4)}</td>
                  <td className="py-4 px-4 text-sm opacity-80">
                    {/* @ts-ignore */}
                    {order.createdAt ? new Date(order.createdAt).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : '-'}
                  </td>
                  <td className="py-4 px-4">{order.customer.firstName} {order.customer.lastName}</td>
                  <td className="py-4 px-4">{order.customer.phone}</td>
                  <td className="py-4 px-4">{order.customer.address}</td>
                  <td className="py-4 px-4 text-sm">{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
                  <td className="py-4 px-4">{order.customer.notes}</td>
                  <td className="py-4 px-4">{order.total.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</td>
                  <td className="py-4 px-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus && updateOrderStatus(order.id, e.target.value)}
                      className={`px-2 py-1 rounded text-sm border-none cursor-pointer outline-none font-medium ${getStatusColor(order.status)}`}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value} className="bg-white text-black">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted-foreground">لا توجد طلبات نشطة حالياً</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Order History Table - سجل الطلبات المكتملة */}
        {historyOrders.length > 0 && (
          <div className="admin-card overflow-x-auto opacity-80">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><History size={20}/> سجل الطلبات المكتملة</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b opacity-50">
                  <th className="py-3 px-4">رقم الطلب</th>
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">العميل</th>
                  <th className="py-3 px-4">المنتجات</th>
                  <th className="py-3 px-4">الإجمالي</th>
                  <th className="py-3 px-4">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {historyOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
                    <td className="py-4 px-4">#{order.id.slice(-4)}</td>
                    <td className="py-4 px-4 text-sm opacity-80">
                      {/* @ts-ignore */}
                      {order.createdAt ? new Date(order.createdAt).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : '-'}
                    </td>
                    <td className="py-4 px-4">{order.customer.firstName} {order.customer.lastName}</td>
                    <td className="py-4 px-4 text-sm">{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
                    <td className="py-4 px-4">{order.total.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                        مكتمل
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Product Form - إضافة منتج جديد */}
        <div className="admin-card">
          <h3 className="text-xl font-bold mb-4">إضافة منتج جديد</h3>
          <AddProductForm />
        </div>
      </main>
    </div>
  )
}