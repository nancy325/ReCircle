"use client"
import { useAuth } from "@/contexts/auth-context"
import { ProductDetail } from "@/components/products/product-detail"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      redirect("/login")
    }
  }, [user])

  if (!user) return null

  return <ProductDetail />
}
