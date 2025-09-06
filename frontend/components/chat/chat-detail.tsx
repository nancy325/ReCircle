"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/contexts/data-context"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Send, ShoppingCart, Eye } from "lucide-react"

export function ChatDetail() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { chats, products, sendMessage, addToCart } = useData()
  const { user } = useAuth()
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chat = chats.find((c) => c.id === id)
  const product = chat ? products.find((p) => p.id === chat.productId) : null

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat?.messages])

  if (!chat || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Chat not found</h1>
          <Button asChild variant="outline">
            <Link href="/chats">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Messages
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && id) {
      sendMessage(id, message.trim(), user.id)
      setMessage("")
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
    }
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/chats">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Messages
          </Link>
        </Button>

        {/* Chat Header */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.participantAvatar || "/placeholder.svg"} alt={chat.participantName} />
                  <AvatarFallback>{chat.participantName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{chat.participantName}</h2>
                  <p className="text-sm text-muted-foreground">About: {chat.productTitle}</p>
                </div>
              </div>
              <Badge variant="secondary">Online</Badge>
            </div>

            {/* Product Info */}
            {product && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{product.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                    <p className="text-lg font-bold text-primary mt-1">${product.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="bg-transparent">
                      <Link href={`/product/${product.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Link>
                    </Button>
                    {product.sellerId !== user.id && (
                      <Button onClick={handleAddToCart} size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
        </Card>
      </div>

      {/* Messages */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {chat.messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              chat.messages.map((msg) => {
                const isOwnMessage = msg.senderId === user.id
                return (
                  <div key={msg.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? "text-primary-foreground/70" : "text-muted-foreground/70"
                        }`}
                      >
                        {formatMessageTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-4 justify-center">
        <Button asChild variant="outline" className="bg-transparent">
          <Link href={`/product/${product?.id}`}>View Product Details</Link>
        </Button>
        {product && product.sellerId !== user.id && <Button onClick={handleAddToCart}>Add to Cart</Button>}
      </div>
    </div>
  )
}
