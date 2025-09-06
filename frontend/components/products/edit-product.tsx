"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useData } from "@/contexts/data-context"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Save } from "lucide-react"

export function EditProduct() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { products, updateProduct } = useData()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    image: "",
  })

  const product = products.find((p) => p.id === id)
  const categories = ["Clothes", "Electronics", "Furniture"]

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        category: product.category,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
      })
    }
  }, [product])

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Button asChild variant="outline">
            <Link href="/my-listings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Listings
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (product.sellerId !== user?.id) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access denied</h1>
          <p className="text-muted-foreground mb-4">You can only edit your own products</p>
          <Button asChild variant="outline">
            <Link href="/my-listings">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Listings
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const updates = {
      title: formData.title,
      category: formData.category as "Clothes" | "Electronics" | "Furniture",
      description: formData.description,
      price: Number.parseFloat(formData.price),
      image: formData.image,
    }

    updateProduct(product.id, updates)
    setIsLoading(false)
    router.push("/my-listings")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid = formData.title && formData.category && formData.description && formData.price

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/my-listings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Listings
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Edit Product</h1>
        <p className="text-muted-foreground">Update your product details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Product Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Vintage Leather Jacket"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-8"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the condition, features, and any important details about your item..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
              />
            </div>

            {/* Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="space-y-4">
                {formData.image && (
                  <div className="aspect-square w-32 overflow-hidden rounded-lg border">
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Current product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Input
                  id="image"
                  type="url"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                <Link href="/my-listings">Cancel</Link>
              </Button>
              <Button type="submit" className="flex-1" disabled={!isFormValid || isLoading}>
                {isLoading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
