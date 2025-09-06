"use client"

import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useData } from "@/contexts/data-context"
import { useAuth } from "@/contexts/auth-context"
import { formatPrice } from "@/lib/currency"
import { ImageSlider } from "@/components/ui/image-slider"
import {
  ArrowLeft,
  MessageCircle,
  ShoppingCart,
  Calendar,
  User,
  Package,
  Ruler,
  Weight,
  Palette,
  CheckCircle,
  XCircle,
  Heart,
} from "lucide-react"

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { products, addToCart, createChat, toggleFavorite, isFavorite, isInCart } = useData()
  const { user } = useAuth()

  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product)
  }

  const handleToggleFavorite = () => {
    toggleFavorite(product.id)
  }

  const handleMessageSeller = () => {
    if (user && product.sellerId !== user.id) {
      const chatId = createChat(product.id, product.sellerId, user.id)
      router.push(`/chat/${chatId}`)
    }
  }

  const isOwnProduct = user?.id === product.sellerId

  const images = product.images && product.images.length > 0 ? product.images : [product.image || "/placeholder.svg"]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <ImageSlider images={images} alt={product.title} />
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <Badge variant="secondary">{product.category}</Badge>
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">{product.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <Separator />

          {/* Seller Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/diverse-user-avatars.png" alt={product.sellerName} />
                  <AvatarFallback>{product.sellerName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{product.sellerName}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Listed {new Date(product.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isOwnProduct && (
              <>
                {isInCart(product.id) ? (
                  <Button asChild size="lg" className="w-full" variant="outline">
                    <Link href="/cart">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Go to Cart
                    </Link>
                  </Button>
                ) : (
                  <Button onClick={handleAddToCart} size="lg" className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleMessageSeller} variant="outline" size="lg" className="flex-1 bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Seller
                  </Button>
                  <Button 
                    onClick={handleToggleFavorite} 
                    variant="outline" 
                    size="lg"
                    className="px-3"
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                      }`} 
                    />
                  </Button>
                </div>
              </>
            )}
            {isOwnProduct && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-sm">This is your listing</span>
                </div>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condition</span>
                    <span className="font-medium">{product.condition || "Good"}</span>
                  </div>
                  {product.brand && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Brand</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                  )}
                  {product.model && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model</span>
                      <span className="font-medium">{product.model}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {product.yearOfManufacture && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Year</span>
                      <span className="font-medium">{product.yearOfManufacture}</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Color</span>
                      <div className="flex items-center gap-2">
                        <Palette className="h-3 w-3" />
                        <span className="font-medium">{product.color}</span>
                      </div>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Material</span>
                      <span className="font-medium">{product.material}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Listed</span>
                    <span className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Dimensions and Weight */}
              {(product.dimensions?.length ||
                product.dimensions?.width ||
                product.dimensions?.height ||
                product.weight) && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      Dimensions & Weight
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {product.dimensions && (
                        <div className="space-y-2">
                          {product.dimensions.length && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Length</span>
                              <span className="font-medium">{product.dimensions.length} cm</span>
                            </div>
                          )}
                          {product.dimensions.width && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Width</span>
                              <span className="font-medium">{product.dimensions.width} cm</span>
                            </div>
                          )}
                          {product.dimensions.height && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Height</span>
                              <span className="font-medium">{product.dimensions.height} cm</span>
                            </div>
                          )}
                        </div>
                      )}
                      {product.weight && (
                        <div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Weight className="h-3 w-3" />
                              Weight
                            </span>
                            <span className="font-medium">{product.weight} kg</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Package & Condition Details */}
              {(product.originalPackaging !== undefined ||
                product.manualIncluded !== undefined ||
                product.workingConditionDescription) && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Package & Condition
                    </h4>
                    <div className="space-y-2">
                      {product.originalPackaging !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Original Packaging</span>
                          <div className="flex items-center gap-1">
                            {product.originalPackaging ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">{product.originalPackaging ? "Yes" : "No"}</span>
                          </div>
                        </div>
                      )}
                      {product.manualIncluded !== undefined && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Manual/Instructions</span>
                          <div className="flex items-center gap-1">
                            {product.manualIncluded ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">{product.manualIncluded ? "Included" : "Not Included"}</span>
                          </div>
                        </div>
                      )}
                      {product.workingConditionDescription && (
                        <div className="mt-3">
                          <span className="text-muted-foreground text-sm">Working Condition:</span>
                          <p className="text-sm mt-1 p-2 bg-muted rounded">{product.workingConditionDescription}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
