import type { Metadata } from 'next'
// import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CartContent } from '@/components/cart/cart-content'

import { seoConfig } from '@/lib/seo-config'

export const metadata: Metadata = {
  title: seoConfig.pages.cart.title,
  description: seoConfig.pages.cart.description,
  robots: {
    index: false,
    follow: false,
  },
}

export default function CartPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 max-w-255 mx-auto">
      <div className=''>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between ">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl leading-none tracking-tight">Giỏ hàng</h1>
            <p className="text-muted-foreground text-sm">Xem lại danh sách sản phẩm</p>
          </div>

          <div className="flex flex-wrap items-end justify-end gap-2 lg:w-fit">
            {/* Actions */}
          </div>
        </div>
      </div>

      <div className=''>
        <CartContent />
      </div>
    </div>
  )
}
