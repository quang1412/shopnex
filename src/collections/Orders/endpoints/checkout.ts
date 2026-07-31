import Decimal from 'decimal.js'
import { type Endpoint } from 'payload'

import { stripeCheckout } from '@shopnex/stripe-plugin'
import { manualCheckout } from './manual-checkout'

import type { Product, Payment } from '@/payload-types'

interface CheckoutItem {
  id: string
  variantId?: string
  variantLabel?: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CustomerInfo {
  email: string
  fullName: string
  phone?: string
  address: string
  province: string
  district: string
  ward: string
  fullAddress: string
}

interface CheckoutRequest {
  items: CheckoutItem[]
  customerInfo: CustomerInfo
  paymentMethodId: string
  shippingMethodId: string
  subtotal?: number
  shipping?: number
  tax?: number
  total?: number
}

const validateAndCalculateOrderTotals = async (items: CheckoutItem[], req: any) => {
  if (!items || items.length === 0) {
    throw new Error('Giỏ hàng đang trống')
  }

  let calculatedSubtotal = new Decimal(0)
  const validatedItems = []

  // Validate each item against current product data
  for (const item of items) {
    if (!item.id || !item.quantity || item.quantity <= 0) {
      throw new Error(`Dữ liệu sp không hợp lệ: ${JSON.stringify(item)}`)
    }

    // Fetch current product to validate stock and pricing
    const currentProduct: Product | null = await req.payload.findByID({
      collection: 'products',
      id: item.id,
      req,
    })

    if (!currentProduct || !currentProduct.visible || !currentProduct.inStock) {
      throw new Error(`Sản phẩm "${item.name}" hiện không có sẵn`);
    }

    let variant: Product['variants'][number] | undefined
    if (item.variantId) {
      variant = currentProduct.variants.find((v) => v.id === item.variantId)
      if (!variant) {
        throw new Error(`Biến thể ${item.variantId} không không thuộc sản phẩm "${currentProduct.title}"`)
      }
    } else {
      // Use first variant if no specific variant ID
      variant = currentProduct.variants?.[0]
      if (!variant) {
        throw new Error(`Không có biến thể của sản phẩm "${currentProduct.title}"`)
      }
    }

    // Validate stock availability
    if (variant.stockCount == null || variant.stockCount < item.quantity) {
      throw new Error(
        // `Insufficient stock for "${currentProduct.title}" (${variant.sku || variant.id}): requested ${item.quantity}, available ${variant.stockCount ?? 0}`,
        `Không đủ số lượng "${currentProduct.title}" (${variant.sku || variant.id}): requested ${item.quantity}, available ${variant.stockCount ?? 0}`,
      )
    }

    // Use current price from database, not submitted price
    const itemTotal = new Decimal(variant.price).times(item.quantity)
    calculatedSubtotal = calculatedSubtotal.plus(itemTotal);

    validatedItems.push({
      ...item,
      currentPrice: variant.price,
      variantId: variant.id || '',
      variantLabel: variant.options?.map(({ value }) => (value)).filter(i => Boolean(i)).join(', ') || '',
      // variantId: variant.id,
      sku: variant.sku,
      availableStock: variant.stockCount,
    })
  }

  return {
    subtotal: +calculatedSubtotal,
    validatedItems,
  }
}

const calculateShippingCost = async (shippingMethodId: string, subtotal: number, req: any) => {
  if (!shippingMethodId) {
    return 0
  }

  const shipping = await req.payload.findByID({
    collection: 'shipping',
    id: shippingMethodId,
    req,
  })

  if (!shipping || !shipping.enabled) {
    throw new Error('Invalid or disabled shipping method')
  }

  const provider = shipping.shippingProvider?.[0]
  if (!provider) {
    return 0
  }

  const baseRate = provider.baseRate || 0
  const freeShippingMinOrder = provider.freeShippingMinOrder

  // Apply free shipping if minimum order amount is met
  if (freeShippingMinOrder && subtotal >= freeShippingMinOrder) {
    return 0
  }

  return baseRate
}

const providers: Record<string, (data: any) => Promise<any>> = {
  stripe: stripeCheckout,
  manual: manualCheckout,
}

const getPaymentProvider = async (paymentMethodId: string, req: any) => {
  const payment = await req.payload.findByID({
    collection: 'payments',
    id: paymentMethodId,
    req,
  }) as Payment | null

  if (!payment || !payment.enabled) {
    throw new Error('Invalid or disabled payment method')
  }

  if (!payment.providers?.[0]?.blockType) {
    throw new Error('Payment method not properly configured')
  }

  const paymentMethod = payment.providers[0].blockType
  const handler = providers[paymentMethod]

  if (!handler) {
    throw new Error(`Unsupported payment provider: ${paymentMethod}`)
  }

  const paymentDiscount = payment.discount

  return { paymentMethod, handler, payment, paymentDiscount }
}

export const checkoutEndpoint: Endpoint = {
  method: 'post',
  path: '/checkout',
  handler: async (req) => {
    const { logger } = req.payload

    try {
      const body: CheckoutRequest = typeof req.json === 'function' ? await req.json() : req.body

      if (!body || typeof body !== 'object') {
        return Response.json({ error: 'Invalid request body' }, { status: 400 })
      }

      const { items, customerInfo, paymentMethodId, shippingMethodId } = body

      // Validate required fields
      if (!items || !Array.isArray(items) || items.length === 0) {
        return Response.json({ error: 'Cart is empty or invalid' }, { status: 400 })
      }

      if (
        !customerInfo ||
        !customerInfo.email ||
        !customerInfo.phone ||
        !customerInfo.fullName ||
        !customerInfo.address
      ) {
        return Response.json({ error: 'Customer information is required' }, { status: 400 })
      }

      if (!paymentMethodId) {
        return Response.json({ error: 'Payment method is required' }, { status: 400 })
      }

      if (!shippingMethodId) {
        return Response.json({ error: 'Shipping method is required' }, { status: 400 })
      }

      // Validate items with current stock and pricing
      const { subtotal, validatedItems } = await validateAndCalculateOrderTotals(items, req)

      // console.log({ validatedItems })

      // Get payment provider handler
      const { paymentMethod, handler, payment, paymentDiscount } = await getPaymentProvider(paymentMethodId, req)

      let paymentMethodShippingDiscount = 0;
      if (paymentDiscount.type != 'none' && paymentDiscount.value && paymentDiscount.minOrder) {
        if (subtotal > paymentDiscount.minOrder) {
          if (paymentDiscount.type === 'amount') {
            paymentMethodShippingDiscount = Math.floor(paymentDiscount.value)
          }
          if (paymentDiscount.type === 'percent') {
            paymentMethodShippingDiscount = Math.floor(subtotal * (paymentDiscount.value / 100))
          }
        }
      }

      // Calculate shipping cost based on subtotal
      const shippingCost = await calculateShippingCost(shippingMethodId, subtotal, req);

      // Đảm bảo phí ship phải lớn hơn 0
      const shippingCostDiscounted = Math.max(0, (shippingCost - paymentMethodShippingDiscount));

      // Calculate tax (you can implement tax logic here)
      const taxRate = 0.08 // 8% tax rate - make this configurable
      const taxAmount = subtotal * taxRate
      const finalTotal = subtotal + shippingCostDiscounted + taxAmount

      // Get shipping details
      const shipping = await req.payload.findByID({
        collection: 'shipping',
        id: shippingMethodId,
        req,
      });

      // Generate unique order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

      logger.info(`Processing checkout for order ${orderId} with ${paymentMethod} provider`)

      // Create a real cart record and fetch it with depth so product variants are populated
      const createdCart = await req.payload.create({
        collection: 'carts',
        data: {
          sessionId: `checkout-${orderId}`,
          cartItems: validatedItems.map((item) => ({
            product: parseInt(item.id),
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          customer: req.user,
          completed: true,
        },
        req,
      })

      const cart = await req.payload.findByID({
        collection: 'carts',
        id: createdCart.id,
        depth: 2,
        req,
      })

      // Create order data structure for payment providers
      const orderData = {
        req,
        orderId,
        cart,
        customer: customerInfo,
        payment,
        shipping,
        total: finalTotal,
        subtotal,
        shippingCost: shippingCostDiscounted,
        taxAmount,
        // Additional data for order creation
        items: validatedItems,
        shippingAddress: {
          fullName: customerInfo.fullName,
          phone: customerInfo.phone,
          address: customerInfo.address,
          province: customerInfo.province,
          district: customerInfo.district,
          ward: customerInfo.ward,
          fullAddress: customerInfo.fullAddress,
        },
        billingAddress: {
          email: customerInfo.email,
          fullName: customerInfo.fullName,
          phone: customerInfo.phone,
          address: customerInfo.address,
          province: customerInfo.province,
          district: customerInfo.district,
          ward: customerInfo.ward,
          fullAddress: customerInfo.fullAddress,
        },
      }

      // Process payment through the appropriate provider
      const result = await handler(orderData)

      logger.info(`Checkout completed successfully for order ${orderId}`)

      return Response.json({
        success: true,
        orderId,
        redirectUrl: result.redirectUrl,
        total: finalTotal,
        subtotal,
        shippingCost,
        taxAmount,
      })
    } catch (error) {
      logger.error(error, 'Checkout error')

      const errorMessage = error instanceof Error ? error.message : 'Checkout failed'
      const statusCode =
        errorMessage.includes('stock') ||
          errorMessage.includes('available') ||
          errorMessage.includes('Invalid') ||
          errorMessage.includes('required')
          ? 400
          : 500

      return Response.json({ error: errorMessage }, { status: statusCode })
    }
  },
}
