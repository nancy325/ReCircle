"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import {
  User,
  Package,
  ShoppingCart,
  MessageCircle,
  TrendingUp,
  Calendar,
  Edit3,
  Save,
  X,
  Plus,
  Eye,
} from "lucide-react"

export function UserDashboard() {
  const { user, updateProfile } = useAuth()
  const { products, cart, purchases, chats } = useData()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  })

  if (!user) return null

  const myProducts = products.filter((product) => product.sellerId === user.id)
  const totalValue = myProducts.reduce((sum, product) => sum + product.price, 0)
  const cartValue = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const purchaseValue = purchases.reduce((sum, product) => sum + product.price, 0)

  const handleSaveProfile = () => {
    updateProfile({
      username: editForm.username,
      email: editForm.email,
    })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditForm({
      username: user.username,
      email: user.email,
    })
    setIsEditing(false)
  }

  const recentProducts = myProducts.slice(0, 3)
  const recentChats = chats.slice(0, 3)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your profile and track your marketplace activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile
                </span>
                {!isEditing && (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar || "/diverse-user-avatars.png"} alt={user.username} />
                  <AvatarFallback className="text-2xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Badge variant="secondary">Active Member</Badge>
              </div>

              {/* Profile Information */}
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editForm.username}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} size="sm" className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1 bg-transparent">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Username</Label>
                    <p className="font-medium">{user.username}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Member Since</Label>
                    <p className="font-medium">January 2024</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Package className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{myProducts.length}</p>
                        <p className="text-xs text-muted-foreground">Listings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{purchases.length}</p>
                        <p className="text-xs text-muted-foreground">Purchases</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{chats.length}</p>
                        <p className="text-xs text-muted-foreground">Chats</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">${totalValue.toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">Listed Value</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button asChild className="h-auto p-4 flex-col gap-2">
                      <Link href="/add-product">
                        <Plus className="h-6 w-6" />
                        <span>Add Product</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
                      <Link href="/my-listings">
                        <Package className="h-6 w-6" />
                        <span>My Listings</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
                      <Link href="/chats">
                        <MessageCircle className="h-6 w-6" />
                        <span>Messages</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Listings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Listings
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/my-listings">View All</Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentProducts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No listings yet</p>
                      <Button asChild size="sm" className="mt-2">
                        <Link href="/add-product">Add Your First Product</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentProducts.map((product) => (
                        <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg border">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.title}</p>
                            <p className="text-sm text-muted-foreground">${product.price}</p>
                          </div>
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/product/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myProducts.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg border">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm">
                            Listed <span className="font-medium">{product.title}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {myProducts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No recent activity</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Selling Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Listings</span>
                      <span className="font-medium">{myProducts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Value</span>
                      <span className="font-medium">${totalValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Average Price</span>
                      <span className="font-medium">${(totalValue / Math.max(myProducts.length, 1)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Chats</span>
                      <span className="font-medium">{chats.length}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Buying Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Items in Cart</span>
                      <span className="font-medium">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cart Value</span>
                      <span className="font-medium">${cartValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Purchases</span>
                      <span className="font-medium">{purchases.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Purchase Value</span>
                      <span className="font-medium">${purchaseValue.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
