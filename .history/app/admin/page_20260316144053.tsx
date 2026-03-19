"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "../../config/firebase"
import { Coffee, Package, Users, ShoppingCart, BarChart3, History, Trash2, Edit, Save, X, Search, RotateCcw, Calendar, ArrowUpDown, LogOut, ShieldAlert } from "lucide-react"
import { AddProductForm } from "@/components/add-product-form"
import { useOrderStore } from "@/lib/orderStore"
import { useAdminStore } from "@/lib/adminStore"
import type { Order, OrderStatus } from "@/lib/types"
import type { Product } from "@/lib/orderStore"

export default function AdminDashboard() {
  const router = useRouter()
  const [loadingAuth, setLoadingAuth] = useState(false)
  const { isAccessGranted, logout: logoutAdmin } = useAdminStore()

  useEffect(() => {
    // تم إيقاف شاشة التحميل والتحقق مؤقتاً لتسهيل العمل
  }, [router])

  const { 
    orders: storeOrders, 
    updateOrderStatus, 
    products: storeProducts, 
    removeProduct, 
    updateProduct,
    customers,
    initListener
  } = useOrderStore()

  const orders: Order[] = storeOrders || []
  const products = storeProducts || []
  const uniqueCustomers = customers || []

  const [activeTab, setActiveTab] = useState('orders')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', price: 0 })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('newest')
  const [orderSearchTerm, setOrderSearchTerm] = useState('')
  const [visibleActiveCount, setVisibleActiveCount] = useState(5)
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(5)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showSortMenu, setShowSortMenu] = useState(false)

  useEffect(() => {
    initListener()
  }, []) // إزالة التبعية لمنع إعادة التحميل اللانهائي وتجميد الصفحة

  // إجبار المتصفح للعودة للطلبات في حال قفل الصلاحيات
  useEffect(() => {
    if (!isAccessGranted) {
      setActiveTab('orders')
    }
  }, [isAccessGranted])

  const activeOrders = orders.filter((order) => order && order.status !== 'مكتمل')
  const historyOrders = orders.filter((order) => order && order.status === 'مكتمل')

  const statusOptions = [
    { value: 'جديد', label: 'جديد', color: 'bg-blue-100 text-blue-700' },
    { value: 'قيد التنفيذ', label: 'قيد التنفيذ', color: 'bg-orange-100 text-orange-700' },
    { value: 'جاري الشحن', label: 'جاري الشحن', color: 'bg-purple-100 text-purple-700' },
    { value: 'مكتمل', label: 'مكتمل', color: 'bg-green-100 text-green-700' },
  ]

  const getStatusColor = (status: string) => {
    const option = statusOptions.find(o => o.value === status)
    return option ? option.color : 'bg-gray-100 text-gray-700'
  }

  const startEditing = (product: Product) => {
    setEditingId(product.id)
    setEditForm({ name: product.name, price: product.price })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditForm({ name: '', price: 0 })
  }

  const saveEditing = (originalProduct: Product) => {
    updateProduct({ ...originalProduct, name: editForm.name, price: Number(editForm.price) })
    cancelEditing()
  }

  const sortOrders = (ordersList: Order[]) => {
    return [...ordersList].filter(Boolean).sort((a, b) => {
      const dateA = new Date(a?.createdAt || 0).getTime()
      const dateB = new Date(b?.createdAt || 0).getTime()
      
      if (sortOption === 'newest') return dateB - dateA
      if (sortOption === 'oldest') return dateA - dateB
      if (sortOption === 'price-high') return (b?.total || 0) - (a?.total || 0)
      if (sortOption === 'price-low') return (a?.total || 0) - (b?.total || 0)
      return 0
    })
  }

  const filterOrders = (ordersList: Order[]) => {
    let filtered = ordersList.filter(Boolean)

    if (orderSearchTerm) {
      const term = orderSearchTerm.toLowerCase()
      filtered = filtered.filter(order => 
        (order?.id || '').toLowerCase().includes(term) ||
        `${order?.customer?.firstName || ''} ${order?.customer?.lastName || ''}`.toLowerCase().includes(term)
      )
    }

    if (startDate || endDate) {
      filtered = filtered.filter(order => {
        const orderDateStr = order?.completedAt || order?.createdAt
        if (!orderDateStr) return false
        const orderDate = new Date(orderDateStr).toISOString().split('T')[0]
        
        if (startDate && orderDate < startDate) return false
        if (endDate && orderDate > endDate) return false
        return true
      })
    }

    return filtered
  }

  const resetFilters = () => {
    setOrderSearchTerm('')
    setStartDate('')
    setEndDate('')
    setShowDatePicker(false)
    setShowSortMenu(false)
    setSortOption('newest')
    setVisibleActiveCount(5)
    setVisibleHistoryCount(5)
  }

  const filteredActiveOrders = filterOrders(activeOrders)
  const filteredHistoryOrders = filterOrders(historyOrders)

  const handleLogout = async () => {
    try {
      logoutAdmin() // قفل الإدارة محلياً
      router.push('/') // الرجوع للرئيسية بدل صفحة تسجيل الدخول المتعطلة
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--admin-bg)' }}>
        <div className="text-xl font-bold flex flex-col items-center gap-4 text-[var(--admin-text)]">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          جاري التحميل...
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout flex flex-col md:flex-row">
      {/* Sidebar - القائمة الجانبية */}
      <aside className="admin-sidebar w-full md:w-64 p-6 flex flex-col space-y-8 text-white">
        <h1 className="text-2xl font-bold border-b border-white/20 pb-4">لوحة التحكم</h1>
        <nav className="space-y-4 flex-1">
          {isAccessGranted && (
            <>
              <button 
                onClick={() => setActiveTab('products')} 
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'products' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
              >
                <Package size={20}/> المنتجات
              </button>
              <button 
                onClick={() => setActiveTab('customers')} 
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'customers' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
              >
                <Users size={20}/> العملاء
              </button>
            </>
          )}
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'orders' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
          >
            <ShoppingCart size={20}/> الطلبات
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${activeTab === 'history' ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
          >
            <History size={20}/> السجل
          </button>
        </nav>
        
        <div className="pt-8 border-t border-white/20 mt-8">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2 rounded transition text-red-300 hover:bg-white/10 hover:text-red-400"
          >
            <LogOut size={20}/> تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content - المحتوى الأساسي */}
      <main className="flex-1 p-8 space-y-8">
        {!isAccessGranted && activeTab !== 'orders' ? (
           <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
             <ShieldAlert size={64} className="mb-4 text-red-500" />
             <h2 className="text-2xl font-bold mb-2 text-[var(--admin-text)]">الوصول مقيد</h2>
             <p>الرجاء تفعيل <span className="font-bold text-green-500">وضع المسؤول</span> من أيقونة الدرع في الأعلى للوصول لهذه الصفحة.</p>
           </div>
        ) : (
        <>
          <header className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-[var(--admin-text)]">
              {activeTab === 'products' && 'إدارة المنتجات'}
              {activeTab === 'orders' && 'الطلبات'}
              {activeTab === 'history' && 'سجل الطلبات'}
              {activeTab === 'customers' && 'قاعدة العملاء'}
            </h2>
          </header>

          {/* Orders and Stats Page */}
          {activeTab === 'orders' && (
            <>
              {/* Recent Orders Table - جدول الطلبات الأخيرة */}
              <div className="admin-card mb-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--admin-text)]"><ShoppingCart size={20}/> الطلبات الحالية</h3>
                  
                  <div className="flex flex-col md:flex-row items-center gap-4 flex-wrap justify-end">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="text" 
                        name="search-active-orders"
                        autoComplete="new-password"
                        placeholder="بحث برقم الطلب أو اسم العميل..." 
                        value={orderSearchTerm}
                        onChange={(e) => setOrderSearchTerm(e.target.value)}
                        className="pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[var(--admin-text)] text-sm w-full md:w-48"
                      />
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className={`p-2 border rounded-lg flex items-center gap-2 text-sm font-medium transition ${startDate || endDate ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-[var(--admin-text)] hover:bg-gray-50'}`}
                      >
                        <Calendar size={16} />
                        <span>
                          {startDate || endDate ? (
                            <span className="text-xs" dir="ltr">
                              {startDate ? startDate : '...'} / {endDate ? endDate : '...'}
                            </span>
                          ) : 'تصفية بالتاريخ'}
                        </span>
                      </button>

                      {showDatePicker && (
                        <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 p-4 bg-white border rounded-xl shadow-xl z-50 w-72 animate-in fade-in zoom-in-95 duration-200">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">من تاريخ</label>
                              <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-2 rounded-lg border bg-gray-50 text-[var(--admin-text)] text-sm outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">إلى تاريخ</label>
                              <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-2 rounded-lg border bg-gray-50 text-[var(--admin-text)] text-sm outline-none focus:ring-2 focus:ring-primary"
                              />
                            </div>
                            <div className="flex justify-end pt-2 border-t">
                              <button 
                                onClick={() => setShowDatePicker(false)}
                                className="text-xs font-bold text-primary hover:underline"
                              >
                                إغلاق
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <button 
                        onClick={() => setShowSortMenu(!showSortMenu)}
                        className="p-2 border rounded-lg flex items-center gap-2 text-sm font-medium bg-white border-gray-200 text-[var(--admin-text)] hover:bg-gray-50"
                      >
                        <ArrowUpDown size={16} />
                        <span>الترتيب</span>
                      </button>

                      {showSortMenu && (
                        <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 w-48 bg-white border rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                          <button onClick={() => { setSortOption('newest'); setShowSortMenu(false) }} className={`w-full text-right px-4 py-2 text-sm text-[var(--admin-text)] hover:bg-gray-50 ${sortOption === 'newest' ? 'bg-gray-50 font-bold' : ''}`}>الوقت: الأحدث للأقدم</button>
                          <button onClick={() => { setSortOption('oldest'); setShowSortMenu(false) }} className={`w-full text-right px-4 py-2 text-sm text-[var(--admin-text)] hover:bg-gray-50 ${sortOption === 'oldest' ? 'bg-gray-50 font-bold' : ''}`}>الوقت: الأقدم للأحدث</button>
                          <button onClick={() => { setSortOption('price-high'); setShowSortMenu(false) }} className={`w-full text-right px-4 py-2 text-sm text-[var(--admin-text)] hover:bg-gray-50 ${sortOption === 'price-high' ? 'bg-gray-50 font-bold' : ''}`}>السعر: الأعلى سعراً</button>
                          <button onClick={() => { setSortOption('price-low'); setShowSortMenu(false) }} className={`w-full text-right px-4 py-2 text-sm text-[var(--admin-text)] hover:bg-gray-50 ${sortOption === 'price-low' ? 'bg-gray-50 font-bold' : ''}`}>السعر: الأقل سعراً</button>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={resetFilters}
                      className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-1 text-sm font-bold"
                      title="إعادة تعيين الفلاتر"
                    >
                      <RotateCcw size={16} />
                      مسح الفلاتر
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-[var(--admin-text)]">رقم الطلب</th>
                      <th className="py-3 px-4 text-[var(--admin-text)]">وقت الطلب</th>
                      <th className="py-3 px-4 text-[var(--admin-text)]">العميل</th>
                      <th className="py-3 px-4 text-[var(--admin-text)]">رقم الهاتف</th>
                      <th className="py-3 px-4 text-[var(--admin-text)]">العنوان</th>
                      <th className="py-3 px-4 text-[var(--admin-text)]">المنتجات</th>
                      <th className="py-3 px-4 text-[var(--admin-text)]">الملاحظات</th>
                      <th className="py-3 px-4 text-[var(--admin-text)]">الإجمالي</th>
                      <th className="py-3 px-4 text-[var(--admin-text)]">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActiveOrders.length > 0 ? sortOrders(filteredActiveOrders).slice(0, visibleActiveCount).map((order) => (
                      <tr key={order?.id || Math.random()} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-4 px-4 text-[var(--admin-text)]">#{(order?.id || '').slice(-4)}</td>
                        <td className="py-4 px-4 text-sm text-[var(--admin-text)]">
                          {/* @ts-ignore */}
                          {order?.createdAt ? new Date(order.createdAt).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : '-'}
                        </td>
                        <td className="py-4 px-4 text-[var(--admin-text)]">{order?.customer?.firstName || ''} {order?.customer?.lastName || ''}</td>
                        <td className="py-4 px-4 text-[var(--admin-text)]">{order?.customer?.phone || '-'}</td>
                        <td className="py-4 px-4 text-[var(--admin-text)]">{order?.customer?.address || '-'}</td>
                        <td className="py-4 px-4 text-sm text-[var(--admin-text)]">{(order?.items || []).map((item: any) => `${item?.name || 'بدون اسم'} (x${item?.quantity || 1})`).join(', ')}</td>
                        <td className="py-4 px-4 text-[var(--admin-text)]">{order?.customer?.notes || '-'}</td>
                        <td className="py-4 px-4 text-[var(--admin-text)]">{(order?.total || 0).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</td>
                        <td className="py-4 px-4">
                          <select 
                            value={order?.status || 'جديد'}
                            onChange={(e) => updateOrderStatus && updateOrderStatus(order?.id, e.target.value as OrderStatus)}
                            className={`px-2 py-1 rounded text-sm border-none cursor-pointer outline-none font-medium ${getStatusColor(order?.status || 'جديد')}`}
                          >
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value} className="bg-white text-[var(--admin-text)]">
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
                </div>
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
            </>
          )}

          {/* Order History Table - سجل الطلبات المكتملة */}
          {activeTab === 'history' && (
            <>
                  {/* إحصائيات السجل */}
                  {isAccessGranted && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      <div className="admin-card flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-full text-green-600"><BarChart3 /></div>
                        <div>
                          <p className="text-sm font-bold text-[var(--admin-text)]">إجمالي الأرباح</p>
                          <h3 className="text-2xl font-bold text-[var(--admin-text)]">{filteredHistoryOrders.reduce((acc, order) => acc + (order?.total || 0), 0).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</h3>
                        </div>
                      </div>
                      <div className="admin-card flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600"><History /></div>
                        <div>
                          <p className="text-sm font-bold text-[var(--admin-text)]">الطلبات المكتملة</p>
                          <h3 className="text-2xl font-bold text-[var(--admin-text)]">{filteredHistoryOrders.length}</h3>
                        </div>
                      </div>
                    </div>
                  )}

              {historyOrders.length > 0 ? (
                <div className="admin-card mb-8">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--admin-text)]"><History size={20}/> سجل الطلبات المكتملة</h3>
                    
                    <div className="flex flex-col md:flex-row items-center gap-4 flex-wrap justify-end">
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="text" 
                          name="search-history-orders"
                          placeholder="بحث برقم الطلب أو اسم العميل..." 
                          value={orderSearchTerm}
                          onChange={(e) => setOrderSearchTerm(e.target.value)}
                          autoComplete="new-password"
                          className="pr-10 pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[var(--admin-text)] text-sm w-full md:w-48"
                        />
                        {orderSearchTerm && (
                          <button onClick={() => setOrderSearchTerm('')} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition">
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      
                      <div className="relative">
                        <button 
                          onClick={() => setShowDatePicker(!showDatePicker)}
                          className={`p-2 border rounded-lg flex items-center gap-2 text-sm font-medium transition ${startDate || endDate ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-[var(--admin-text)] hover:bg-gray-50'}`}
                        >
                          <Calendar size={16} />
                          <span>
                            {startDate || endDate ? (
                              <span className="text-xs" dir="ltr">
                                {startDate ? startDate : '...'} / {endDate ? endDate : '...'}
                              </span>
                            ) : 'تصفية بالتاريخ'}
                          </span>
                        </button>

                        {showDatePicker && (
                          <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 p-4 bg-white border rounded-xl shadow-xl z-50 w-72 animate-in fade-in zoom-in-95 duration-200">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">من تاريخ</label>
                                <input 
                                  type="date" 
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  className="w-full p-2 rounded-lg border bg-gray-50 text-[var(--admin-text)] text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-[var(--admin-text)] mb-1">إلى تاريخ</label>
                                <input 
                                  type="date" 
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  className="w-full p-2 rounded-lg border bg-gray-50 text-[var(--admin-text)] text-sm outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>
                              <div className="flex justify-end pt-2 border-t">
                                <button 
                                  onClick={() => setShowDatePicker(false)}
                                  className="text-xs font-bold text-primary hover:underline"
                                >
                                  إغلاق
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <button 
                          onClick={() => setShowSortMenu(!showSortMenu)}
                          className="p-2 border rounded-lg flex items-center gap-2 text-sm font-medium bg-white border-gray-200 text-[var(--admin-text)] hover:bg-gray-50"
                        >
                          <ArrowUpDown size={16} />
                          <span>الترتيب</span>
                        </button>

                        {showSortMenu && (
                          <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 w-48 bg-white border rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                            <button onClick={() => { setSortOption('newest'); setShowSortMenu(false) }} className={`w-full text-right px-4 py-2 text-sm text-[var(--admin-text)] hover:bg-gray-50 ${sortOption === 'newest' ? 'bg-gray-50 font-bold' : ''}`}>الوقت: الأحدث للأقدم</button>
                            <button onClick={() => { setSortOption('oldest'); setShowSortMenu(false) }} className={`w-full text-right px-4 py-2 text-sm text-[var(--admin-text)] hover:bg-gray-50 ${sortOption === 'oldest' ? 'bg-gray-50 font-bold' : ''}`}>الوقت: الأقدم للأحدث</button>
                            <button onClick={() => { setSortOption('price-high'); setShowSortMenu(false) }} className={`w-full text-right px-4 py-2 text-sm text-[var(--admin-text)] hover:bg-gray-50 ${sortOption === 'price-high' ? 'bg-gray-50 font-bold' : ''}`}>السعر: الأعلى سعراً</button>
                            <button onClick={() => { setSortOption('price-low'); setShowSortMenu(false) }} className={`w-full text-right px-4 py-2 text-sm text-[var(--admin-text)] hover:bg-gray-50 ${sortOption === 'price-low' ? 'bg-gray-50 font-bold' : ''}`}>السعر: الأقل سعراً</button>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={resetFilters}
                        className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-1 text-sm font-bold"
                        title="إعادة تعيين الفلاتر"
                      >
                        <RotateCcw size={16} />
                        مسح الفلاتر
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-[var(--admin-text)]">رقم الطلب</th>
                        <th className="py-3 px-4 text-[var(--admin-text)]">وقت الطلب</th>
                        <th className="py-3 px-4 text-[var(--admin-text)]">العميل</th>
                        <th className="py-3 px-4 text-[var(--admin-text)]">رقم الهاتف</th>
                        <th className="py-3 px-4 text-[var(--admin-text)]">العنوان</th>
                        <th className="py-3 px-4 text-[var(--admin-text)]">المنتجات</th>
                        <th className="py-3 px-4 text-[var(--admin-text)]">الملاحظات</th>
                        <th className="py-3 px-4 text-[var(--admin-text)]">الإجمالي</th>
                        <th className="py-3 px-4 text-[var(--admin-text)]">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistoryOrders.length > 0 ? sortOrders(filteredHistoryOrders).slice(0, visibleHistoryCount).map((order) => (
                        <tr key={order?.id || Math.random()} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
                          <td className="py-4 px-4 text-[var(--admin-text)]">#{(order?.id || '').slice(-4)}</td>
                          <td className="py-4 px-4 text-sm text-[var(--admin-text)]">
                            {/* @ts-ignore */}
                            {order?.completedAt ? new Date(order.completedAt).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : (order?.createdAt ? new Date(order.createdAt).toLocaleString('ar-EG', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : '-')}
                          </td>
                          <td className="py-4 px-4 text-[var(--admin-text)]">{order?.customer?.firstName || ''} {order?.customer?.lastName || ''}</td>
                          <td className="py-4 px-4 text-[var(--admin-text)]">{order?.customer?.phone || '-'}</td>
                          <td className="py-4 px-4 text-[var(--admin-text)]">{order?.customer?.address || '-'}</td>
                          <td className="py-4 px-4 text-sm text-[var(--admin-text)]">{(order?.items || []).map((item: any) => `${item?.name || 'بدون اسم'} (x${item?.quantity || 1})`).join(', ')}</td>
                          <td className="py-4 px-4 text-[var(--admin-text)]">{order?.customer?.notes || '-'}</td>
                          <td className="py-4 px-4 text-[var(--admin-text)]">{(order?.total || 0).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</td>
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
                  </div>
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
              ) : (
                <div className="admin-card text-center py-12 text-gray-500 font-bold text-lg">
                  لا توجد طلبات في السجل حتى الآن
                </div>
              )}
            </>
          )}

          {/* Customers Table - جدول العملاء */}
          {activeTab === 'customers' && isAccessGranted && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="admin-card flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full text-purple-600"><Users /></div>
                  <div>
                    <p className="text-sm font-bold text-[var(--admin-text)]">إجمالي العملاء</p>
                    <h3 className="text-2xl font-bold text-[var(--admin-text)]">{uniqueCustomers.length}</h3>
                  </div>
                </div>
              </div>

              <div className="admin-card overflow-x-auto">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--admin-text)]"><Users size={20}/> قاعدة العملاء</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-[var(--admin-text)]">الاسم</th>
                    <th className="py-3 px-4 text-[var(--admin-text)]">رقم الهاتف</th>
                    <th className="py-3 px-4 text-[var(--admin-text)]">العنوان</th>
                    <th className="py-3 px-4 text-[var(--admin-text)]">آخر ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {uniqueCustomers.map((customer: any, index: number) => {
                    if (!customer) return null;
                    return (
                      <tr key={index} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-4 px-4 text-[var(--admin-text)]">{customer?.firstName || ''} {customer?.lastName || ''}</td>
                        <td className="py-4 px-4 text-[var(--admin-text)]">{customer?.phone || '-'}</td>
                        <td className="py-4 px-4 text-[var(--admin-text)]">{customer?.address || '-'}</td>
                        <td className="py-4 px-4 text-[var(--admin-text)]">{customer?.notes || '-'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            </div>
          )}

          {/* Add Product Form - إضافة منتج جديد */}
          {activeTab === 'products' && isAccessGranted && (
            <div className="space-y-8">
              <div className="admin-card">
                <h3 className="text-xl font-bold mb-4 text-[var(--admin-text)]">إضافة منتج جديد</h3>
                <AddProductForm />
              </div>

              <div className="admin-card overflow-x-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--admin-text)]"><Package size={20}/> قائمة المنتجات</h3>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="search-products-list"
                      autoComplete="new-password"
                      placeholder="بحث باسم المنتج..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pr-10 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-[var(--admin-text)]"
                    />
                  </div>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-[var(--admin-text)]">صورة</th>
                      <th className="py-3 px-4 text-[var(--admin-text)]">اسم المنتج</th>
                      <th className="py-3 px-4 text-[var(--admin-text)]">السعر</th>
                      <th className="py-3 px-4 text-[var(--admin-text)]">التصنيف</th>
                      <th className="py-3 px-4 text-[var(--admin-text)]">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* @ts-ignore */}
                    {products && products.filter((p: Product) => (p?.name || '').toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? 
                      products.filter((p: Product) => (p?.name || '').toLowerCase().includes(searchTerm.toLowerCase())).map((product: Product) => (
                      <tr key={product.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
                        <td className="py-4 px-4">
                          <img src={product?.image || '/placeholder.svg'} alt={product?.name || 'بدون اسم'} className="w-12 h-12 object-cover rounded" />
                        </td>
                        <td className="py-4 px-4 font-medium text-[var(--admin-text)]">
                          {editingId === product.id ? (
                            <input 
                              type="text" 
                              value={editForm.name} 
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                              className="border rounded p-1 w-full text-[var(--admin-text)]"
                            />
                          ) : (product?.name || 'بدون اسم')}
                        </td>
                        <td className="py-4 px-4 text-[var(--admin-text)]">
                          {editingId === product.id ? (
                            <input 
                              type="number" 
                              value={editForm.price} 
                              onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                              className="border rounded p-1 w-24 text-[var(--admin-text)]"
                            />
                          ) : Number(product?.price || 0).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}
                        </td>
                        <td className="py-4 px-4 text-[var(--admin-text)]">{product?.category || '-'}</td>
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
        </>
        )}
      </main>
    </div>
  )
}
