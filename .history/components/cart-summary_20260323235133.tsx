"use client"

import { useCartStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

export function CartSummary() {
  const { getTotal } = useCartStore()

  const subtotal = getTotal()

  const total = subtotal

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex justify-between">
        <span>الإجمالي الفرعي</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="border-t pt-4 flex justify-between font-bold text-xl text-[#b8682b]">
        <span>الإجمالي</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  )
}
