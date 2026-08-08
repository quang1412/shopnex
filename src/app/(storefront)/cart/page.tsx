import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8   mx-auto">
            <div className="space-y-2">
              {/* <h1 className="text-2xl sm:text-3xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">Review your items before checkout</p> */}

              <h1 className="text-3xl leading-none tracking-tight font-bold">Giỏ hàng</h1>
              <p className="text-muted-foreground text-sm">Xem lại danh sách sản phẩm</p>
            </div>
            <CartContent />
          </div>
        </div>
      </main>
      <Footer />
    </div>

    // <div className="min-h-screen flex flex-col">
    //   <Header />
    //   <main className="flex-1  bg-muted/40">
    //     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    //       <div className="space-y-6 max-w-255 mx-auto">
    //         <CartContent />
    //       </div>
    //     </div>
    //   </main>
    //   <Footer />
    // </div>
  )
}
