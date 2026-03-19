import React from 'react';
import { Users } from 'lucide-react';
import type { Order } from '@/lib/types';

interface CustomersListProps {
  customers: Order['customer'][];
}

export const CustomersList: React.FC<CustomersListProps> = ({ customers }) => {
  return (
    <div className="admin-card overflow-x-auto">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--admin-text)]">
        <Users size={20}/> قاعدة العملاء
      </h3>
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
          {customers.map((customer, index) => (
            <tr key={index} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
              <td className="py-4 px-4 text-[var(--admin-text)] break-all">{customer.firstName} {customer.lastName}</td>
              <td className="py-4 px-4 text-[var(--admin-text)] break-all">{customer.phone}</td>
              <td className="py-4 px-4 text-[var(--admin-text)] break-all">{customer.address}</td>
              <td className="py-4 px-4 text-[var(--admin-text)] break-all">{customer.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
