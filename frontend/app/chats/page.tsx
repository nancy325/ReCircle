"use client"
import { ChatList } from "@/components/chat/chat-list"
import { AuthGuard } from "@/components/auth-guard"

export default function ChatsPage() {
  return (
    <AuthGuard>
      <ChatList />
    </AuthGuard>
  )
}
