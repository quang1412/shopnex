import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CheckoutForm } from '@/components/checkout/checkout-form'

import { seoConfig } from '@/lib/seo-config'

export const metadata: Metadata = {
  title: seoConfig.pages.checkout.title,
  description: seoConfig.pages.checkout.description,
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckoutPage() {

  // return ( 
  //     <CheckoutForm /> 
  // )

  return (
    <div className="flex flex-col gap-4 border h-full min-h-0  overflow-hidden">
      <div className=''>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between ">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl leading-none tracking-tight">Checkout</h1>
            <p className="text-muted-foreground text-sm">Hoàn thành đơn hàng</p>
          </div>

          <div className="flex flex-wrap items-end justify-end gap-2 lg:w-fit">
            {/* Actions */}
          </div>
        </div>
      </div>

      <div className='border flex-1 overflow-auto'>
        {/* <CheckoutForm /> */}

        <div className=''>

          <div className='  min-h-0 overflow-y-auto'>

            {Array.from({ length: 30 }).map(e => (
              <div className='p-4 border rounded'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam reiciendis modi unde dolore quo, omnis debitis necessitatibus architecto. Quibusdam omnis iste exercitationem alias distinctio iusto eos maxime. Ipsa, fugiat beatae.</div>
            ))}

          </div>

        </div>
      </div>


    </div>

  )
}
