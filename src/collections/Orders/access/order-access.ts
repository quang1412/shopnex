import type { Order } from '@/payload-types'
import type { Access, Where } from 'payload'

import { checkRole, adminPluginAccess } from '@/access/roles'

// export const readOrderAccess: Access<Order> = ({ req }) => {
//   if (checkRole(['admin'], req.user)) {
//     return true
//   }
//   const session = (req.query?.where as Where)?.sessionId || null

//   if (!session) {
//     return false
//   }

//   return {
//     or: [{ sessionId: session }],
//   }
// }

export const readOrderAccess: Access<Order> = ({ req }) => {
  // cho phép đọc qua api nếu có secret-key
  // const apiKey = req.headers.get('x-api-key')
  // if (!!apiKey && apiKey === process.env.PAYLOAD_SECRET) {
  //   return true
  // }

  if (adminPluginAccess({ req })) {
    return true
  }

  if (checkRole(['admin'], req.user)) {
    return true
  }
  const session = (req.query?.where as Where)?.sessionId || null

  const conditions: Where[] = []

  if (!!session) {
    conditions.push({ sessionId: session })
  }

  if (!!req.user) {
    conditions.push({
      user: {
        equals: req.user,
      },
    })
  }

  if (!session) {
    return false
  }

  return {
    or: [{ sessionId: session }],
  }
}
