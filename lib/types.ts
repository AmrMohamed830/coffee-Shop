export interface Size {
  name: string
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
  blendType: "سادة" | "محوج"
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
  sizes?: Size[] | Record<string, { price: number; images?: string[] }>
  description?: string
  categoryId?: string
  roastLevel?: string
  blendType?: "سادة" | "محوج"
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
  createdAt?: string | number | Date
  completedAt?: string | number | Date
}
