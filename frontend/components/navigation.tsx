"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useData } from "@/contexts/data-context"
import { ShoppingCart, MessageCircle, Plus, User, LogOut, Leaf } from "lucide-react"

import Image from 'next/image';


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
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            {/* LOGO */}
            <Image
              src="/LOGOOO.png"
              alt="ReCircle Logo"
              width={42}
              height={42}
              className="h-12 w-12"
              priority
            />
            ReCircle
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/" ? "text-primary" : "text-muted-foreground"
                }`}
            >
              Browse
            </Link>
            <Link
              href="/my-listings"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/my-listings" ? "text-primary" : "text-muted-foreground"
                }`}
            >
              My Listings
            </Link>
            <Link
              href="/chats"
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/chats" ? "text-primary" : "text-muted-foreground"
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
              <DropdownMenuTrigger className="h-8 w-8 rounded-full bg-transparent hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                <User className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
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
