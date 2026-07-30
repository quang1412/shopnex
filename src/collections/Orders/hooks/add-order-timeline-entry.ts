import type { BeforeChangeHook } from '@/admin/types'
import type { Order } from '@/payload-types'

export const addOrderTimelineEntry: BeforeChangeHook<Order> = ({ data, originalDoc, req }) => {
  const newTimeline = [...(data.timeline || [])]

  if (data.orderStatus !== originalDoc?.orderStatus) {
    let eventType = 'other'
    let title = `Đổi trạng thái đơn hàng: "${data.orderStatus}"`

    switch (data.orderStatus) {
      case 'canceled':
        eventType = 'order_cancelled'
        title = 'Huỷ đơn hàng'
        break
      case 'delivered':
        eventType = 'delivered'
        title = 'Đơn hàng đã vận chuyển'
        break
      case 'pending':
        eventType = 'note'
        title = 'Đơn hàng đổi trạng thái  "Đang chờ"'
        break
      case 'processing':
        eventType = 'fulfillment_started'
        title = 'Đang thực hiện đơn hàng'
        break
      case 'shipped':
        eventType = 'shipped'
        title = 'Đã giao'
        break
    }

    newTimeline.push({
      type: eventType as any,
      createdBy: req.user?.id || null,
      date: new Date().toISOString(),
      details: `Trạng thái đơn hàng được thay đổi bởi ${req.user?.email || 'hệ thống'}`,
      title,
    })
  }

  // Detect paymentStatus change
  if (data.paymentStatus !== originalDoc?.paymentStatus) {
    let eventType = 'other'
    let title = `Đổi trạng thái thanh toán đơn hàng "${data.paymentStatus}"`

    switch (data.paymentStatus) {
      case 'failed':
        eventType = 'note'
        title = 'Thanh toán thất bại'
        break
      case 'paid':
        eventType = 'order_paid'
        title = 'Đã nhận thanh toán'
        break
      case 'pending':
        eventType = 'note'
        title = 'Đang chờ thanh toán'
        break
      case 'refunded':
        eventType = 'refund_issued'
        title = 'Đã hoàn tiền'
        break
    }

    newTimeline.push({
      type: eventType as any,
      createdBy: req.user?.id || null,
      date: new Date().toISOString(),
      details: `Trạng thái thanh toán được thay đổi bởi ${req.user?.email || 'hệ thống'}`,
      title,
    })
  }

  if (newTimeline.length > (data.timeline?.length || 0)) {
    data.timeline = newTimeline
  }

  return data
}
