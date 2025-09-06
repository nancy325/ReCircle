"use client"
import { PurchaseHistory } from "@/components/purchases/purchase-history"
import { AuthGuard } from "@/components/auth-guard"

export default function PurchasesPage() {
  return (
    <AuthGuard>
      <PurchaseHistory />
    </AuthGuard>
  )
}
