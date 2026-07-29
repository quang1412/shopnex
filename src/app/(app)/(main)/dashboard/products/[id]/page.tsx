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
    <div data-content-padding={false}>
      <div className="container mx-auto p-4 md:p-6 flex flex-col gap-4">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl leading-none tracking-tight w-full max-w-lg truncate">{product.name}</h1>
            <p className="text-muted-foreground text-sm">{product.category}</p>
          </div>

          <div className="flex flex-wrap items-end justify-end gap-2 lg:w-fit">
            {/* Actions */}
          </div>
        </div>

        <main className="flex-1">
          <ProductDetail product={product} />
        </main>

      </div>
      <Footer />
    </div>
  )
}
