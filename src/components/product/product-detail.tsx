'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/hooks/use-cart'
import type { Product } from '@/lib/products'
import { Heart, Share2, Star, ChevronRight, Ruler, } from 'lucide-react'
// import { useIsMobile } from '@/hooks/use-mobile'
import { SizeGuideDrawer } from './size-guide-drawer'

import { toast } from 'sonner'
import { AddToCartButton } from './add-to-cart-btn'
import { ProductVariantSelector } from './variant-selector'

interface ProductDetailProps {
  product: Product
}

const dummyGallery = Array.from({ length: 3 }).map(() => '/images/placeholder.svg')

export function ProductDetail({ product }: ProductDetailProps) {
  const isVariable = product.type == 'variable';
  const { items: cartItems, addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  // const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const isPreOrder = true;
  const regularPrice = product.originalPrice || Math.floor(product.price + (product.price / 10)) || 0;
  const savedPercent = !!regularPrice ? (100 - (product.price / (regularPrice / 100))).toFixed(1) : 0;

  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>(() => {
    return {}
    // if (!defaultVariant_?.options) return {};
    // return Object.fromEntries(
    //   defaultVariant_.options.map((opt) => [opt.option, opt.value])
    // );
  });

  const variantSelected = product.variants?.find((variant) => {
    const isDeff = variant.options?.find((op) => op.value !== selectedOptions[op.option]);
    return !isDeff;
  });

  useEffect(() => {
    console.log({ selectedOptions })
  }, [selectedOptions])

  useEffect(() => {
    console.log({ product })
  }, [product])

  const handleAddToCart_ = async (qty: number) => {
    // Fn thêm vào giỏ hàng

    if (isVariable && !variantSelected) return alert('Vui lòng chọn biến thể sp');

    setIsLoading(true);

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500))

    const item = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: isVariable ? (variantSelected?.price || 0) : product.price,
      variantId: variantSelected?.id,
      variantLabel: variantSelected?.options?.map((o: any) => o.value).join(' • ') || undefined,
      stock: isVariable ? (variantSelected?.stockCount || 0) : product.stockCount,
    }

    for (let i = 0; i < qty; i++) {
      addItem(item)
    }

    setSelectedOptions({});
    setIsLoading(false);

    toast.success(
      <div className="flex items-center gap-3">
        <Image
          width={45}
          height={45}
          src={product.image || "/images/placeholder.svg"}
          alt="Thumbnail"
          className="h-10 w-10 rounded-lg object-cover"
        />
        <div>
          <p className="font-semibold">Đã thêm {qty} sp vào giỏ hàng</p>
          <p className="text-sm text-muted-foreground">{item.name} ({item.variantLabel})</p>
        </div>
      </div>
    );
  }

  const gallery = [...product.images, ...dummyGallery,]

  return (
    // <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8  space-y-4 4xl:overflow-x-auto 4xl:scrollbar-none 4xl:h-[calc(100vh-4em)] w-full">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start  ">

        {/* Product Images */}
        <div className='@container/gallery xl:sticky xl:top-22 self-start'>
          <div className="flex gap-4 flex-col @lg/gallery:flex-row-reverse">
            {/* Main Image */}
            <div className='flex-1'>
              <div className="aspect-square  rounded-lg overflow-hidden bg-muted/50">
                <Image
                  src={gallery[selectedImage] || product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            {gallery.length > 1 && (
              <div className="flex gap-2 @lg/gallery:flex-col overflow-x-auto">
                {gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                  >
                    <Image
                      src={image || '/placeholder.svg'}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">

          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">

                {/* category */}
                {/* <Badge variant="secondary">{product.category}</Badge> */}
                {/* <span className='text-muted-foreground'>{product.category}</span> */}

                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  {/* breadcrumb   */}
                  {[
                    { label: 'Home', url: '/' },
                    { label: 'Products', url: '/products' },
                    { label: product.category, url: `/products?category=${product.category}` }
                  ].map((path, index) => (
                    <React.Fragment key={path.url}>
                      {index > 0 && <ChevronRight className='w-4 h-4' />}
                      <Link href={path.url}>{path.label}</Link>
                    </React.Fragment>
                  ))}
                </div>

                {/* product.name */}
                <h1 className="text-2xl sm:text-3xl font-bold text-balance line-clamp-2">
                  {product.name} - Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit veritatis excepturi nihil inventore deserunt esse. Itaque laborum labore, obcaecati delectus laboriosam enim quas. Iusto eaque ratione quae, fugiat nemo consequuntur.
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {/* {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? "fill-black text-fill-black" : "text-black-foreground"}`}
                      />
                    ))} */}

                    <Star className='fill-black text-fill-black h-4 w-4 ' />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    4.0 · 127 đánh giá
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>


            {/* Prices */}
            <div className='text-2xl flex gap-2 items-end'>
              <span className=" font-bold">${product.price}</span>
              <del className='text-sm  text-muted-foreground'>${regularPrice}</del>
              {savedPercent && <span className='text-sm  text-green-500'>sale {savedPercent}%</span>}
            </div>

          </div>

          {/* <Separator /> */}

          {/* Description */}
          {/* <div className="space-y-4">
            <h3 className="text-muted-foreground">Elevate your style with our Classic Leather Watch. Featuring premium materials, precise movement, and timeless design that complements any outfit.</h3>
          </div> */}

          {/* Description 2 */}
          {/* <div className="space-y-4">
            <div
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            />
          </div> */}

          {/* <Separator /> */}

          {/* Options control */}
          <div className='relative'>
            <ProductVariantSelector
              product={product}
              options={selectedOptions}
              onOptionsChange={setSelectedOptions}
            />

            <div className=' absolute top-0 right-0'>
              <SizeGuideDrawer
                label={<><Ruler className='w-4 h-4' /> Bảng size</>}
                content="hiển thị bảng size ở đây (nếu có)"
              />
            </div>
          </div>


          {/* Add to Cart */}
          <AddToCartButton
            product={product}
            // variant={variantSelected}
            variantId={variantSelected?.id}
            handleAddToCart={handleAddToCart_}
            handleBuyNow={() => {
              toast.info(`Buy now ${[product.id, variantSelected?.id].filter(Boolean).join(' / ')}`)
            }}
            isLoading={isLoading}
          />
          <Separator />

          {/* Custom fields */}
          <div className='space-y-2'>
            {product.customFields.map((i, index) => (
              <p key={index} className='w-full flex justify-between text-sm'>
                <span className='text-muted-foreground'>{i.name}</span>
                <span >{i.value}</span>
              </p>
            ))}
          </div>

          {/* Features */}
          {/* <div className="space-y-4">
            <h3 className="font-semibold">Why Choose This Product</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Truck className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">Free Shipping</div>
                  <div className="text-muted-foreground">On orders over $50</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">2 Year Warranty</div>
                  <div className="text-muted-foreground">Full coverage</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">30-Day Returns</div>
                  <div className="text-muted-foreground">No questions asked</div>
                </div>
              </div>
            </div>
          </div> */}

          <div className='space-y-6'>
            {Array.from({ length: 4 }).map((i, index) => (
              <div className='border rounded-lg p-4' key={index}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, nobis ratione iusto provident inventore aperiam, dolore molestias labore aut enim saepe esse veniam, tempora culpa id alias adipisci natus expedita!</div>
            ))}
          </div>


        </div>
      </div>
    </div>
  )
}
