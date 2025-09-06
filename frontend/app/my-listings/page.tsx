"use client"
import { MyListings } from "@/components/products/my-listings"
import { AuthGuard } from "@/components/auth-guard"

export default function MyListingsPage() {
  return (
    <AuthGuard>
      <MyListings />
    </AuthGuard>
  )
}
