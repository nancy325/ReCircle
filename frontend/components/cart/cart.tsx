"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useData } from "@/contexts/data-context"
import { formatPrice, formatPriceWithDecimals } from "@/lib/currency"
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, CreditCard } from "lucide-react"
import { useState } from "react"

export function Cart() {
  const { cart, removeFromCart, addToCart, purchaseCart } = useData()
  const [isProcessing, setIsLoading] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.18 // 18% GST in India
  const total = subtotal + tax

  const handleQuantityChange = (productId: string, change: number) => {
    const item = cart.find((item) => item.product.id === productId)
    if (item) {
      if (change > 0) {
        addToCart(item.product)
      } else if (item.quantity > 1) {
        // For simplicity, we'll remove one item by removing and re-adding with quantity - 1
        removeFromCart(productId)
        for (let i = 0; i < item.quantity - 1; i++) {
          addToCart(item.product)
        }
      }
    }
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))
    purchaseCart()
    setIsLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">Review your items and proceed to checkout</p>
      </div>

      {cart.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Discover amazing second-hand finds and add them to your cart</p>
            <Button asChild size="lg">
              <Link href="/">
                <Plus className="h-4 w-4 mr-2" />
                Start Shopping
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Cart Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                          {item.product.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{item.product.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {item.product.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">by {item.product.sellerName}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <p className="text-lg font-bold text-primary">{formatPrice(item.product.price)}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product.id, -1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0 bg-transparent"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product.id, 1)}
                          className="h-8 w-8 p-0 bg-transparent"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>{formatPriceWithDecimals(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>{formatPriceWithDecimals(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatPriceWithDecimals(total)}</span>
                  </div>
                </div>

                <Button onClick={handleCheckout} className="w-full" size="lg" disabled={isProcessing}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Proceed to Checkout"}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  <p>Secure checkout powered by EcoFinds</p>
                  <p className="mt-1">Supporting sustainable consumption</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
