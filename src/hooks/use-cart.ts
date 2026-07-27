'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  variantId?: string
  variantLabel?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string, variantId?: string) => void
  updateQuantity: (quantity: number, id: string, variantId?: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {

        const items = get().items
        const existingItem = items.find((i) => (i.id === item.id) && (i.variantId === item.variantId))

        if (existingItem) {
          set({
            items: items.map((i) => ((i.id === item.id && i.variantId === item.variantId) ? { ...i, quantity: i.quantity + 1 } : i)),
          })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
        }

        console.log('existingItem', existingItem, item);

      },

      removeItem: (id, variantId) => {
        set({
          items: get().items.filter((item) =>
            variantId ? variantId != item.variantId : item.id !== id,
          ),
        })
      },

      updateQuantity: (quantity, id, variantId) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set({
          items: get().items.map((item) =>
            item.id === id && item.variantId === variantId ? { ...item, quantity } : item,
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
)
