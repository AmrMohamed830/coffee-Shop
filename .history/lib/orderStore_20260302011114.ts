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
          id: '1',
          name: 'بن برازيلي',
          price: 220,
          image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80',
          category: 'بن سادة'
        },
        {
          id: '2',
          name: 'بن كولومبي',
          price: 280,
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
          category: 'بن سادة'
        },
        {
          id: '3',
          name: 'بن يمني',
          price: 350,
          image: 'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=800&q=80',
          category: 'بن محوج'
        },
        {
          id: '4',
          name: 'بن إثيوبي',
          price: 300,
          image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80',
          category: 'بن سادة'
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
