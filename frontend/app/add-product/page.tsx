"use client"
import { AddProduct } from "@/components/products/add-product"
import { AuthGuard } from "@/components/auth-guard"

export default function AddProductPage() {
  return (
    <AuthGuard>
      <AddProduct />
    </AuthGuard>
  )
}
