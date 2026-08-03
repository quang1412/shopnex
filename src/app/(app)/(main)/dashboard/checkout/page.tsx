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

  return (
    // <div data-content-padding={false} className='bg-muted p-4 md:p-6'>
    <CheckoutForm />
    // </div>
  )

  return (
    <div data-content-padding={false} className=' '>
      <div className="flex flex-col gap-4 min-h-0 p-4 md:p-6  " >

        <div className=''>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between ">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl leading-none tracking-tight">Thanh toán</h1>
              <p className="text-muted-foreground text-sm">thanh toán</p>
            </div>

            <div className="flex flex-wrap items-end justify-end gap-2 lg:w-fit">
              {/* Actions */}
            </div>
          </div>
        </div>

        <div className='flex-1 '>
          <CheckoutForm />
          {/* {Array.from({ length: 20 }).map((i, index) => (
            <div key={index} className='p-4 border rounded-lg mb-4 last:mb-0'>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique qui sit aperiam a? Similique eaque totam aliquid, aliquam eos ipsa numquam impedit culpa dolores iure enim saepe delectus? Nemo, temporibus!
            </div>
          ))} */}
        </div>


      </div>

      {/* <Footer /> */}

    </div>


    // <div className="min-h-screen flex flex-col">
    //   <Header />
    //   <main className="flex-1">
    //     <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    //       <div className="space-y-6">
    //         <CheckoutForm />
    //       </div>
    //     </div>
    //   </main>
    //   <Footer />
    // </div>
  )
}
