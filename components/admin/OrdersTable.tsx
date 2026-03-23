import React from 'react';
import type { OrderWithHistory, OrderStatus, UserProfile } from '@/lib/types';

interface OrdersTableProps {
  orders: OrderWithHistory[];
  title: string;
  icon: React.ElementType;
  visibleCount: number;
  onShowMore: () => void;
  isHistoryTable?: boolean;
  statusOptions: { value: OrderStatus; label: string; color: string }[];
  getStatusColor: (status: string) => string;
  updateOrderStatus?: (orderId: string, status: OrderStatus, userProfile: UserProfile) => void;
  userProfile: UserProfile | null;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  title, 
  icon: Icon,
  visibleCount, 
  onShowMore, 
  isHistoryTable = false,
  statusOptions,
  getStatusColor,
  updateOrderStatus,
  userProfile
}) => {
  if (!orders || orders.length === 0) {
    if (isHistoryTable) {
        return null;
    }
    return (
        <div className="admin-card mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--admin-text)] mb-4">
                <Icon size={20} /> {title}
            </h3>
            <div className="text-center py-8 text-muted-foreground">لا توجد طلبات حالية.</div>
        </div>
    );
  }

  return (
    <div className="admin-card mb-8">
      <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--admin-text)] mb-4">
        <Icon size={20} /> {title}
      </h3>
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
            {orders.slice(0, visibleCount).map((order) => (
              <tr key={order.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
                <td className="py-4 px-4 text-[var(--admin-text)] break-all">#{order.id.slice(-4)}</td>
                <td className="py-4 px-4 text-sm text-[var(--admin-text)] break-all">
                  {isHistoryTable 
                    ? (order.completedAt ? new Date(order.completedAt).toLocaleString('ar-EG', { numberingSystem: 'latn',  month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : (order.createdAt ? new Date(order.createdAt).toLocaleString('ar-EG', { numberingSystem: 'latn',  month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : '-'))
                    : (order.createdAt ? new Date(order.createdAt).toLocaleString('ar-EG', { numberingSystem: 'latn',  month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : '-')
                  }
                </td>
                <td className="py-4 px-4 text-[var(--admin-text)] break-all">{order.customer.firstName} {order.customer.lastName}</td>
                <td className="py-4 px-4 text-[var(--admin-text)] break-all">{order.customer.phone}</td>
                <td className="py-4 px-4 text-[var(--admin-text)] break-all">{order.customer.address}</td>
                <td className="py-4 px-4 text-sm text-[var(--admin-text)] break-all">{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
                <td className="py-4 px-4 text-[var(--admin-text)] break-all">{order.customer.notes}</td>
                <td className="py-4 px-4 text-[var(--admin-text)] break-all">{order.total.toLocaleString('ar-EG', { numberingSystem: 'latn',  style: 'currency', currency: 'EGP' }).replace('ج.م.', 'ج.م')}</td>
                <td className="py-4 px-4">
                  {isHistoryTable ? (
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                  ) : (
                    <div className="flex flex-col">
                      <select 
                        value={order.status} 
                        onChange={(e) => {
                          if (updateOrderStatus && userProfile) {
                            updateOrderStatus(order.id, e.target.value as OrderStatus, userProfile)
                          }
                        }}
                        className={`p-1.5 rounded-md text-xs border-none outline-none appearance-none ${getStatusColor(order.status)}`}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length > visibleCount && (
          <div className="text-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button onClick={onShowMore} className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition">
              عرض المزيد ({orders.length - visibleCount} متبقي)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
