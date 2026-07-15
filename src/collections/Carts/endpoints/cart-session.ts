import { rateLimitGuard } from '@/utils/rate-limit-guard'
import { Endpoint, generateCookie, getCookieExpiration, mergeHeaders } from 'payload'

export const createCartSession: Endpoint = {
  method: 'post',
  path: '/session',
  handler: async (req) => {
    const guard = await rateLimitGuard(req)

    if (!guard.ok) {
      return guard.response
    }
    const { item } = await req.json?.()
    const sessionId = crypto.randomUUID()

    const cart = await req.payload.create({
      collection: 'carts',
      data: {
        sessionId,
        cartItems: [
          {
            product: item.product,
            variantId: item.id,
            quantity: item.quantity,
          },
        ],
      },
      req,
    })

    const cartCookie = generateCookie({
      name: 'cart-session',
      expires: getCookieExpiration({ seconds: 60 * 60 * 24 * 30 }),
      path: '/',
      returnCookieAsObject: false,
      value: sessionId,
    })

    const newHeaders = new Headers({
      'Set-Cookie': cartCookie as string,
    })

    req.responseHeaders = req.responseHeaders
      ? mergeHeaders(req.responseHeaders, newHeaders)
      : newHeaders

    return Response.json(
      {
        cartItems: cart.cartItems,
        success: true,
      },
      {
        headers: {
          'Set-Cookie': cartCookie as string,
        },
      },
    )
  },
}

export const updateCartSession: Endpoint = {
  method: 'patch',
  path: '/session/:sessionId',
  handler: async (req) => {
    const guard = await rateLimitGuard(req)

    if (!guard.ok) {
      return guard.response
    }
    const { item, action } = await req.json?.()
    const sessionId = req.routeParams?.sessionId

    // Get existing cart first
    const existingCarts = await req.payload.find({
      collection: 'carts',
      where: {
        sessionId: {
          equals: sessionId,
        },
      },
      depth: 0,
      req,
    })

    const existingCart = existingCarts.docs[0]
    const existingItems = existingCart?.cartItems || []

    // Check if item already exists
    const existingItemIndex = existingItems.findIndex(
      (cartItem: any) => cartItem.variantId === item.variantId,
    )

    let updatedCartItems

    if (existingItemIndex > -1) {
      // Update existing item quantity
      updatedCartItems = existingItems.map((cartItem: any, index: number) => {
        if (index === existingItemIndex) {
          return {
            ...cartItem,
            quantity: action === 'update' ? item.quantity : cartItem.quantity + item.quantity,
          }
        }
        return cartItem
      })
    } else {
      updatedCartItems = [...existingItems, item]
    }

    try {
      const updatedCart = await req.payload.update({
        collection: 'carts',
        id: existingCart.id,
        data: {
          cartItems: updatedCartItems,
        },
        req,
      })
      return Response.json({
        cartItems: updatedCart?.cartItems || [],
        success: true,
      })
    } catch (error) {
      console.error('Error updating cart:', error)
      return Response.json({
        error: 'Failed to update cart.',
        success: false,
      })
    }
  },
}
