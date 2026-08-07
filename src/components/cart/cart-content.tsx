'use client'

import { useCart } from '@/hooks/use-cart'
import { CartItem } from './cart-item'
import { CartSummary } from './cart-summary'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, CircleCheckBig } from 'lucide-react'

import {
  getPaymentMethods,
  getShippingMethods,
  createOrder,
  calculateShipping,
  calculateTax,
  calculateTotal,
  giftCardVerify,
  calculateDiscount,
  type PaymentMethod,
  type ShippingMethod,
  type GiftCard,
} from '@/lib/checkout';
import { useEffect, useState } from 'react'

export function CartContent() {
  const { items, clearCart, getTotalPrice } = useCart()
  const subTotal = getTotalPrice();
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>();

  const tax = calculateTax(subTotal)
  const shipping = calculateShipping(subTotal, (shippingMethod || null))

  useEffect(() => {
    const getMethod = async () => {
      const methods = await getShippingMethods();
      const activeMethod = methods.filter(method => (method.enabled)).sort((a, b) => {
        (a.freeShippingMinOrder || 999999) - (b.freeShippingMinOrder || 999999)
        return 0;
      })?.[0] || methods[0]
      setShippingMethod(activeMethod);

      console.log({ activeMethod });

    }
    getMethod();
  }, []);



  if (items.length === 0) {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Giỏ hàng vẫn trống</h2>
          <p className="text-muted-foreground">Hãy thêm một vài sản phẩm đầu tiên.</p>
        </div>
        <Link href="/dashboard/shop">
          <Button size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Trở lại shop
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className='@container/cart pb-14 md:p-0'>
      <div className="grid grid-cols-1 @2xl/cart:grid-cols-2 gap-8 ">
        {/* Col-1 */}
        {/* Cart Items */}
        <div className=" space-y-6">
          <div className="flex items-center justify-between ">
            <h2 className="text-xl">Sản phẩm ({items.length})</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-destructive hover:text-destructive"
            >
              Xóa giỏ hàng
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <CartItem
                key={index + item.id + item.variantId}
                className='bg-white'
                variant="outline"
                item={item}
              />
            ))}
          </div>

          <Link href="/dashboard/products">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Trở lại shop
            </Button>
          </Link>

          {/* <div>
            {Array.from({ length: 10 }).map(e => (
              <div className='p-4'>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis, nihil inventore perspiciatis quibusdam, exercitationem unde nostrum optio ipsum voluptatum eius sunt! Quo laboriosam voluptatem atque vitae, repudiandae laborum repellat quisquam!
              </div>
            ))}
          </div> */}
        </div>

        {/* Col-2 */}
        {/* Cart Summary */}
        <div>
          <div className="sticky top-8  space-y-6">
            <CartSummary
              tax={tax}
              shipping={shipping}
              shippingMethodName={shippingMethod?.name}
              freeShippingMinOrder={shippingMethod?.freeShippingMinOrder}
            />

            <div className=" fixed flex flex-row-reverse md:flex-col gap-4 border-t md:border-0 p-4 md:p-0 bg-white md:bg-transparent w-full bottom-0 left-0 md:relative ">

              <div className='flex-1'>
                <Button
                  size="lg"
                  nativeButton={false}
                  className="w-full"
                  render={
                    <Link href="/checkout" className=" ">
                      {/* <CircleCheckBig className="h-4 w-4 mr-2" /> */}
                      Mua hàng
                    </Link>
                  }
                />
              </div>

              <Link href="/dashboard/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-transparent" >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Trở lại shop
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
