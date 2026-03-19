export interface Size {
  name: "50g" | "100g" | "250g"
  price: number
  images: string[]
}

export interface FoodItem {
  id: string
  name: string
  description: string
  categoryId: string
  featured: boolean
  sizes: Size[]
  roastLevel: "فاتح" | "وسط" | "غامق (محروق)"
}

export interface OrderItem extends FoodItem {
  quantity: number
  size: Size["name"]
  price: number
}

export interface Product {
  id: string
  name: string
  price: number
  image?: string
  category: string
  sizes?: any
  description?: string
  categoryId?: string
  roastLevel?: string
}

export interface Category {
  id: string
  name: string
}

export type OrderStatus = "جديد" | "قيد التنفيذ" | "جاري الشحن" | "مكتمل";

export interface Order {
  id: string
  customer: {
    firstName: string
    lastName: string
    phone: string
    address: string
    notes?: string
  }
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt?: string | Date
  completedAt?: string | Date
}
