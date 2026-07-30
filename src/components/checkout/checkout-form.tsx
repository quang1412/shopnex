'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { OrderSummary } from './order-summary'
import { ArrowLeft, CreditCard, Lock, Truck } from 'lucide-react'
import Link from 'next/link'
import {
  getPaymentMethods,
  getShippingMethods,
  createOrder,
  calculateShipping,
  calculateTax,
  calculateTotal,
  type PaymentMethod,
  type ShippingMethod,
} from '@/lib/checkout'
import { toast } from 'sonner'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { AddressAutoComplete } from '../address/address-autocomplete'
// type addressItem = {
//   code: string
//   name: string
// }

interface CheckoutFormData {
  email: string
  // firstName: string
  // lastName: string
  fullName: string
  phone: string
  address: string

  provinceName: string
  provinceCode: string
  districtName: string
  districtCode: string
  wardName: string
  wardCode: string


  // state: string
  // zipCode: string
  // country: string
  paymentMethodId: string
  shippingMethodId: string
  saveInfo: boolean
  useSameAddress: boolean
  billingFirstName: string
  billingLastName: string
  billingAddress: string
  billingCity: string
  billingState: string
  billingZipCode: string
  billingCountry: string

  note: string
}

const getRandomFloat = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};



export function CheckoutForm() {
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null)
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: process.env.NODE_ENV === 'development' ? 'john.doe@example.com' : '',
    // firstName: process.env.NODE_ENV === 'development' ? 'John' : '',
    // lastName: process.env.NODE_ENV === 'development' ? 'Doe' : '',
    fullName: process.env.NODE_ENV === 'development' ? 'John Doe' : '',
    phone: process.env.NODE_ENV === 'development' ? '0900000000' : '',

    address: process.env.NODE_ENV === 'development' ? '123 Main Street' : '',
    provinceName: process.env.NODE_ENV === 'development' ? 'Hà Nội' : '',
    provinceCode: process.env.NODE_ENV === 'development' ? '1' : '',
    districtName: process.env.NODE_ENV === 'development' ? 'Hoài Đức' : '',
    districtCode: process.env.NODE_ENV === 'development' ? '23' : '',
    wardName: process.env.NODE_ENV === 'development' ? 'Đông La' : '',
    wardCode: process.env.NODE_ENV === 'development' ? '456' : '',

    // state: process.env.NODE_ENV === 'development' ? 'NY' : '',
    // zipCode: process.env.NODE_ENV === 'development' ? '10001' : '',
    // country: 'VN',
    paymentMethodId: '',
    shippingMethodId: '',
    saveInfo: false,
    useSameAddress: true,
    billingFirstName: process.env.NODE_ENV === 'development' ? 'John' : '',
    billingLastName: process.env.NODE_ENV === 'development' ? 'Doe' : '',
    billingAddress: process.env.NODE_ENV === 'development' ? '123 Main Street' : '',
    billingCity: process.env.NODE_ENV === 'development' ? 'New York' : '',
    billingState: process.env.NODE_ENV === 'development' ? 'NY' : '',
    billingZipCode: process.env.NODE_ENV === 'development' ? '10001' : '',
    billingCountry: 'VN',
    note: ''
  })

  useEffect(() => {
    const loadMethods = async () => {
      const [payments, shipping] = await Promise.all([getPaymentMethods(), getShippingMethods()])
      setPaymentMethods(payments)
      setShippingMethods(shipping)

      // Set default payment method
      if (payments.length > 0) {
        setFormData((prev) => ({
          ...prev,
          paymentMethodId: payments[0].id,
        }))
      }

      // Set default shipping method
      if (shipping.length > 0) {
        setFormData((prev) => ({
          ...prev,
          shippingMethodId: shipping[0].id,
        }))
        setSelectedShipping(shipping[0])
      }
    }

    loadMethods()
  }, [])

  useEffect(() => {
    const shipping = shippingMethods.find((s) => s.id === formData.shippingMethodId)
    setSelectedShipping(shipping || null)
  }, [formData.shippingMethodId, shippingMethods])

  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const subtotal = getTotalPrice()
  const shippingCost = calculateShipping(subtotal, selectedShipping)
  const tax = calculateTax(subtotal)
  const total = calculateTotal(subtotal, shippingCost, tax)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.paymentMethodId || !formData.shippingMethodId) {
        toast.error('Please select payment and shipping methods')
        setIsLoading(false)
        return
      }

      if (items.length === 0) {
        toast.error('Your cart is empty')
        setIsLoading(false)
        return
      }

      // Create order using simple checkout endpoint
      const result = await createOrder({
        items: items,
        customerInfo: {
          email: formData.email,
          fullName: formData.fullName,
          address: formData.address,
          province: formData.provinceCode,
          district: formData.districtCode,
          ward: formData.wardCode,
          fullAddress: ([formData.address, formData.provinceName, formData.districtName, formData.wardName]).filter(Boolean).join(', '),
          phone: formData.phone,
        },
        paymentMethodId: formData.paymentMethodId,
        shippingMethodId: formData.shippingMethodId,
        subtotal: subtotal,
        shipping: shippingCost,
        tax: tax,
        total: total,
      })

      if (result.error) {
        toast.error(result.error)
        setIsLoading(false)
        return
      }

      if (!result.orderId) {
        toast.error('Failed to create order')
        setIsLoading(false)
        return
      }

      clearCart()

      // If the payment provider returns a redirect URL, go there directly
      if (result.redirectUrl) {
        if (result.redirectUrl.startsWith('http')) {
          // External redirect (e.g. Stripe hosted checkout)
          window.location.href = result.redirectUrl
        } else {
          // Internal redirect (e.g. manual/bank transfer pending page)
          router.push(result.redirectUrl)
        }
        return
      }

      // Fallback: store order data locally and show confirmation
      const orderData = {
        id: result.orderId,
        items: items,
        total: total,
        subtotal: subtotal,
        shipping: shippingCost,
        tax: tax,
        customerInfo: {
          email: formData.email,
          name: formData.fullName,
          address: ([formData.address, formData.provinceName, formData.districtName, formData.wardName]).filter(Boolean).join(', '),
        },
        shippingMethod: selectedShipping?.name,
        date: new Date().toISOString(),
      }

      localStorage.setItem('lastOrder', JSON.stringify(orderData))
      router.push(`/order-confirmation?orderId=${result.orderId}`)
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Checkout failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground">Add some products before checking out</p>
        </div>
        <Link href="/products">
          <Button size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='h-full container mx-auto'>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full max-h-0 no-scrollbar ">

        <div className='md:col-span-2'>
          <div className=''>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between ">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl leading-none tracking-tight">Thanh toán</h1>
                <p className="text-muted-foreground text-sm">thanh toán</p>
              </div>

              <div className="flex flex-wrap items-end justify-end gap-2 lg:w-fit">
                {/* Actions */}
              </div>
            </div>
          </div>
          {/* &nbsp; */}
        </div>

        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Địa chỉ email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Địa chỉ giao hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ tên</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <AddressAutoComplete
                  className='w-full'
                  onChange={data => {
                    // alert(data.formattedAddress);
                    alert([data.vtpL1, data.vtpL2, data.vtpL3].join(', '))
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="provinceName">Tỉnh/Tp</Label>
                  <Input
                    id="provinceName"
                    value={formData.provinceName}
                    onChange={(e) => {
                      handleInputChange('provinceName', e.target.value);
                      handleInputChange('provinceCode', getRandomInt(0, 9).toString());
                    }}
                    placeholder="New York"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wardName">Xã/phường</Label>
                  <Input
                    id="wardName"
                    value={formData.wardName}
                    onChange={(e) => {
                      handleInputChange('wardName', e.target.value);
                      handleInputChange('wardCode', getRandomInt(100, 999).toString());
                    }}
                    placeholder=""
                    required
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Shipping Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Phương thức vận chuyển
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {shippingMethods.length == 0 ? (
                <p className="text-muted-foreground">Đang tải phương thức vận chuyển...</p>
              ) : (<RadioGroup
                // defaultValue={shippingMethods[0].id}
                className="w-full  "
                onValueChange={val => handleInputChange('shippingMethodId', val)}
              >
                {shippingMethods.map((method) => (
                  <FieldLabel
                    key={`shipping-${method.id}`}
                    htmlFor={`shipping-${method.id}`}
                    className='hover:border-muted-foreground'
                  >
                    <Field orientation="horizontal" className='flex flex-row-reverse'>
                      <FieldContent>
                        <FieldTitle className='w-full flex items-center justify-between'>
                          <span>{method.name}</span>
                          <span>
                            {method.freeShippingMinOrder && subtotal >= method.freeShippingMinOrder
                              ? 'Free'
                              : `$${method.baseRate.toFixed(2)}`}
                          </span>
                        </FieldTitle>
                        <FieldDescription className='text-xs'>
                          {(method.estimatedDeliveryDays || method.notes) && (
                            <span className="text-xs text-muted-foreground mt-1">
                              {method.estimatedDeliveryDays}
                              {method.estimatedDeliveryDays && method.notes && ' • '}
                              {method.notes}
                            </span>
                          )}
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem value={method.id} id={`shipping-${method.id}`} />
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Phương thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentMethods.length == 0 ? (
                <p className="text-muted-foreground">Đang tải phương thức thanh toán...</p>
              ) : (
                <>
                  <RadioGroup
                    className="w-full"
                    onValueChange={val => handleInputChange('paymentMethodId', val)}
                  >
                    {paymentMethods.map((method) => {
                      const provider = method.providers[0];

                      return (
                        <FieldLabel
                          key={`payment-${method.id}`}
                          htmlFor={`payment-${method.id}`}
                          className='hover:border-muted-foreground'
                        >
                          <Field orientation="horizontal" className='flex flex-row-reverse'>
                            <FieldContent>
                              <FieldTitle>{method.name}</FieldTitle>
                              <FieldDescription className='text-xs'>
                                {provider?.instructions && (provider.instructions)}
                              </FieldDescription>
                            </FieldContent>
                            <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                          </Field>
                        </FieldLabel>
                      );
                    })}
                    {/* </div> */}
                  </RadioGroup>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveInfo"
                      checked={formData.saveInfo}
                      onCheckedChange={(checked) => handleInputChange('saveInfo', checked as boolean)}
                    />
                    <Label htmlFor="saveInfo" className="text-sm">
                      Lưu lựa chọn cho lần sau
                    </Label>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Lock className="h-3 w-3" />
                    Thông tin thanh toán của bạn được mã hoá và bảo mật
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <div className="sticky top-0 ">
            <OrderSummary
              subtotal={subtotal}
              shipping={shippingCost}
              tax={tax}
              total={total}
              shippingMethodName={selectedShipping?.name}
            />

            <div className="mt-6 space-y-4">
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Xác nhận đơn hàng
                  </>
                )}
              </Button>

              <Link href="/dashboard/cart">
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Trở lại giỏ hàng
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className='md:col-span-2'>&nbsp;</div>
      </div>
    </form>
  )
}
