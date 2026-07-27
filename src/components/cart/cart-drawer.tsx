'use client'

import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
// import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '../ui/progress'
import { CartItem } from './cart-item'
import Link from 'next/link'
import { ShoppingCart, ShoppingBag, Package } from 'lucide-react'

import { toast } from "sonner"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function CartDrawer({ showCartDrawer = false }: { showCartDrawer?: boolean }) {
  const [open, setOpen] = useState(showCartDrawer)
  const { items, getTotalPrice, getTotalItems } = useCart()
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  const [deliveryTime, setDeliveryTime] = useState("asap")
  const isMobile = useIsMobile()

  useEffect(() => {
    setOpen(showCartDrawer)
  }, [showCartDrawer])


  const amountToFreeShipping = 1000;
  const freeShippingProgress = 50;

  const shipping = Math.floor(Math.random() * (90 - 0 + 1)) + 0;


  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger render={
        <Button variant="default" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="default"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary/50 text-accent"
            >
              {totalItems}
            </Badge>
          )}
          <span className="sr-only">Giỏ hàng</span>
        </Button>
      } />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Giỏ hàng</DrawerTitle>
          <DrawerDescription>
            {totalItems ? `${totalItems} ${totalItems > 1 ? "items" : "item"}` : ""}
          </DrawerDescription>
        </DrawerHeader>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center  h-full space-y-4 p-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium">Giỏ hàng trống</p>
              <p className="text-sm text-muted-foreground">Hãy thêm một vài sản phẩm đầu tiên.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress */}
            <div className="bg-muted/30 p-4">
              {amountToFreeShipping > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm">
                    Add ${amountToFreeShipping.toFixed(2)} more for free
                    shipping
                  </div>
                  <Progress value={freeShippingProgress} className="h-2" />
                </div>
              ) : (
                <div className="text-primary flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4" />
                  <span>You&apos;ve unlocked free shipping!</span>
                </div>
              )}
            </div>

            {/* items list */}
            <div className="flex-1 scroll-fade overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <CartItem key={item.id + item.variantId} item={item} />
              ))}
            </div>

            <DrawerFooter>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${(totalPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>${(totalPrice + shipping).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={undefined} className="h-[34px] w-full">
                  Thanh toán
                </Button>
                <DrawerClose render={<Button className=" w-full" variant="outline">Tiếp tục mua sắm</Button>} />
              </div>
            </DrawerFooter>
          </>)}
      </DrawerContent>
    </Drawer>
  )
}
