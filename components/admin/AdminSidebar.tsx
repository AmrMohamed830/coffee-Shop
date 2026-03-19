import React from 'react';
import { BarChart3, ShoppingCart, Package, Users, UserCog, LogOut } from 'lucide-react';

interface AdminSidebarProps {
  userRole: 'admin' | 'staff' | undefined | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const navItems = [
    { name: 'dashboard', label: 'الإحصائيات', icon: BarChart3, role: 'admin' },
    { name: 'orders', label: 'الطلبات', icon: ShoppingCart, role: 'staff' },
    { name: 'products', label: 'المنتجات', icon: Package, role: 'admin' },
    { name: 'customers', label: 'العملاء', icon: Users, role: 'admin' },
    { name: 'staff', label: 'الموظفين', icon: UserCog, role: 'admin' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ userRole, activeTab, setActiveTab, onLogout }) => {
  return (
    <aside className="admin-sidebar w-full md:w-64 p-6 space-y-8 text-white">
      <h1 className="text-2xl font-bold border-b border-white/20 pb-4">لوحة التحكم</h1>
      <nav className="space-y-4">
        {navItems.map(item => {
            if (userRole === 'admin' || item.role === 'staff') {
                const Icon = item.icon;
                return (
                    <button 
                      key={item.name} 
                      onClick={() => setActiveTab(item.name)} 
                      className={`flex items-center gap-3 w-full p-2 rounded transition ${activeTab === item.name ? 'bg-white/20 font-bold' : 'hover:bg-white/10'}`}
                    >
                        <Icon size={20}/> {item.label}
                    </button>
                )
            }
            return null;
        })}
      </nav>
      <div className="pt-8 border-t border-white/20 mt-8 space-y-3">
        <button onClick={onLogout} className="flex items-center gap-3 w-full p-2 rounded transition text-red-300 hover:bg-white/10 hover:text-red-400">
          <LogOut size={20}/> تسجيل الخروج
        </button>
      </div>
    </aside>
  );
};
