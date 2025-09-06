"use client"
import { Cart } from "@/components/cart/cart"
import { AuthGuard } from "@/components/auth-guard"

export default function CartPage() {
  return (
    <AuthGuard>
      <Cart />
    </AuthGuard>
  )
}
