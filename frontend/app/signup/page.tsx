"use client"
import { SignupPage } from "@/components/auth/signup-page"
import { AuthGuard } from "@/components/auth-guard"

export default function Signup() {
  return (
    <AuthGuard requireAuth={false}>
      <SignupPage />
    </AuthGuard>
  )
}
