"use client"
import { useAuth } from "@/contexts/auth-context"
import { EditProduct } from "@/components/products/edit-product"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      redirect("/login")
    }
  }, [user])

  if (!user) return null

  return <EditProduct />
}
