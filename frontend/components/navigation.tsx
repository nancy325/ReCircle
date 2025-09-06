"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { ShoppingCart, MessageCircle, Plus, User, LogOut, Leaf } from "lucide-react"

export function Navigation() {
  const { user, logout } = useAuth()
  const { cart } = useData()
  const pathname = usePathname()

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (!user && (pathname === "/login" || pathname === "/signup")) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Leaf className="h-6 w-6" />
            EcoFinds
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Browse
            </Link>
            <Link
              href="/my-listings"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/my-listings" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              My Listings
            </Link>
            <Link
              href="/chats"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/chats" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Messages
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button asChild size="sm" variant="outline">
              <Link href="/add-product">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>

            <Button asChild size="sm" variant="ghost" className="relative">
              <Link href="/cart">
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </Button>

            <Button asChild size="sm" variant="ghost">
              <Link href="/chats">
                <MessageCircle className="h-4 w-4" />
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.username} />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/purchases" className="flex items-center">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Purchase History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
