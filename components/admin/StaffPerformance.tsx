import React from 'react';
import { Users } from 'lucide-react';

type StaffSale = {
  name: string;
  count: number;
  total: number;
};

interface StaffPerformanceProps {
  staffSalesList: StaffSale[];
  staffSalesRange: string;
  setStaffSalesRange: (range: 'today' | 'week' | 'month' | 'all') => void;
}

export const StaffPerformance: React.FC<StaffPerformanceProps> = ({ staffSalesList, staffSalesRange, setStaffSalesRange }) => {
  return (
    <div className="admin-card mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--admin-text)]">
          <Users size={20}/> أداء الموظفين (المبيعات)
        </h3>
        <div className="flex bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
          <button onClick={() => setStaffSalesRange('today')} className={`px-3 py-1 text-xs font-medium rounded-md transition ${staffSalesRange === 'today' ? 'bg-white dark:bg-zinc-700 shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}>اليوم</button>
          <button onClick={() => setStaffSalesRange('week')} className={`px-3 py-1 text-xs font-medium rounded-md transition ${staffSalesRange === 'week' ? 'bg-white dark:bg-zinc-700 shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}>هذا الأسبوع</button>
          <button onClick={() => setStaffSalesRange('month')} className={`px-3 py-1 text-xs font-medium rounded-md transition ${staffSalesRange === 'month' ? 'bg-white dark:bg-zinc-700 shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}>هذا الشهر</button>
          <button onClick={() => setStaffSalesRange('all')} className={`px-3 py-1 text-xs font-medium rounded-md transition ${staffSalesRange === 'all' ? 'bg-white dark:bg-zinc-700 shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}>الكل</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-[var(--admin-text)]">الموظف</th>
              <th className="py-3 px-4 text-[var(--admin-text)]">الطلبات المكتملة</th>
              <th className="py-3 px-4 text-[var(--admin-text)]">إجمالي المبيعات</th>
            </tr>
          </thead>
          <tbody>
            {staffSalesList.length > 0 ? staffSalesList.map((staff, index) => (
              <tr key={index} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
                <td className="py-4 px-4 text-[var(--admin-text)] font-medium flex items-center gap-2 break-all">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {staff.name.charAt(0)}
                  </div>
                  {staff.name}
                </td>
                <td className="py-4 px-4 text-[var(--admin-text)] break-all">{staff.count}</td>
                <td className="py-4 px-4 text-[var(--admin-text)] font-bold text-green-600">{staff.total.toLocaleString('ar-EG', { numberingSystem: 'latn',  style: 'currency', currency: 'EGP' }).replace('ج.م.', 'ج.م')}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className="py-8 text-center text-muted-foreground">لا توجد بيانات متاحة</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
