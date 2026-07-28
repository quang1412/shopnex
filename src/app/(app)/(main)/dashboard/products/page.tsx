import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductListing } from '@/components/product/product-listing'
import { getProducts, getCategories } from '@/lib/products'
import { generatePageMetadata } from '@/lib/seo'
import { seoConfig } from '@/lib/seo-config'

import Image from 'next/image'

// Enable ISR for dynamic multi-tenant pages
export const revalidate = 3600

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const searchQuery = (await searchParams).search

  if (searchQuery) {
    return generatePageMetadata({
      pageKey: 'search',
      title: searchQuery,
      url: `${seoConfig.siteUrl}/products?search=${encodeURIComponent(searchQuery)}`,
      templateData: [searchQuery],
    })
  }

  return generatePageMetadata({
    pageKey: 'products',
    title: 'All Products',
    url: `${seoConfig.siteUrl}/products`,
  })
}

interface ProductsPageProps {
  searchParams: Promise<{ search?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const products = await getProducts()
  const categories = await getCategories()
  const searchQuery = (await searchParams).search

  return (
    <div data-content-padding={false}>
      <div className="flex flex-col gap-6 p-4 md:p-6" >

        {/* Banner */}
        {/* <div className='w-full h-40 overflow-hidden'>
        <Image
          width={128}
          height={128}
          src={'/placeholder.svg'}
          alt="shop-banner"
          className='object-cover'
        />
      </div> */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl leading-none tracking-tight">
              {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : 'Sản phẩm'}
            </h1>
            <p className="text-muted-foreground text-sm">{searchQuery
              ? `Tìm sản phẩm khớp với "${searchQuery}"`
              : 'Khám phá bộ sưu tập các sản phẩm cao cấp của chúng tôi'}</p>
          </div>

          <div>
            {/* actions */}
          </div>
        </div>

        <ProductListing
          products={products}
          categories={categories}
          initialSearchQuery={searchQuery}
        />
      </div>

      <Footer />

    </div>


  )
}


//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-1">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <h1 className="text-3xl sm:text-4xl font-bold">
//                 {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
//               </h1>
//               <p className="text-muted-foreground">
//                 {searchQuery
//                   ? `Found products matching "${searchQuery}"`
//                   : 'Discover our complete collection of premium products'}
//               </p>
//             </div>
//             <ProductListing
//               products={products}
//               categories={categories}
//               initialSearchQuery={searchQuery}
//             />
//           </div>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   )
// }
