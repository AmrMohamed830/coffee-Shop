import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Order, OrderStatus } from "./types"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
}

interface OrderState {
  orders: Order[]
  products: Product[]
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  addProduct: (product: Product) => void
  removeProduct: (productId: string) => void
  updateProduct: (product: Product) => void
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      products: [
        {
          id: '101',
          name: 'بن يمني أصيل',
          price: 25,
          image: '/placeholder.svg',
          category: 'بن'
        },
        {
          id: '102',
          name: 'بن برازيلي محمص',
          price: 18,
          image: '/placeholder.svg',
          category: 'بن'
        },
        {
          id: '103',
          name: 'بن إثيوبي',
          price: 22,
          image: '/placeholder.svg',
          category: 'بن'
        }
      ],
      addOrder: (order) => set((state) => ({ orders: [...state.orders, { ...order, createdAt: new Date().toISOString() }] })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { 
              ...order, 
              status,
              completedAt: status === 'Completed' ? new Date().toISOString() : order.completedAt 
            } : order
          ),
        })),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      removeProduct: (productId) => set((state) => ({ products: state.products.filter((p) => p.id !== productId) })),
      updateProduct: (updatedProduct) => set((state) => ({ products: state.products.map((p) => p.id === updatedProduct.id ? updatedProduct : p) })),
    }),
    {
      name: "order-storage",
    },
  ),
)
