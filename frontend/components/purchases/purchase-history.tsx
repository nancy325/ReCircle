"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useData } from "@/contexts/data-context"
import { useAuth } from "@/contexts/auth-context"
import { Package, Search, Calendar, ArrowLeft, MessageCircle, Star } from "lucide-react"
import { useState } from "react"

export function PurchaseHistory() {
  const { purchases, createChat } = useData()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPurchases = purchases.filter(
    (purchase) =>
      purchase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purchase.sellerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.price, 0)
  const categoryCounts = purchases.reduce(
    (acc, purchase) => {
      acc[purchase.category] = (acc[purchase.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const handleContactSeller = (purchase: any) => {
    if (user) {
      const chatId = createChat(purchase.id, purchase.sellerId, user.id)
      // Navigate to chat would go here
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Purchase History</h1>
        <p className="text-muted-foreground">Track your sustainable shopping journey</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{purchases.length}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">${totalSpent.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{Object.keys(categoryCounts).length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">${(totalSpent / Math.max(purchases.length, 1)).toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Avg. Order</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search your purchases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Purchase List */}
      {filteredPurchases.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              {purchases.length === 0 ? "No purchases yet" : "No matching purchases"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {purchases.length === 0
                ? "Start shopping to build your sustainable purchase history"
                : "Try adjusting your search terms"}
            </p>
            {purchases.length === 0 && (
              <Button asChild size="lg">
                <Link href="/">
                  <Package className="h-4 w-4 mr-2" />
                  Start Shopping
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPurchases.map((purchase, index) => (
            <Card key={`${purchase.id}-${index}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Product Image */}
                  <img
                    src={purchase.image || "/placeholder.svg"}
                    alt={purchase.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground line-clamp-1">{purchase.title}</h3>
                        <p className="text-sm text-muted-foreground">Sold by {purchase.sellerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">${purchase.price}</p>
                        <Badge variant="secondary" className="mt-1">
                          {purchase.category}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{purchase.description}</p>

                    {/* Order Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Purchased {new Date(purchase.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Delivered
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactSeller(purchase)}
                          className="bg-transparent"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact Seller
                        </Button>
                        <Button asChild variant="outline" size="sm" className="bg-transparent">
                          <Link href={`/product/${purchase.id}`}>View Product</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Environmental Impact */}
      {purchases.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-green-600">Your Environmental Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600">{purchases.length}</p>
                <p className="text-sm text-muted-foreground">Items Given New Life</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">{(purchases.length * 2.5).toFixed(1)}kg</p>
                <p className="text-sm text-muted-foreground">CO₂ Saved (estimated)</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">{purchases.length * 15}%</p>
                <p className="text-sm text-muted-foreground">Waste Reduction</p>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Thank you for choosing sustainable consumption and supporting the circular economy!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
