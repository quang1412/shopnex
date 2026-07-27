import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProductDetail } from '@/components/product/product-detail'
import { getProduct } from '@/lib/products'
import { generateProductMetadata, generateProductJsonLd } from '@/lib/seo'
import { seoConfig } from '@/lib/seo-config'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from '@/components/ui/separator'
// import { ChevronLeft } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

// Enable ISR for dynamic multi-tenant pages
export const revalidate = 3600

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct((await params).id)

  if (!product) {
    return {
      title: 'Product Not Found | ShopNex',
      description: 'The requested product could not be found.',
    }
  }

  return generateProductMetadata({
    title: product.name,
    description: product.description,
    image: product.image,
    url: `${seoConfig.siteUrl}/products/${product.id}`,
    price: product.price,
    category: product.category,
  })
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct((await params).id)

  if (!product) {
    notFound()
  }

  // console.log({ product });

  const structuredData = generateProductJsonLd({
    title: product.name,
    description: product.description,
    image: product.image,
    url: `${seoConfig.siteUrl}/products/${product.id}`,
    price: product.price,
    category: product.category,
  })

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* <Header /> */}

      <main className="flex-1">
        {/* <div>
          <Button className="" variant="ghost" ><ChevronLeft /> Back</Button>
        </div> */}

        <ProductDetail product={product} />

        {/* <div className='space-y-8'>
          <ProductDetail product={product} />

          <div className='container mx-auto'>
            <Tabs defaultValue="description" className="w-full">
              <div className='w-full  border-b'>
                <TabsList variant="line" className="w-full max-w-lg ">
                  <TabsTrigger value="description">Mô tả</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="description" >
                <div className='space-y-2'>{Array.from({ length: 5 }).map((i, index) => (
                  <div key={index} className='p-4 border rounded-lg'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit ad quod beatae. Laborum ipsum alias iure ad quibusdam qui praesentium commodi blanditiis necessitatibus, nemo accusantium, in error facere corporis minus?.</div>
                ))}</div>
              </TabsContent>
              <TabsContent value="analytics">
                <div className='space-y-2'>{Array.from({ length: 5 }).map((i, index) => (
                  <div key={index} className='p-4 border rounded-lg'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit ad quod beatae. Laborum ipsum alias iure ad quibusdam qui praesentium commodi blanditiis necessitatibus, nemo accusantium, in error facere corporis minus?.</div>
                ))}</div>
              </TabsContent>
              <TabsContent value="reports">
                <div className='space-y-2'>{Array.from({ length: 5 }).map((i, index) => (
                  <div key={index} className='p-4 border rounded-lg'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit ad quod beatae. Laborum ipsum alias iure ad quibusdam qui praesentium commodi blanditiis necessitatibus, nemo accusantium, in error facere corporis minus?.</div>
                ))}</div>
              </TabsContent>

            </Tabs>
          </div>

        </div> */}


      </main>
      <Footer />
    </div>
  )
}
