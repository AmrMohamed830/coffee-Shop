import React from 'react';
import { ShoppingCart, Coffee, Users } from 'lucide-react';

interface DashboardMetricsProps {
  activeOrdersCount: number;
  dailySales: number;
  uniqueCustomersCount: number;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ activeOrdersCount, dailySales, uniqueCustomersCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="admin-card flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-full text-blue-600"><ShoppingCart /></div>
        <div>
          <p className="text-sm font-bold text-[var(--admin-text)]">الطلبات النشطة</p>
          <h3 className="text-2xl font-bold text-[var(--admin-text)]">{activeOrdersCount}</h3>
        </div>
      </div>
      <div className="admin-card flex items-center gap-4">
        <div className="p-3 bg-green-100 rounded-full text-green-600"><Coffee /></div>
        <div>
          <p className="text-sm font-bold text-[var(--admin-text)]">المبيعات اليومية</p>
          <h3 className="text-2xl font-bold text-[var(--admin-text)]">{dailySales.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</h3>
        </div>
      </div>
      <div className="admin-card flex items-center gap-4">
        <div className="p-3 bg-purple-100 rounded-full text-purple-600"><Users /></div>
        <div>
          <p className="text-sm font-bold text-[var(--admin-text)]">إجمالي العملاء</p>
          <h3 className="text-2xl font-bold text-[var(--admin-text)]">{uniqueCustomersCount}</h3>
        </div>
      </div>
    </div>
  );
};
