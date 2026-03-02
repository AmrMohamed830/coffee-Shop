"use client"
import React, { useState } from "react"
import { Coffee, Package, Users, ShoppingCart, BarChart3, History, Trash2, Edit, Save, X, Search } from "lucide-react"
import { AddProductForm } from "@/components/add-product-form"
import { useOrderStore } from "@/lib/orderStore"

export default function AdminDashboard() {
  // @ts-ignore - تأكد من وجود دالة updateOrderStatus في الـ Store
  const { orders, updateOrderStatus, products, removeProduct, updateProduct } = useOrderStore()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', price: 0 })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('newest')
  const [orderSearchTerm, setOrderSearchTerm] = useState('')
  const [visibleActiveCount, setVisibleActiveCount] = useState(5)
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(5)

  // حساب المبيعات اليومية (الطلبات المكتملة اليوم فقط)
  const dailySales = orders.reduce((acc, order) => {
    if (order.status !== 'Completed') return acc
    // @ts-ignore
    const orderDate = new Date(order.completedAt || order.createdAt)
    if (orderDate.toDateString() === new Date().toDateString()) {
      return acc + order.total
    }
    return acc
  }, 0)

  // تقسيم الطلبات: الطلبات النشطة (غير المكتملة) والطلبات المكتملة (الأرشيف)
  const activeOrders = orders.filter((order) => order.status !== 'Completed')
  const historyOrders = orders.filter((order) => order.status === 'Completed')

  // استخراج قائمة العملاء الفريدين من الطلبات
  const uniqueCustomers = Array.from(
    new Map(orders.map((order) => [order.customer.phone, order.customer])).values()
  )

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

  const startEditing = (product: any) => {
    setEditingId(product.id)
    setEditForm({ name: product.name, price: product.price })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditForm({ name: '', price: 0 })
  }

  const saveEditing = (originalProduct: any) => {
    updateProduct({ ...originalProduct, name: editForm.name, price: Number(editForm.price) })
    cancelEditing()
  }

  // دالة ترتيب الطلبات
  const sortOrders = (ordersList: any[]) => {
    return [...ordersList].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      
      if (sortOption === 'newest') return dateB - dateA // الأحدث للأقدم
      if (sortOption === 'oldest') return dateA - dateB // الأقدم للأحدث
      if (sortOption === 'price-high') return b.total - a.total // السعر: الأعلى للأقل
      if (sortOption === 'price-low') return a.total - b.total // السعر: الأقل للأعلى
      return 0
    })
  }

  // دالة تصفية الطلبات حسب البحث
  const filterOrders = (ordersList: any[]) => {
    if (!orderSearchTerm) return ordersList
    return ordersList.filter(order => 
      order.id.toLowerCase().includes(orderSearchTerm.toLowerCase())
    )
  }

  const filteredActiveOrders = filterOrders(activeOrders)
  const filteredHistoryOrders = filterOrders(historyOrders)
  
  return (
    <div className="admin-layout flex flex-col md:flex-row">
      {/* Sidebar - القائمة الجانبية */}
      <aside className="admin-sidebar w-full md:w-64 p-6 space-y-8">
        <h1 className="text-2xl font-bold border-b border-white/20 pb-4">لوحة التحكم</h1>
        <nav className="space-y-4">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-3 w-full p-2 rounded transition ${activeTab === 'dashboard' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
          >
            <BarChart3 size={20}/> الإحصائيات
          </button>
          <button 
            onClick={() => setActiveTab('products')} 
            className={`flex items-center gap-3 w-full p-2 rounded transition ${activeTab === 'products' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
          >
            <Package size={20}/> المنتجات
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`flex items-center gap-3 w-full p-2 rounded transition ${activeTab === 'orders' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
          >
            <ShoppingCart size={20}/> الطلبات
          </button>
          <button 
            onClick={() => setActiveTab('customers')} 
            className={`flex items-center gap-3 w-full p-2 rounded transition ${activeTab === 'customers' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
          >
            <Users size={20}/> العملاء
          </button>
        </nav>
      </aside>

      {/* Main Content - المحتوى الأساسي */}
      <main className="flex-1 p-8 space-y-8">
        <header className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">
            {activeTab === 'dashboard' && 'ملخص المبيعات'}
            {activeTab === 'products' && 'إدارة المنتجات'}
            {activeTab === 'orders' && 'سجل الطلبات'}
            {activeTab === 'customers' && 'قاعدة العملاء'}
          </h2>
        </header>

        {/* Stats Cards - كروت الإحصائيات */}
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="admin-card flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full text-blue-600"><ShoppingCart /></div>
                <div>
                  <p className="text-sm opacity-70">الطلبات النشطة</p>
                  <h3 className="text-2xl font-bold">{activeOrders.length}</h3>
                </div>
              </div>
              <div className="admin-card flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full text-green-600"><Coffee /></div>
                <div>
                  <p className="text-sm opacity-70">المبيعات اليومية</p>
                  <h3 className="text-2xl font-bold">{dailySales.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</h3>
                </div>
              </div>
              <div className="admin-card flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full text-purple-600"><Users /></div>
                <div>
                  <p className="text-sm opacity-70">إجمالي العملاء</p>
                  <h3 className="text-2xl font-bold">{uniqueCustomers.length}</h3>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Recent Orders Table - جدول الطلبات الأخيرة */}
        {(activeTab === 'dashboard' || activeTab === 'orders') && (
          <div className="admin-card overflow-x-auto mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><ShoppingCart size={20}/> الطلبات الحالية</h3>
              
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="بحث برقم الطلب..." 
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    className="pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black text-sm w-full md:w-48"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold opacity-70">ترتيب حسب:</span>
                <select 
                  value={sortOption} 
                  onChange={(e) => setSortOption(e.target.value)}
                  className="p-2 rounded-lg border bg-white text-black text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="newest">الوقت: الأحدث للأقدم</option>
                  <option value="oldest">الوقت: الأقدم للأحدث</option>
                  <option value="price-high">السعر: الأعلى سعراً</option>
                  <option value="price-low">السعر: الأقل سعراً</option>
                </select>
                </div>
              </div>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b opacity-50">
                  <th className="py-3 px-4">رقم الطلب</th>
                  <th className="py-3 px-4">وقت الطلب</th>
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
                {filteredActiveOrders.length > 0 ? sortOrders(filteredActiveOrders).slice(0, visibleActiveCount).map((order) => (
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
                    <td colSpan={9} className="py-8 text-center text-muted-foreground">
                      {activeOrders.length > 0 ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد طلبات نشطة حالياً'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredActiveOrders.length > visibleActiveCount && (
              <div className="text-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => setVisibleActiveCount(prev => prev + 5)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition"
                >
                  عرض المزيد ({filteredActiveOrders.length - visibleActiveCount} متبقي)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Order History Table - سجل الطلبات المكتملة */}
        {(activeTab === 'orders' && historyOrders.length > 0) && (
          <div className="admin-card overflow-x-auto opacity-80">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><History size={20}/> سجل الطلبات المكتملة</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b opacity-50">
                  <th className="py-3 px-4">رقم الطلب</th>
                  <th className="py-3 px-4">وقت الطلب</th>
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
                {filteredHistoryOrders.length > 0 ? sortOrders(filteredHistoryOrders).slice(0, visibleHistoryCount).map((order) => (
                  <tr key={order.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
                    <td className="py-4 px-4">#{order.id.slice(-4)}</td>
                    <td className="py-4 px-4 text-sm opacity-80">
                      {/* @ts-ignore */}
                      {order.completedAt ? new Date(order.completedAt).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : (order.createdAt ? new Date(order.createdAt).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : '-')}
                    </td>
                    <td className="py-4 px-4">{order.customer.firstName} {order.customer.lastName}</td>
                    <td className="py-4 px-4">{order.customer.phone}</td>
                    <td className="py-4 px-4">{order.customer.address}</td>
                    <td className="py-4 px-4 text-sm">{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
                    <td className="py-4 px-4">{order.customer.notes}</td>
                    <td className="py-4 px-4">{order.total.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</td>
                    <td className="py-4 px-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                        مكتمل
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-muted-foreground">لا توجد نتائج مطابقة للبحث</td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredHistoryOrders.length > visibleHistoryCount && (
              <div className="text-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => setVisibleHistoryCount(prev => prev + 5)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition"
                >
                  عرض المزيد ({filteredHistoryOrders.length - visibleHistoryCount} متبقي)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Customers Table - جدول العملاء */}
        {activeTab === 'customers' && (
          <div className="admin-card overflow-x-auto">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Users size={20}/> قاعدة العملاء</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b opacity-50">
                  <th className="py-3 px-4">الاسم</th>
                  <th className="py-3 px-4">رقم الهاتف</th>
                  <th className="py-3 px-4">العنوان</th>
                  <th className="py-3 px-4">آخر ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {uniqueCustomers.map((customer: any, index) => (
                  <tr key={index} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
                    <td className="py-4 px-4">{customer.firstName} {customer.lastName}</td>
                    <td className="py-4 px-4">{customer.phone}</td>
                    <td className="py-4 px-4">{customer.address}</td>
                    <td className="py-4 px-4">{customer.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Product Form - إضافة منتج جديد */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="admin-card">
              <h3 className="text-xl font-bold mb-4">إضافة منتج جديد</h3>
              <AddProductForm />
            </div>

            <div className="admin-card overflow-x-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <h3 className="text-xl font-bold flex items-center gap-2"><Package size={20}/> قائمة المنتجات</h3>
                <div className="relative w-full md:w-64">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="بحث باسم المنتج..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black"
                  />
                </div>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b opacity-50">
                    <th className="py-3 px-4">صورة</th>
                    <th className="py-3 px-4">اسم المنتج</th>
                    <th className="py-3 px-4">السعر</th>
                    <th className="py-3 px-4">التصنيف</th>
                    <th className="py-3 px-4">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {/* @ts-ignore */}
                  {products && products.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? 
                    products.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
                    <tr key={product.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
                      <td className="py-4 px-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      </td>
                      <td className="py-4 px-4 font-medium">
                        {editingId === product.id ? (
                          <input 
                            type="text" 
                            value={editForm.name} 
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="border rounded p-1 w-full text-black"
                          />
                        ) : product.name}
                      </td>
                      <td className="py-4 px-4">
                        {editingId === product.id ? (
                          <input 
                            type="number" 
                            value={editForm.price} 
                            onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                            className="border rounded p-1 w-24 text-black"
                          />
                        ) : Number(product.price).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
                      </td>
                      <td className="py-4 px-4">{product.category}</td>
                      <td className="py-4 px-4 flex gap-2">
                        {editingId === product.id ? (
                          <>
                            <button onClick={() => saveEditing(product)} className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition" title="حفظ">
                              <Save size={18} />
                            </button>
                            <button onClick={cancelEditing} className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition" title="إلغاء">
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEditing(product)} className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition" title="تعديل">
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
                                  removeProduct(product.id)
                                }
                              }}
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                              title="حذف المنتج"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">لا توجد منتجات مطابقة للبحث</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}