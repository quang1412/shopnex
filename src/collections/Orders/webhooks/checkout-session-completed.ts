import type Stripe from 'stripe'
import type { Payload } from 'payload'

export async function handleCheckoutSessionCompleted({
  event,
  payload,
  stripe,
}: {
  event: Stripe.Event
  payload: Payload
  stripe: Stripe
  [key: string]: unknown
}) {
  const session = event.data.object as Stripe.Checkout.Session
  const orderId = session.metadata?.orderId

  if (!orderId) {
    payload.logger.error('checkout.session.completed: missing orderId in session metadata')
    return
  }

  const result = await payload.find({
    collection: 'orders',
    where: { orderId: { equals: orderId } },
    limit: 1,
    overrideAccess: true,
  })

  const order = result.docs[0]
  if (!order) {
    payload.logger.error(`checkout.session.completed: no order found for orderId ${orderId}`)
    return
  }

  // Try to get the receipt URL from the payment intent's charge
  let receiptUrl: string | undefined
  if (typeof session.payment_intent === 'string') {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent, {
        expand: ['latest_charge'],
      })
      const charge = paymentIntent.latest_charge as Stripe.Charge | null
      receiptUrl = charge?.receipt_url ?? undefined
    } catch {
      // Non-critical — continue without receipt URL
    }
  }

  await payload.update({
    collection: 'orders',
    id: order.id,
    data: {
      paymentStatus: 'paid',
      orderStatus: 'processing',
      paymentIntentId:
        typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
      ...(receiptUrl ? { receiptUrl } : {}),
    },
    overrideAccess: true,
  })

  payload.logger.info(`checkout.session.completed: order ${orderId} marked as paid`)
}
