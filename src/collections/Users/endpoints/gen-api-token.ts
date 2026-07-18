import { rateLimitGuard } from '@/utils/rate-limit-guard'
import { Endpoint, } from 'payload'

export const genApiToken: Endpoint = {
  method: 'post',
  path: '/gen-api-token',
  handler: async (req) => {
    const guard = await rateLimitGuard(req)

    if (!guard.ok) {
      return guard.response
    }

    const user = req.user

    if (!user) return Response.json({
      success: false,
      error: 'login please!',
    }, {
      status: 403
    })

    const encryptedToken = req.payload.encrypt(JSON.stringify(user))

    return Response.json({
      data: encryptedToken,
      success: true,
    })
  },
} 