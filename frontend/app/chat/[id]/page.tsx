"use client"
import { useAuth } from "@/contexts/auth-context"
import { ChatDetail } from "@/components/chat/chat-detail"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function ChatDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      redirect("/login")
    }
  }, [user])

  if (!user) return null

  return <ChatDetail />
}
