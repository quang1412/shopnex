'use client'

import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '../ui/progress'
import { CartItem } from './cart-item'
import Link from 'next/link'
import { ShoppingCart, ShoppingBag, Truck } from 'lucide-react'

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

import {
  getShippingMethods,
  calculateShipping,
  type ShippingMethod,
} from '@/lib/checkout';

export function CartDrawer({
  showCartDrawer = false,
  variant
}: {
  showCartDrawer?: boolean,
  variant?: "link" | "default" | "outline" | "secondary" | "ghost" | "destructive" | null
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(showCartDrawer)
  const { items, getTotalPrice, getTotalItems } = useCart()

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null)

  useEffect(() => {
    const fetchMethod = async () => {
      const methods = await getShippingMethods();
      const method = methods.
        filter(m => (m.freeShippingMinOrder !== undefined)).
        sort((a, b) => ((a.freeShippingMinOrder || 999999) - (b.freeShippingMinOrder || 999999)))[0];
      setShippingMethod(method || null);
    };
    fetchMethod();
  }, []);

  // const [deliveryTime, setDeliveryTime] = useState("asap")
  const isMobile = useIsMobile()

  useEffect(() => {
    setOpen(showCartDrawer)
  }, [showCartDrawer])

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // const amountToFreeShipping = (freeShippingMinOrder || 0) - totalPrice;
  // const freeShippingProgress = freeShippingMinOrder ? (totalPrice / freeShippingMinOrder) * 100 : 0;

  const {
    shippingCost: shipping,
    amountToFreeShipping,
    freeShippingProgress,
    freeShippingMinOrder,
  } = calculateShipping(totalPrice, shippingMethod)

  if (!isMounted) {
    return <Button variant={variant} size="icon" className="relative">
      <ShoppingCart className="h-5 w-5" />
      <span className="sr-only">Giỏ hàng</span>
    </Button>
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger render={
        <Button variant={variant} size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs "
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
            {totalItems ? `${totalItems} sản phẩm` : ""}
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
              {!!amountToFreeShipping && amountToFreeShipping > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm">
                    Thêm ${amountToFreeShipping.toFixed(2)} để đủ điều kiện MIỄN PHÍ vận chuyển.
                  </div>
                  <Progress value={freeShippingProgress} className="h-2" />
                </div>
              ) : (
                <div className="text-primary flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4" />
                  <span>Đã đủ điều kiện MIỄN PHÍ vận chuyển!</span>
                </div>
              )}
            </div>

            {/* items list */}
            <div className="flex-1 scroll-fade overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id + item.variantId}
                  className='p-0'
                  item={item}
                />
              ))}
            </div>

            <DrawerFooter>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tổng giá trị</span>
                  <span>${(totalPrice).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Vận chuyển</span>
                  <span>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-medium">
                  <span>Tổng phụ</span>
                  <span>${(totalPrice + shipping).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button onClick={undefined} size="lg" nativeButton={false} className=" w-full" render={
                  <Link href="/checkout" >
                    Mua hàng
                  </Link>
                }>
                </Button>
                <DrawerClose render={<Button size="lg" className=" w-full" variant="outline">Đóng</Button>} />
              </div>
            </DrawerFooter>
          </>)}
      </DrawerContent>
    </Drawer>
  )
}
