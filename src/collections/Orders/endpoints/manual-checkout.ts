import crypto from 'crypto'
import { PayloadRequest } from 'payload'

type ManualCheckoutProps = {
  req: PayloadRequest
  customer: any
  cart: any
  payment: any
  shipping: any
  total: number
  subtotal: number
  shippingCost: number
  taxAmount?: number
  orderId: string
  items: any[]
  shippingAddress: any
  billingAddress: any
}

export async function manualCheckout({
  req,
  customer,
  cart,
  payment,
  shipping,
  total,
  subtotal,
  shippingCost,
  taxAmount,
  orderId,
  items,
  shippingAddress,
  billingAddress,
}: ManualCheckoutProps) {
  const sessionId = `SID-${crypto.randomUUID()}`

  const orderData = {
    orderId,
    currency: 'vnd',
    orderStatus: 'pending' as const,
    paymentMethod: payment?.providers?.[0]?.blockType || 'manual',
    payment: payment?.id,
    shipping: shipping?.id,
    paymentStatus: 'pending' as const,
    sessionId,
    totalAmount: total,
    shippingAddress,
    billingAddress,
    metadata: {
      items: items.map((item) => ({
        productId: item.id,
        variantId: item.variantId,
        variantLabel: item.variantLabel,
        name: item.name,
        price: item.currentPrice || item.price,
        quantity: item.quantity,
        sku: item.sku,
      })),
      subtotal,
      shippingCost,
      paymentFee: payment.fee || 0, // todo: bổ sung trong tương lai
      taxAmount: taxAmount || 0,
      customer: {
        email: customer?.email,
      },
    },
  }

  await req.payload.create({
    collection: 'orders',
    data: {
      ...orderData,
      user: req.user,
      cart: cart,
    },
    req,
  })

  return {
    redirectUrl: `/order/pending/${sessionId}`,
  }
}
