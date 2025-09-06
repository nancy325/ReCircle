"use client"
import { LoginPage } from "@/components/auth/login-page"
import { AuthGuard } from "@/components/auth-guard"

export default function Login() {
  return (
    <AuthGuard requireAuth={false}>
      <LoginPage />
    </AuthGuard>
  )
}
