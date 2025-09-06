"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  username: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data - stored in localStorage for persistence
const getStoredUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("ecofinds-users")
  return stored
    ? JSON.parse(stored)
    : [
        { id: "1", username: "john_doe", email: "john@example.com", avatar: "/diverse-user-avatars.png" },
        { id: "2", username: "jane_smith", email: "jane@example.com", avatar: "/diverse-user-avatars.png" },
      ]
}

const saveUsers = (users: User[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ecofinds-users", JSON.stringify(users))
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("ecofinds-current-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem("ecofinds-current-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("ecofinds-current-user")
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = getStoredUsers()
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (foundUser && password === "password") {
      setUser(foundUser)
      setIsLoading(false)
      router.push("/") // Redirect to home after successful login
      return true
    }

    setIsLoading(false)
    return false
  }

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = getStoredUsers()

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setIsLoading(false)
      return false
    }

    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      setIsLoading(false)
      return false
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      avatar: "/diverse-user-avatars.png",
    }

    users.push(newUser)
    saveUsers(users)
    setUser(newUser)
    setIsLoading(false)
    router.push("/") // Redirect to home after successful signup
    return true
  }

  const logout = () => {
    setUser(null)
    router.push("/login") // Redirect to login after logout
  }

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)

      const users = getStoredUsers()
      const userIndex = users.findIndex((u) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        saveUsers(users)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
