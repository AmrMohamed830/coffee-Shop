import React from 'react';
import { Package, Search, Edit, Trash2, Save, X } from 'lucide-react';
import type { Product } from '@/lib/types';

interface ProductsListProps {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  editingId: string | null;
  editForm: { name: string; price: number; sizes: { [key: string]: number } };
  setEditForm: React.Dispatch<React.SetStateAction<{ name: string; price: number; sizes: { [key: string]: number } }>>;
  startEditing: (product: Product) => void;
  cancelEditing: () => void;
  saveEditing: (product: Product) => void;
  removeProduct: (id: string) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  products,
  searchTerm,
  setSearchTerm,
  editingId,
  editForm,
  setEditForm,
  startEditing,
  cancelEditing,
  saveEditing,
  removeProduct,
}) => {
  const filteredProducts = products.filter((p: Product) => p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-card overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--admin-text)]">
          <Package size={20}/> قائمة المنتجات
        </h3>
        <div className="relative w-full md:w-64">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
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
          {filteredProducts.length > 0 ? filteredProducts.map((product: Product) => (
            <tr key={product.id} className="border-b hover:bg-black/5 dark:hover:bg-white/5 transition">
              <td className="py-4 px-4"><img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" /></td>
              <td className="py-4 px-4 font-medium text-[var(--admin-text)] break-all">
                {editingId === product.id ? (
                  <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="border rounded p-1 w-full text-[var(--admin-text)]"/>
                ) : product.name}
              </td>
              <td className="py-4 px-4 text-[var(--admin-text)] break-all">
                {editingId === product.id ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2"><span className="text-xs w-8 font-bold">50g:</span><input type="number" value={editForm.sizes['50g'] === 0 ? '' : editForm.sizes['50g']} onChange={(e) => setEditForm({...editForm, sizes: {...editForm.sizes, '50g': Number(e.target.value)}})} className="border rounded p-1 w-20 text-[var(--admin-text)] text-sm"/></div>
                    <div className="flex items-center gap-2"><span className="text-xs w-8 font-bold">100g:</span><input type="number" value={editForm.sizes['100g'] === 0 ? '' : editForm.sizes['100g']} onChange={(e) => setEditForm({...editForm, sizes: {...editForm.sizes, '100g': Number(e.target.value)}})} className="border rounded p-1 w-20 text-[var(--admin-text)] text-sm"/></div>
                    <div className="flex items-center gap-2"><span className="text-xs w-8 font-bold">250g:</span><input type="number" value={editForm.sizes['250g'] === 0 ? '' : editForm.sizes['250g']} onChange={(e) => setEditForm({...editForm, sizes: {...editForm.sizes, '250g': Number(e.target.value)}})} className="border rounded p-1 w-20 text-[var(--admin-text)] text-sm"/></div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 text-sm">
                    {product.sizes && typeof product.sizes === 'object' && !Array.isArray(product.sizes) ? (
                      <>
                        {Number(product.sizes['50g']?.price) > 0 && <div><span className="text-xs text-gray-500">50g:</span> {Number(product.sizes['50g']?.price).toLocaleString('ar-EG', { numberingSystem: 'latn',  style: 'currency', currency: 'EGP' }).replace('ج.م.', 'ج.م')}</div>}
                        {Number(product.sizes['100g']?.price) > 0 && <div><span className="text-xs text-gray-500">100g:</span> {Number(product.sizes['100g']?.price).toLocaleString('ar-EG', { numberingSystem: 'latn',  style: 'currency', currency: 'EGP' }).replace('ج.م.', 'ج.م')}</div>}
                        {Number(product.sizes['250g']?.price) > 0 && <div><span className="text-xs text-gray-500">250g:</span> {Number(product.sizes['250g']?.price).toLocaleString('ar-EG', { numberingSystem: 'latn',  style: 'currency', currency: 'EGP' }).replace('ج.م.', 'ج.م')}</div>}
                      </>
                    ) : (Number(product.price).toLocaleString('ar-EG', { numberingSystem: 'latn',  style: 'currency', currency: 'EGP' }).replace('ج.م.', 'ج.م'))}
                  </div>
                )}
              </td>
              <td className="py-4 px-4 text-[var(--admin-text)] break-all">{product.category}</td>
              <td className="py-4 px-4 flex gap-2">
                {editingId === product.id ? (
                  <>
                    <button onClick={() => saveEditing(product)} className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200 transition" title="حفظ"><Save size={18} /></button>
                    <button onClick={cancelEditing} className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition" title="إلغاء"><X size={18} /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(product)} className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition" title="تعديل"><Edit size={18} /></button>
                    <button onClick={() => { if (window.confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) { removeProduct(product.id) } }} className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition" title="حذف المنتج"><Trash2 size={18} /></button>
                  </>
                )}
              </td>
            </tr>
          )) : (
            <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">لا توجد منتجات مطابقة للبحث</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
