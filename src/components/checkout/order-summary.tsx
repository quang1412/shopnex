'use client'

import { useCart } from '@/hooks/use-cart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'

interface OrderSummaryProps {
  className?: string
  subtotal?: number
  shipping?: number
  tax?: number
  discount?: number
  total?: number
  shippingMethodName?: string
  shippingFullAddress?: string

  giftCard?: string
  onGiftCardChange?: (data: string) => void
  onGiftCardVerify?: (data: string) => Promise<void>
}

export function OrderSummary({
  className,
  subtotal: propSubtotal,
  shipping: propShipping,
  tax: propTax,
  discount: propDiscount,
  total: propTotal,
  shippingMethodName,
  shippingFullAddress,

  giftCard = '',
  onGiftCardChange,
  onGiftCardVerify,

}: OrderSummaryProps) {
  const { items, getTotalPrice } = useCart();

  // Use provided values or fallback to cart calculations
  const subtotal = propSubtotal ?? getTotalPrice()
  const shipping = propShipping ?? (subtotal > 50 ? 0 : 9.99)
  const tax = propTax ?? subtotal * 0.08
  const discount = propDiscount ?? 0
  const total = propTotal ?? subtotal + shipping + tax - discount


  const handleGiftCardVerify = () => {
    onGiftCardVerify?.(giftCard)
  }
  return (
    <Card className={className ? className : ''}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ShoppingCart className="h-4 w-4" />
          Tóm tắt đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id + item.variantId} className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-muted/50">
                <Image
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  fill
                  className="object-cover rounded-lg  overflow-hidden"
                />
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">{item.name}</p>

                {item.variantLabel && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{item.variantLabel}</p>
                )}

                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
              </div>
              <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          {/* Tổng phụ */}
          <div className="flex justify-between gap-2 text-sm">
            <span>Tổng phụ</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {/* Vận chuyển */}
          <div className="flex justify-between gap-2 text-sm">
            <span className=' truncate'>
              Vận chuyển
              {shippingMethodName ? <span className="text-muted-foreground"> ({shippingMethodName})</span> : ''}
            </span>
            <span className={shipping === 0 ? ' font-medium' : ''}>
              {shipping === 0 ? 'Miễn phí' : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          {/* Thuế */}
          <div className="flex justify-between gap-2 text-sm">
            <span>Thuế</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          {/* discount */}
          {!!discount && <div className="flex justify-between gap-2 text-sm">
            <span>Giảm giá</span>
            <span>${discount.toFixed(0)}</span>
          </div>}
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="giftCard">Mã giảm giá</Label>

          <div className='flex gap-2'>
            <Input
              id="giftCard"
              type="giftcard"
              placeholder="Nhập mã giảm giá (nếu có)"
              value={giftCard}
              onChange={({ target: { value } }) => onGiftCardChange?.(value)}
              disabled={undefined}
              className='bg-muted/10 border-border'
            />
            <Button
              type="button"
              variant="outline"
              className="text-xs"
              disabled={undefined}
              onClick={handleGiftCardVerify}
            >Áp dụng</Button>
          </div>
        </div>

        <Separator />


        <div className="flex justify-between gap-2 font-semibold text-lg">
          <span>Tổng</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
