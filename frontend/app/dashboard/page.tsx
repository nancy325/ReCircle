"use client"
import { UserDashboard } from "@/components/user/user-dashboard"
import { AuthGuard } from "@/components/auth-guard"

export default function Dashboard() {
  return (
    <AuthGuard>
      <UserDashboard />
    </AuthGuard>
  )
}
