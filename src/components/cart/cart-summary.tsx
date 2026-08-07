"use client"

import { useCart } from "@/hooks/use-cart"
// import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ShoppingCart, } from "lucide-react"
// import { ArrowLeft, CreditCard, CircleCheckBig, Truck } from 'lucide-react'

interface CartSummaryProps {
  tax?: number
  shipping?: number
  shippingMethodName?: string
  freeShippingMinOrder?: number
}

export function CartSummary({
  tax: taxProp,
  shipping: shippingProp,
  shippingMethodName,
  freeShippingMinOrder
}: CartSummaryProps) {
  const { items, getTotalPrice, getTotalItems } = useCart()

  const subtotal = getTotalPrice()
  const shipping = shippingProp ?? (subtotal > 50 ? 0 : 9.99)
  const tax = taxProp ?? (subtotal * 0.08) // 8% tax
  const total = subtotal + shipping + tax

  const totalItems = getTotalItems()

  if (items.length === 0) {
    return null
  }

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Tóm tắt đơn hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tổng phụ <span className="text-muted-foreground">({totalItems} sp)</span></span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              Vận chuyển
              {shippingMethodName ? <span className="text-muted-foreground"> ({shippingMethodName})</span> : ''}
            </span>
            <span className={shipping === 0 ? "text-primary font-medium" : ""}>
              {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Thuế</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Tạm tính</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {freeShippingMinOrder && subtotal < freeShippingMinOrder && (
          <div className="text-xs text-muted-foreground bg-accent/50 p-3 rounded-lg border border-accent">
            Thêm ${(freeShippingMinOrder - subtotal).toFixed(0)} vào đơn hàng để được MIỄN PHÍ vận chuyển!
          </div>
        )}
      </CardContent>

      {/* <CardFooter className="flex flex-col gap-3">
        <Link href="/checkout" className="w-full">
          <Button size="lg" className="w-full">
            Proceed to Checkout
          </Button>
        </Link>
        <Link href="/products" className="w-full">
          <Button variant="outline" size="lg" className="w-full bg-transparent">
            Continue Shopping
          </Button>
        </Link>
      </CardFooter> */}

    </Card>
  )
}
