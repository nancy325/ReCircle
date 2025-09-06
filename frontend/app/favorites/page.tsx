"use client"

import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { LoginPage } from "@/components/auth/login-page"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/currency"
import { Heart, ShoppingCart, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function FavoritesPage() {
  const { user, isLoading } = useAuth()
  const { products, favorites, addToCart, toggleFavorite, isFavorite, isInCart } = useData()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  // Get favorite products (excluding user's own products)
  const favoriteProducts = products.filter(product => 
    favorites.includes(product.id) && product.sellerId !== user?.id
  )

  const handleAddToCart = (product: any) => {
    addToCart(product)
  }

  const handleToggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(productId)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Favorites</h1>
        <p className="text-muted-foreground">
          {favoriteProducts.length === 0 
            ? "You haven't added any items to your favorites yet." 
            : `You have ${favoriteProducts.length} favorite item${favoriteProducts.length === 1 ? '' : 's'}.`
          }
        </p>
      </div>

      {/* Favorites Grid */}
      {favoriteProducts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">
            Start browsing products and add items you love to your favorites!
          </p>
          <Button asChild>
            <Link href="/">
              Browse Products
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={product.images && product.images.length > 0 ? product.images[0] : product.image}
                      alt={product.title}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
                  onClick={(e) => handleToggleFavorite(e, product.id)}
                >
                  <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                </Button>
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 left-2 bg-background/80 text-foreground"
                >
                  {product.condition}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    by {product.sellerName}
                  </span>
                </div>
                {product.brand && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Brand: {product.brand}
                  </p>
                )}
                {product.yearOfManufacture && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Year: {product.yearOfManufacture}
                  </p>
                )}
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <div className="flex gap-2 w-full">
                  {isInCart(product.id) ? (
                    <Button asChild size="sm" className="flex-1" variant="outline">
                      <Link href="/cart">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Go to Cart
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                  >
                    <Link href={`/chat/${product.id}-${product.sellerId}-${user.id}`}>
                      <MessageCircle className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
