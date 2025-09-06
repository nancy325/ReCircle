"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useData } from "@/contexts/data-context"
import { useAuth } from "@/contexts/auth-context"
import { MessageCircle, Search, Plus, Clock } from "lucide-react"
import { useState } from "react"

export function ChatList() {
  const { chats, products } = useData()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredChats = chats.filter(
    (chat) =>
      chat.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.participantName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
        <p className="text-muted-foreground">Connect with buyers and sellers</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chat List */}
      {filteredChats.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-6">
              Start chatting with sellers by visiting product pages and clicking "Message Seller"
            </p>
            <Button asChild>
              <Link href="/">
                <Plus className="h-4 w-4 mr-2" />
                Browse Products
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredChats.map((chat) => {
            const product = products.find((p) => p.id === chat.productId)
            const hasUnreadMessages = chat.messages.length > 0 // Simplified unread logic

            return (
              <Card key={chat.id} className="hover:shadow-md transition-shadow">
                <Link href={`/chat/${chat.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={chat.participantAvatar || "/placeholder.svg"} alt={chat.participantName} />
                        <AvatarFallback>{chat.participantName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{chat.participantName}</h3>
                            <p className="text-sm text-muted-foreground truncate">{chat.productTitle}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {hasUnreadMessages && <div className="w-2 h-2 bg-primary rounded-full" />}
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(chat.lastMessageTime)}
                            </span>
                          </div>
                        </div>

                        {/* Last Message */}
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate flex-1">
                            {chat.lastMessage || "No messages yet"}
                          </p>
                          {product && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              ${product.price}
                            </Badge>
                          )}
                        </div>

                        {/* Product Preview */}
                        {product && (
                          <div className="flex items-center gap-2 mt-3 p-2 bg-muted rounded-lg">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.title}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <span className="text-xs text-muted-foreground truncate">{product.title}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
