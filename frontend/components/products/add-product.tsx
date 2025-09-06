"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useData } from "@/contexts/data-context"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft, Upload, Plus } from "lucide-react"

export function AddProduct() {
  const router = useRouter()
  const { addProduct } = useData()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    image: "",
    quantity: "1",
    condition: "",
    yearOfManufacture: "",
    brand: "",
    model: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    material: "",
    color: "",
    originalPackaging: false,
    manualIncluded: false,
    workingConditionDescription: "",
  })

  const categories = ["Clothes", "Electronics", "Furniture"]
  const conditions = ["New", "Like New", "Good", "Fair", "Poor"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    const productData = {
      title: formData.title,
      category: formData.category as "Clothes" | "Electronics" | "Furniture",
      description: formData.description,
      price: Number.parseFloat(formData.price),
      image: formData.image || "/product-placeholder.png",
      sellerId: user.id,
      sellerName: user.username,
      quantity: Number.parseInt(formData.quantity) || 1,
      condition: formData.condition as "New" | "Like New" | "Good" | "Fair" | "Poor",
      yearOfManufacture: formData.yearOfManufacture ? Number.parseInt(formData.yearOfManufacture) : undefined,
      brand: formData.brand || undefined,
      model: formData.model || undefined,
      dimensions: {
        length: formData.length ? Number.parseFloat(formData.length) : undefined,
        width: formData.width ? Number.parseFloat(formData.width) : undefined,
        height: formData.height ? Number.parseFloat(formData.height) : undefined,
      },
      weight: formData.weight ? Number.parseFloat(formData.weight) : undefined,
      material: formData.material || undefined,
      color: formData.color || undefined,
      originalPackaging: formData.originalPackaging,
      manualIncluded: formData.manualIncluded,
      workingConditionDescription: formData.workingConditionDescription || undefined,
    }

    addProduct(productData)
    setIsLoading(false)
    router.push("/my-listings")
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isFormValid =
    formData.title && formData.category && formData.description && formData.price && formData.condition

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Add New Product</h1>
        <p className="text-muted-foreground">List your item and give it a new life with someone who needs it</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Product Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

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

              {/* Price and Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (INR) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="price"
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0"
                      className="pl-8"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Specifications</h3>

              {/* Brand and Model */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Apple, Nike, IKEA"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="e.g., iPhone 13, Air Max 90"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                  />
                </div>
              </div>

              {/* Year of Manufacture */}
              <div className="space-y-2">
                <Label htmlFor="yearOfManufacture">Year of Manufacture</Label>
                <Input
                  id="yearOfManufacture"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="e.g., 2020"
                  value={formData.yearOfManufacture}
                  onChange={(e) => handleInputChange("yearOfManufacture", e.target.value)}
                />
              </div>

              {/* Dimensions */}
              <div className="space-y-2">
                <Label>Dimensions (cm)</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Length"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.length}
                    onChange={(e) => handleInputChange("length", e.target.value)}
                  />
                  <Input
                    placeholder="Width"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.width}
                    onChange={(e) => handleInputChange("width", e.target.value)}
                  />
                  <Input
                    placeholder="Height"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                  />
                </div>
              </div>

              {/* Weight, Material, Color */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g., 1.5"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    placeholder="e.g., Cotton, Metal, Wood"
                    value={formData.material}
                    onChange={(e) => handleInputChange("material", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    placeholder="e.g., Black, Red, Blue"
                    value={formData.color}
                    onChange={(e) => handleInputChange("color", e.target.value)}
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="originalPackaging"
                    checked={formData.originalPackaging}
                    onCheckedChange={(checked: boolean) => handleInputChange("originalPackaging", checked)}
                  />
                  <Label htmlFor="originalPackaging">Original Packaging Included</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="manualIncluded"
                    checked={formData.manualIncluded}
                    onCheckedChange={(checked: boolean) => handleInputChange("manualIncluded", checked)}
                  />
                  <Label htmlFor="manualIncluded">Manual/Instructions Included</Label>
                </div>
              </div>

              {/* Working Condition Description */}
              <div className="space-y-2">
                <Label htmlFor="workingConditionDescription">Working Condition Description</Label>
                <Textarea
                  id="workingConditionDescription"
                  placeholder="Describe any defects, wear, or special notes about the item's functionality..."
                  rows={3}
                  value={formData.workingConditionDescription}
                  onChange={(e) => handleInputChange("workingConditionDescription", e.target.value)}
                />
              </div>
            </div>

            {/* Image Upload Placeholder */}
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">Upload product photos</p>
                <p className="text-xs text-muted-foreground">For demo purposes, a placeholder image will be used</p>
                <Input
                  id="image"
                  type="url"
                  placeholder="Or paste image URL (optional)"
                  className="mt-4"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                <Link href="/">Cancel</Link>
              </Button>
              <Button type="submit" className="flex-1" disabled={!isFormValid || isLoading}>
                {isLoading ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Tips for a Great Listing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Use clear, descriptive titles that highlight key features</p>
          <p>• Be honest about the condition and any flaws</p>
          <p>• Include multiple photos from different angles</p>
          <p>• Fill in as many details as possible to build buyer confidence</p>
          <p>• Price competitively by checking similar items</p>
          <p>• Respond promptly to buyer messages</p>
        </CardContent>
      </Card>
    </div>
  )
}

const addProduct = async (product: any, token: string) => {
  const res = await fetch('http://localhost:5000/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  return await res.json();
};
