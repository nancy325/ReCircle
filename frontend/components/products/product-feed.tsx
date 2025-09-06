"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/contexts/data-context"
import { formatPrice } from "@/lib/currency"
import { Search, Filter, Plus, Leaf, Recycle, Heart, TrendingUp } from "lucide-react"

export function ProductFeed() {
  const { products, searchProducts, addToCart, toggleFavorite, isFavorite } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const filteredProducts = useMemo(() => {
    return searchProducts(searchQuery, selectedCategory === "All" ? undefined : selectedCategory)
  }, [searchProducts, searchQuery, selectedCategory])

  const categories = [
    { name: "All", image: "/all-categories-grid.jpg", icon: "🏪" },
    { name: "Clothes", image: "/vintage-clothing-fashion.jpg", icon: "👕" },
    { name: "Electronics", image: "/electronic-devices-gadgets.jpg", icon: "📱" },
    { name: "Furniture", image: "/wooden-furniture-vintage.jpg", icon: "🪑" },
    { name: "Books", image: "/stack-of-books-library.jpg", icon: "📚" },
    { name: "Sports", image: "/sports-equipment-fitness.jpg", icon: "⚽" },
    { name: "Home", image: "/home-decor-accessories.png", icon: "🏠" },
    { name: "Toys", image: "/children-toys-games.jpg", icon: "🧸" },
  ]

  const handleAddToCart = (product: any) => {
    addToCart(product)
  }

  const handleToggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(productId)
  }

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName)
  }

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products")
    const data = await res.json()
    return data
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <div className="relative mb-8 rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 p-8 md:p-12">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-primary">Sustainable Shopping</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Give Pre-loved Items a New Life
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl text-pretty">
            Discover quality second-hand treasures while reducing waste and saving money. Join our eco-friendly
            marketplace today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/add-product">
                <Plus className="h-5 w-5 mr-2" />
                Start Selling
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/favorites">
                <Heart className="h-5 w-5 mr-2" />
                Browse Favorites
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute top-4 right-4 opacity-10">
          <Recycle className="h-32 w-32" />
        </div>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">1000+</div>
            <div className="text-sm text-muted-foreground">Items Sold</div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/5 border-secondary/20">
          <CardContent className="p-6 text-center">
            <Recycle className="h-8 w-8 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">500kg</div>
            <div className="text-sm text-muted-foreground">Waste Reduced</div>
          </CardContent>
        </Card>
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">2500+</div>
            <div className="text-sm text-muted-foreground">Happy Users</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter Squares */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Shop by Category</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategorySelect(category.name)}
              className={`group relative aspect-square rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 ${
                selectedCategory === category.name ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-10" />
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white">
                <span className="text-2xl mb-1 drop-shadow-lg">{category.icon}</span>
                <span className="text-xs font-semibold text-center px-1 drop-shadow-md text-white">
                  {category.name}
                </span>
              </div>
              {selectedCategory === category.name && <div className="absolute inset-0 bg-primary/20 z-30 rounded-xl" />}
            </button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Discover Sustainable Finds</h1>
        <p className="text-muted-foreground">Browse quality second-hand items and give them a new life</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
            <Link href="/add-product">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No products found</p>
            <p className="text-sm">Try adjusting your search or browse all categories</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/add-product">Be the first to add a product</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
              <Link href={`/product/${product.id}`}>
                <div className="aspect-square overflow-hidden rounded-t-lg relative">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <button
                    onClick={(e) => handleToggleFavorite(e, product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                      }`}
                    />
                  </button>
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                </div>
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>by {product.sellerName}</span>
                  <span>•</span>
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex gap-2 w-full">
                  <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Link href={`/product/${product.id}`}>View Details</Link>
                  </Button>
                  <Button onClick={() => handleAddToCart(product)} size="sm" className="flex-1">
                    Add to Cart
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
