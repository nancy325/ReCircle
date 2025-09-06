"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useData } from "@/contexts/data-context"
import { useAuth } from "@/contexts/auth-context"
import { formatPrice, formatPriceWithDecimals } from "@/lib/currency"
import { Plus, Edit, Trash2, Eye } from "lucide-react"

export function MyListings() {
  const { products, deleteProduct } = useData()
  const { user } = useAuth()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const myProducts = products.filter((product) => product.sellerId === user?.id)

  const handleDelete = async (productId: string) => {
    setDeletingId(productId)
    deleteProduct(productId)
    setDeletingId(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Listings</h1>
          <p className="text-muted-foreground">Manage your products and track their performance</p>
        </div>
        <Button asChild>
          <Link href="/add-product">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">{myProducts.length}</div>
            <p className="text-sm text-muted-foreground">Total Listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">
              {formatPriceWithDecimals(myProducts.reduce((sum, product) => sum + product.price, 0))}
            </div>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-primary">
              {formatPriceWithDecimals(
                myProducts.reduce((sum, product) => sum + product.price, 0) / Math.max(myProducts.length, 1),
              )}
            </div>
            <p className="text-sm text-muted-foreground">Average Price</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      {myProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-6">
            <Plus className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
            <p className="text-sm">Start selling by adding your first product</p>
          </div>
          <Button asChild size="lg">
            <Link href="/add-product">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myProducts.map((product) => (
            <Card key={product.id} className="group">
              <div className="aspect-square overflow-hidden rounded-t-lg">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                </div>
                <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{product.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                <div className="text-xs text-muted-foreground">
                  Listed {new Date(product.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex gap-2 w-full">
                  <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Link href={`/product/${product.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Link href={`/edit-product/${product.id}`}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{product.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deletingId === product.id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
