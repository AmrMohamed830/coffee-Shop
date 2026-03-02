import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Order, OrderStatus } from "./types"

interface OrderState {
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        })),
    }),
    {
      name: "order-storage",
    },
  ),
)
