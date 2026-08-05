'use client'

import type React from 'react'

import { fixLocalName } from '@/lib/utils'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import { Checkbox } from '@/components/ui/checkbox'
import { OrderSummary } from './order-summary'
import { ArrowLeft, CreditCard, CircleCheckBig, Truck, Mail, MapIcon, MapPinCheck, TicketPercent, NotebookPen } from 'lucide-react'
import Link from 'next/link'
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

import { toast } from 'sonner'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { AddressAutoComplete, LocationSelector } from '../address/address-autocomplete'
import { ItemSelectDrawer } from '../item-select-drawer'
import { Textarea } from '../ui/textarea'
// import { useIsMobile } from '@/hooks/use-mobile';

interface CheckoutFormData {
  email: string

  fullName: string
  phone: string
  address: string

  provinceName: string
  provinceCode: string
  districtName: string
  districtCode: string
  wardName: string
  wardCode: string

  paymentMethodId: string
  shippingMethodId: string
  saveInfo: boolean
  useSameAddress: boolean
  billingFullName: string
  billingAddress: string
  billingProvince: string
  billingDistrict: string
  billingWard: string
  billingFullAddress: string

  giftCard: string
  note: string
}

export function CheckoutForm() {
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([])
  const [selectedShipping, setSelectedShipping] = useState<ShippingMethod | null>(null)

  const [isGiftCardLoading, setIsGiftCardLoading] = useState<boolean>(false)
  // const [discount, setDiscount] = useState<number>(0);
  const [giftCard, setGiftCard] = useState<GiftCard | null>(null);

  const [openDrawerShipping, setOpenDrawerShipping] = useState<boolean>(false);
  const [openDrawerPayment, setOpenDrawerPayment] = useState<boolean>(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: process.env.NODE_ENV === 'development' ? 'john.doe@example.com' : '',

    fullName: process.env.NODE_ENV === 'development' ? 'John Doe' : '',
    phone: process.env.NODE_ENV === 'development' ? '0900000000' : '',
    address: process.env.NODE_ENV === 'development' ? '123 Main Street' : '',
    provinceName: process.env.NODE_ENV === 'development' ? 'Hà Nội' : '',
    provinceCode: process.env.NODE_ENV === 'development' ? '1' : '',
    districtName: process.env.NODE_ENV === 'development' ? '' : '',
    districtCode: process.env.NODE_ENV === 'development' ? '23' : '',
    wardName: process.env.NODE_ENV === 'development' ? 'Đông La' : '',
    wardCode: process.env.NODE_ENV === 'development' ? '49863' : '',

    paymentMethodId: '',
    shippingMethodId: '',
    saveInfo: false,
    useSameAddress: true,
    billingFullName: process.env.NODE_ENV === 'development' ? '' : '',
    billingAddress: process.env.NODE_ENV === 'development' ? '' : '',
    billingProvince: process.env.NODE_ENV === 'development' ? '' : '',
    billingDistrict: process.env.NODE_ENV === 'development' ? '' : '',
    billingWard: process.env.NODE_ENV === 'development' ? '' : '',
    billingFullAddress: '',

    giftCard: '',
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
  }, [formData.shippingMethodId, shippingMethods]);

  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    if (['wardName', 'districtName', 'provinceName'].includes(field) && typeof value === 'string') {
      value = fixLocalName(value);
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGiftCardVerify = async () => {
    if (!formData.giftCard) return;
    try {
      setIsGiftCardLoading(true);
      const { data, error } = await giftCardVerify(formData.giftCard)
      if (error || !data) {
        throw new Error(error || 'Mã giảm giá không hợp lệ');
      };

      setGiftCard(data);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Mã giảm giá không hợp lệ');
    } finally {
      setIsGiftCardLoading(false);
    }
  };

  const subtotal = getTotalPrice()
  const shippingCost = calculateShipping(subtotal, selectedShipping)
  const tax = calculateTax(subtotal)
  const discount = !giftCard ? 0 : calculateDiscount(giftCard, formData.paymentMethodId, formData.shippingMethodId, subtotal)
  const total = calculateTotal(subtotal, shippingCost, tax, discount)

  useEffect(() => {
    console.log({ giftCard, discount });

  }, [giftCard, discount])

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
          fullAddress: ([formData.address, formData.wardName, formData.districtName, formData.provinceName,]).filter(Boolean).join(', '),
          phone: formData.phone,
        },
        paymentMethodId: formData.paymentMethodId,
        shippingMethodId: formData.shippingMethodId,
        subtotal: subtotal,
        shipping: shippingCost,
        // giftCard: giftCard?.code,
        // discount: discount,
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
          // name: formData.fullName,
          // address: ([formData.address, formData.wardName, formData.districtName, formData.provinceName]).filter(Boolean).join(', '),
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
    <form onSubmit={handleSubmit} className='h-full @container/form '>
      <div className="grid grid-cols-1 @2xl/form:grid-cols-2 gap-8 h-full  z-10">

        {/* Col-1 */}
        {/* Checkout Form */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card className='bg-muted/50'>
            {/* <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Mail className="h-4 w-4" />
                Liên hệ
              </CardTitle>
            </CardHeader> */}
            <CardHeader>
              <Label htmlFor="email">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </CardTitle>
              </Label>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="space-y-2"> */}
              {/* <Label htmlFor="email">Địa chỉ email</Label> */}
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
                className='bg-muted/50 border-border'
                required
              />
              {/* </div> */}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className='bg-muted/50'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinCheck className="h-4 w-4" />
                Thông tin giao hàng
              </CardTitle>
              <CardAction>
                <Button className="text-muted-foreground" variant="link" size="xs" >Chọn</Button>
              </CardAction>
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
                    className='bg-muted/50 border-border'
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
                    className='bg-muted/50 border-border'
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <AddressAutoComplete
                  className='w-full bg-muted/50 border-border'
                  value={formData.address}
                  onInputValueChange={value => { handleInputChange('address', value) }}
                  onAddressSelect={data => {
                    handleInputChange('provinceCode', data.vtpL1.toString());
                    handleInputChange('provinceName', (data.components.find(i => i.level == 1)?.name || ''));

                    handleInputChange('districtCode', data.vtpL2.toString());
                    handleInputChange('districtName', (data.components.find(i => i.level == 2)?.name || ''));

                    handleInputChange('wardCode', data.vtpL3.toString());
                    handleInputChange('wardName', (data.components.find(i => i.level == 3)?.name || ''));
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="provinceName">Tỉnh/Tp</Label>
                  <LocationSelector
                    type='province'
                    defaultValue={formData.provinceCode}
                    className='bg-muted/50 text-base md:text-sm'
                    onValueChange={value => {
                      console.log({ value });
                      handleInputChange('provinceName', value?.label || '');
                      handleInputChange('provinceCode', value?.value || '');

                      handleInputChange('districtName', '');
                      handleInputChange('districtCode', '');

                      handleInputChange('wardName', '');
                      handleInputChange('wardCode', '');

                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wardName">Xã/phường</Label>
                  <LocationSelector
                    type='ward'
                    parentCode={formData.provinceCode}
                    defaultValue={formData.wardCode}
                    className='bg-muted/50 text-base md:text-sm'
                    onValueChange={value => {
                      console.log({ 'ward': value });
                      handleInputChange('wardName', value?.label || '');
                      handleInputChange('wardCode', value?.value || '');

                      handleInputChange('districtCode', value?.DISTRICT_ID || '');
                    }}
                  />
                </div>
              </div>

            </CardContent>
          </Card>

          {/* <Card className='bg-muted/50'>
            <CardContent className="space-y-3">
              <div>
                {[formData.wardCode, formData.districtCode, formData.provinceCode].join(' - ')}
              </div>
              <div>
                {([(formData.address || '-'), (formData.wardName || '-'), formData.districtName, (formData.provinceName || '-')]).filter(Boolean).join(', ')}
              </div>
            </CardContent>
          </Card> */}

          {/* Shipping Methods Drawer */}
          <Card className='bg-muted/50'>
            <CardHeader >
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Phương thức vận chuyển
              </CardTitle>
              <CardAction>
                <Button className="text-muted-foreground" variant="link" size="xs" onClick={(e) => {
                  setOpenDrawerShipping(true);
                }}>Chọn</Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-3">
              {shippingMethods.length === 0
                ? <>Đang tải...</>
                : <ItemSelectDrawer
                  name='shipping'
                  title="Phương thức vận chuyển"
                  description="Chọn phương thức vận chuyển"
                  items={shippingMethods.map(method => ({
                    'id': method.id,
                    'titleLeft': method.name,
                    'titleRight': (!method.baseRate || (method.freeShippingMinOrder && subtotal >= method.freeShippingMinOrder))
                      ? 'Free'
                      : `$${method.baseRate.toFixed(2)}`,
                    'description': [method.estimatedDeliveryDays, method.notes].filter(Boolean).join(' • '),
                    // 'isSelected': method.id === formData.shippingMethodId,

                  }))}
                  selectedItemId={formData.shippingMethodId}
                  onValueChange={val => {
                    handleInputChange('shippingMethodId', val || '');
                  }}
                  open={openDrawerShipping}
                  onOpenChange={setOpenDrawerShipping}
                  className='bg-muted/50 '
                  swipeDirection="left"
                />}
            </CardContent>
          </Card>

          {/* Payment Methods Drawer */}
          <Card className='bg-muted/50'>
            <CardHeader >
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Phương thức thanh toán
              </CardTitle>
              <CardAction>
                <Button className="text-muted-foreground" variant="link" size="xs" onClick={(e) => {
                  setOpenDrawerPayment(true);
                }}>Chọn</Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentMethods.length === 0
                ? <>Đang tải...</>
                : <ItemSelectDrawer
                  name='payment'
                  title="Phương thức thanh toán"
                  description="Chọn phương thức thanh toán"
                  items={paymentMethods.map(method => {
                    const provider = method.providers[0]
                    return ({
                      id: method.id,
                      titleLeft: method.name,

                      description: provider?.instructions,
                      isSelected: method.id === formData.paymentMethodId,
                    })
                  })}
                  selectedItemId={formData.paymentMethodId}
                  onValueChange={val => {
                    handleInputChange("paymentMethodId", val || '');
                  }}
                  open={openDrawerPayment}
                  onOpenChange={setOpenDrawerPayment}
                  className='bg-muted/50'
                  swipeDirection="left"
                />}
            </CardContent>
          </Card>

          <Card className='bg-muted/50'>
            <CardHeader>
              <Label htmlFor="orderNote">
                <CardTitle className="flex items-center gap-2">
                  <NotebookPen className="h-4 w-4" />
                  Ghi chú đơn hàng
                </CardTitle>
              </Label>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="orderNote"
                placeholder='Lưu ý của bạn dành cho shop'
                className='resize-none bg-muted/50 border-border '
              />
            </CardContent>
          </Card>


        </div>

        {/* Col-2 */}
        {/* Order Summary */}
        <div>
          <div className="sticky top-6 space-y-6">
            <Card className='bg-muted/50'>
              <CardHeader>
                <Label htmlFor="giftCard">
                  <CardTitle className="flex items-center gap-2">
                    <TicketPercent className="h-4 w-4" />
                    Mã giảm giá
                  </CardTitle>

                </Label>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">

                  {/* <Field orientation="horizontal"> */}
                  <div className='flex gap-2'>
                    <Input
                      id="giftCard"
                      type="giftcard"
                      placeholder="Nhập mã giảm giá (nếu có)"
                      value={formData.giftCard}
                      onChange={({ target: { value } }) => (handleInputChange('giftCard', value))}
                      disabled={isGiftCardLoading}
                      className='bg-muted/50 border-border'
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="text-xs"
                      disabled={!formData.giftCard || isGiftCardLoading}
                      onClick={handleGiftCardVerify}
                    >Áp dụng</Button>
                    {/* </Field> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            <OrderSummary
              subtotal={subtotal}
              shipping={shippingCost}
              tax={tax}
              discount={discount}
              total={total}
              shippingMethodName={selectedShipping?.name}
              className='bg-muted/50'
            />

            <div className=" space-y-4">
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <CircleCheckBig className="h-4 w-4 mr-2" />
                    Đặt hàng
                  </>
                )}
              </Button>

              <Link href="/cart">
                <Button variant="outline" size="lg" className="w-full bg-transparent">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Trở lại giỏ hàng
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* <div className='@xl/form:col-span-2 max-h-0'>&nbsp;</div> */}
      </div>
    </form>
  )
}
