"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, ShoppingBag, Users, Star, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{
          backgroundImage: `url('/minimal-eco-background.jpg')`,
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-white/20 via-white/15 to-white/20" />

      {/* Content */}
      <div className="relative z-10">
        <header className="border-b border-border/30 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/recircle-logo-final.png" alt="reCircle Logo" className="w-8 h-8" />
              <span className="text-2xl font-bold text-foreground">reCircle</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => scrollToSection("features")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("impact")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Impact
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Reviews
              </button>
            </nav>
            <div className="flex items-center space-x-3">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <Badge className="mb-6 bg-accent/20 text-accent-foreground border-accent/30">
              🌱 Sustainable Shopping Made Simple
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Shop Sustainably with{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-extrabold">
                  reCircle
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full"></span>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Discover eco-friendly products, support sustainable brands, and make a positive impact on our planet. Join
              thousands of conscious consumers choosing a better future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Start Shopping <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Carbon Neutral Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Verified Sustainable Brands</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Impact Tracking</span>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-4 bg-white/40 backdrop-blur-md">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose reCircle?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're more than just a marketplace. We're your partner in creating a sustainable future.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-card-foreground">Curated Eco Products</CardTitle>
                  <CardDescription>
                    Every product is carefully vetted for sustainability, quality, and environmental impact.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-card-foreground">Community Driven</CardTitle>
                  <CardDescription>
                    Join a community of conscious consumers sharing reviews, tips, and sustainable living advice.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary/30 rounded-lg flex items-center justify-center mb-4">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-card-foreground">Impact Tracking</CardTitle>
                  <CardDescription>
                    See the real environmental impact of your purchases with detailed sustainability metrics.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="impact" className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                <div className="text-muted-foreground">Products Sold</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground">Sustainable Brands</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">2.5M</div>
                <div className="text-muted-foreground">lbs CO₂ Saved</div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 px-4 bg-white/40 backdrop-blur-md">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start your sustainable shopping journey in three simple steps.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-border bg-card text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <CardTitle className="text-card-foreground">Browse & Discover</CardTitle>
                  <CardDescription>
                    Explore our curated collection of sustainable products from verified eco-friendly brands.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border bg-card text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-accent">2</span>
                  </div>
                  <CardTitle className="text-card-foreground">Shop Consciously</CardTitle>
                  <CardDescription>
                    Make informed choices with detailed sustainability ratings and environmental impact data.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-border bg-card text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <CardTitle className="text-card-foreground">Track Your Impact</CardTitle>
                  <CardDescription>
                    See the positive environmental impact of your purchases and share your journey with the community.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 px-4 bg-white/50 backdrop-blur-md">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Our Community Says</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-card-foreground mb-4">
                    "reCircle has completely changed how I shop. I love knowing that every purchase makes a positive
                    impact."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-full" />
                    <div>
                      <div className="font-semibold text-card-foreground">Sarah Chen</div>
                      <div className="text-sm text-muted-foreground">Eco Enthusiast</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-card-foreground mb-4">
                    "The quality of products is amazing, and I feel good about supporting sustainable brands."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-full" />
                    <div>
                      <div className="font-semibold text-card-foreground">Marcus Johnson</div>
                      <div className="text-sm text-muted-foreground">Green Living Advocate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-card-foreground mb-4">
                    "Finally, a marketplace that aligns with my values. The impact tracking feature is brilliant!"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-full" />
                    <div>
                      <div className="font-semibold text-card-foreground">Emma Rodriguez</div>
                      <div className="text-sm text-muted-foreground">Sustainability Blogger</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Make a Difference?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of conscious consumers who are already shopping sustainably with reCircle.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Start Your Sustainable Journey <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        <footer className="border-t border-border/30 bg-white/90 backdrop-blur-xl py-12 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <img src="/recircle-logo-final.png" alt="reCircle Logo" className="w-8 h-8" />
                  <span className="text-xl font-bold text-sidebar-foreground">reCircle</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Making sustainable shopping accessible to everyone, one purchase at a time.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sidebar-foreground mb-4">Shop</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-sidebar-foreground transition-colors">
                      All Products
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-sidebar-foreground transition-colors">
                      New Arrivals
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-sidebar-foreground transition-colors">
                      Best Sellers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-sidebar-foreground transition-colors">
                      Sale
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sidebar-foreground mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-sidebar-foreground transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-sidebar-foreground transition-colors">
                      Our Mission
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-sidebar-foreground transition-colors">
                      Sustainability
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-sidebar-foreground transition-colors">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sidebar-foreground mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-sidebar-foreground transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-sidebar-foreground transition-colors">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-sidebar-foreground transition-colors">
                      Shipping Info
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-sidebar-foreground transition-colors">
                      Returns
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-sidebar-border mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 reCircle. All rights reserved. Built with sustainability in mind.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
