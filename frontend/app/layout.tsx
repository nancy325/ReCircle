import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { DataProvider } from "@/contexts/data-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "EcoFinds - Sustainable Marketplace",
  description: "Empowering sustainable consumption through a second-hand marketplace",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <DataProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Navigation />
              <main className="pt-16 flex-1">
                <Suspense fallback={null}>{children}</Suspense>
              </main>
              <Footer />
            </div>
          </DataProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
