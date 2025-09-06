"use client"
import { LoginPage } from "@/components/auth/login-page"
import { AuthGuard } from "@/components/auth-guard"

const login = async (email: string, password: string) => {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  // Save JWT token to context/localStorage if login is successful
};

export default function Login() {
  return (
    <AuthGuard requireAuth={false}>
      <LoginPage />
    </AuthGuard>
  )
}
