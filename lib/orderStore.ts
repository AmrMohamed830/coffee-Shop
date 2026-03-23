import { create } from "zustand"
import { db } from "../config/firebase"
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore"
import type { Order, OrderStatus, Product } from "@/lib/types"

interface OrderState {
  orders: Order[]
  products: Product[]
  customers: any[]
  initialized: boolean
  isProductsLoading: boolean
  initListener: () => void
  addOrder: (order: Order) => Promise<void>
  updateOrderStatus: (orderId: string, status: OrderStatus, user?: { uid: string; name: string }) => Promise<void>
  addProduct: (product: Omit<Product, 'id'> & { id?: string }) => Promise<void>
  removeProduct: (productId: string) => Promise<void>
  updateProduct: (product: Product) => Promise<void>
}

let unsubscribeOrders: (() => void) | null = null;
let unsubscribeProducts: (() => void) | null = null;

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  products: [],
  customers: [],
  initialized: false,
  isProductsLoading: true,

  initListener: () => {
    // Only initialize once
    if (get().initialized) return;
    if (typeof window === 'undefined') return;

    // Listen to Products
    const productsRef = collection(db, "products");
    unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        productsData.push({ ...doc.data(), id: doc.id } as Product);
      });
      set({ products: productsData, isProductsLoading: false });
    }, (error) => {
      console.error("Error fetching products:", error);
      set({ isProductsLoading: false });
    });

    // Listen to Orders
    const ordersRef = collection(db, "orders");
    unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
      const ordersData: Order[] = [];
      const customersMap = new Map();

      snapshot.forEach((doc) => {
        const orderData = { id: doc.id, ...doc.data() } as Order;
        ordersData.push(orderData);
        if (orderData.customer && orderData.customer.phone) {
          customersMap.set(orderData.customer.phone, orderData.customer);
        }
      });

      set({
        orders: ordersData,
        customers: Array.from(customersMap.values())
      });
    });

    set({ initialized: true });
  },

  addOrder: async (order) => {
    try {
      await setDoc(doc(db, "orders", order.id), {
        ...order,
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error adding order: ", e);
    }
  },

  updateOrderStatus: async (orderId, status, user) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const isCompleted = status === 'مكتمل';
      
      const updateData: any = {
        status,
        ...(isCompleted ? { completedAt: new Date().toISOString() } : {})
      };

      if (user) {
        updateData.statusHistory = arrayUnion({
          status,
          updatedAt: new Date().toISOString(),
          updatedBy: user
        });
      }

      await updateDoc(orderRef, updateData);
    } catch (e) {
      console.error("Error updating order status: ", e);
    }
  },

  addProduct: async (product) => {
    try {
      const docId = (product as any).id || doc(collection(db, "products")).id;
      await setDoc(doc(db, "products", docId), product);
    } catch (e) {
      console.error("Error adding product: ", e);
    }
  },

  removeProduct: async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
      // تحديث الحالة محلياً للحذف الفوري من الجدول
      set((state) => ({ products: state.products.filter(p => p.id !== productId) }));
    } catch (e: any) {
      console.error("Error removing product: ", e);
      if (typeof window !== 'undefined') alert(`فشل الحذف!\nالسبب: ${e.message}`);
    }
  },

  updateProduct: async (product) => {
    try {
      const productRef = doc(db, "products", product.id);
      // استبعاد الـ id من البيانات المرسلة للفايربيز لتجنب أخطاء التحديث
      const { id, ...dataToUpdate } = product;
      
      // تنظيف البيانات من أي قيم undefined لأن فايربيز يرفضها وتسبب فشل التعديل
      const sanitizedData = JSON.parse(JSON.stringify(dataToUpdate));
      await updateDoc(productRef, sanitizedData);

      // تحديث الحالة محلياً لظهور التعديل فوراً للمستخدم
      set((state) => ({
        products: state.products.map(p => p.id === product.id ? product : p)
      }));
    } catch (e: any) {
      console.error("Error updating product: ", e);
      if (typeof window !== 'undefined') alert(`فشل التعديل!\nالسبب: ${e.message}`);
    }
  },
}));
