import Link from "next/link"
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center">
                <Image
                  src="/LOGOOO.png"
                  alt="ReCircle Logo"
                  width={42}
                  height={42}
                  className="h-12 w-12"
                  priority
                />
              </div>
              <span className="text-xl font-bold text-foreground">ReCircle</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              India's premier sustainable marketplace for second-hand goods. Promoting circular economy and reducing
              waste through conscious consumption.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link
                  href="/add-product"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Sell Your Items
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/my-listings"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  My Listings
                </Link>
              </li>
              <li>
                <Link href="/purchases" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Purchase History
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/?category=Electronics"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=Clothes"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Clothing & Fashion
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=Furniture"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Furniture & Home
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=Books"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Books & Media
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=Sports"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Sports & Fitness
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">support@ReCircle.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  123 Green Street,
                  <br />
                  Eco Plaza, Mumbai,
                  <br />
                  Maharashtra 400001
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              © 2025 ReCircle. All rights reserved. <b>Made to create impact for a sustainable future.</b>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
