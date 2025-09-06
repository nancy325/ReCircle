"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Product {
  id: string
  title: string
  price: number
  description: string
  category: "Clothes" | "Electronics" | "Furniture"
  image: string
  sellerId: string
  sellerName: string
  createdAt: string
  // New comprehensive fields
  quantity: number
  condition: "New" | "Like New" | "Good" | "Fair" | "Poor"
  yearOfManufacture?: number
  brand?: string
  model?: string
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  weight?: number
  material?: string
  color?: string
  originalPackaging: boolean
  manualIncluded: boolean
  workingConditionDescription?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  productId: string
  message: string
  timestamp: string
}

export interface Chat {
  id: string
  productId: string
  productTitle: string
  participantId: string
  participantName: string
  participantAvatar: string
  lastMessage: string
  lastMessageTime: string
  messages: ChatMessage[]
}

interface DataContextType {
  products: Product[]
  cart: CartItem[]
  purchases: Product[]
  chats: Chat[]
  favorites: string[]
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  purchaseCart: () => void
  sendMessage: (chatId: string, message: string, senderId: string) => void
  createChat: (productId: string, sellerId: string, buyerId: string) => string
  searchProducts: (query: string, category?: string) => Product[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    title: "Vintage Leather Jacket",
    price: 89.99,
    description: "Genuine leather jacket in excellent condition. Perfect for fall weather.",
    category: "Clothes",
    image: "/vintage-leather-jacket.png",
    sellerId: "2",
    sellerName: "jane_smith",
    createdAt: "2024-01-15T10:00:00Z",
    quantity: 1,
    condition: "Good",
    yearOfManufacture: 2018,
    brand: "Vintage Co.",
    material: "Genuine Leather",
    color: "Brown",
    originalPackaging: false,
    manualIncluded: false,
    workingConditionDescription: "Minor wear on sleeves, all zippers work perfectly",
  },
  {
    id: "2",
    title: "MacBook Pro 2019",
    price: 899.99,
    description: "13-inch MacBook Pro with 8GB RAM and 256GB SSD. Great for work and study.",
    category: "Electronics",
    image: "/macbook-pro-laptop.png",
    sellerId: "1",
    sellerName: "john_doe",
    createdAt: "2024-01-14T15:30:00Z",
    quantity: 1,
    condition: "Like New",
    yearOfManufacture: 2019,
    brand: "Apple",
    model: "MacBook Pro 13-inch",
    dimensions: {
      length: 30.41,
      width: 21.24,
      height: 1.56,
    },
    weight: 1.37,
    color: "Space Gray",
    originalPackaging: true,
    manualIncluded: true,
    workingConditionDescription: "Excellent working condition, battery health at 92%",
  },
  {
    id: "3",
    title: "Mid-Century Modern Chair",
    price: 199.99,
    description: "Beautiful mid-century modern chair in walnut wood. Minor wear but very sturdy.",
    category: "Furniture",
    image: "/mid-century-modern-chair.jpg",
    sellerId: "2",
    sellerName: "jane_smith",
    createdAt: "2024-01-13T09:15:00Z",
    quantity: 1,
    condition: "Good",
    yearOfManufacture: 1965,
    brand: "Herman Miller",
    model: "Eames Lounge Chair",
    dimensions: {
      length: 84,
      width: 84,
      height: 83,
    },
    weight: 36,
    material: "Walnut Wood, Leather",
    color: "Walnut Brown",
    originalPackaging: false,
    manualIncluded: false,
    workingConditionDescription: "Solid construction, minor scratches on wood base",
  },
]

const mockChats: Chat[] = [
  {
    id: "1-2-1",
    productId: "1",
    productTitle: "Vintage Leather Jacket",
    participantId: "2",
    participantName: "jane_smith",
    participantAvatar: "/diverse-user-avatars.png",
    lastMessage: "Hi! Is this jacket still available?",
    lastMessageTime: "2024-01-16T14:30:00Z",
    messages: [
      {
        id: "msg1",
        senderId: "1",
        receiverId: "2",
        productId: "1",
        message: "Hi! Is this jacket still available?",
        timestamp: "2024-01-16T14:30:00Z",
      },
      {
        id: "msg2",
        senderId: "2",
        receiverId: "1",
        productId: "1",
        message: "Yes, it's still available! Would you like to know more about it?",
        timestamp: "2024-01-16T14:35:00Z",
      },
    ],
  },
]

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [cart, setCart] = useState<CartItem[]>([])
  const [purchases, setPurchases] = useState<Product[]>([])
  const [chats, setChats] = useState<Chat[]>(mockChats)
  const [favorites, setFavorites] = useState<string[]>([])

  const addProduct = (productData: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setProducts((prev) => [newProduct, ...prev])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const purchaseCart = () => {
    const purchasedProducts = cart.map((item) => item.product)
    setPurchases((prev) => [...prev, ...purchasedProducts])
    setCart([])
  }

  const createChat = (productId: string, sellerId: string, buyerId: string): string => {
    const product = products.find((p) => p.id === productId)
    if (!product) return ""

    const chatId = `${productId}-${sellerId}-${buyerId}`
    const existingChat = chats.find((c) => c.id === chatId)

    if (existingChat) return chatId

    const newChat: Chat = {
      id: chatId,
      productId,
      productTitle: product.title,
      participantId: sellerId,
      participantName: product.sellerName,
      participantAvatar: "/diverse-user-avatars.png",
      lastMessage: "",
      lastMessageTime: new Date().toISOString(),
      messages: [],
    }

    setChats((prev) => [...prev, newChat])
    return chatId
  }

  const sendMessage = (chatId: string, message: string, senderId: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId,
      receiverId: "", // Would be determined by chat participants
      productId: "",
      message,
      timestamp: new Date().toISOString(),
    }

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: message,
            lastMessageTime: newMessage.timestamp,
          }
        }
        return chat
      }),
    )
  }

  const searchProducts = (query: string, category?: string): Product[] => {
    return products.filter((product) => {
      const matchesQuery =
        query === "" ||
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())

      const matchesCategory = !category || category === "All" || product.category === category

      return matchesQuery && matchesCategory
    })
  }

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      }
      return [...prev, productId]
    })
  }

  const isFavorite = (productId: string): boolean => {
    return favorites.includes(productId)
  }

  return (
    <DataContext.Provider
      value={{
        products,
        cart,
        purchases,
        chats,
        favorites,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        purchaseCart,
        sendMessage,
        createChat,
        searchProducts,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
