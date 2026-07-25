'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/hooks/use-cart'
import type { Product } from '@/lib/products'
import { ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Star, ChevronRight, XIcon } from 'lucide-react'
// import { useIsMobile } from '@/hooks/use-mobile'

interface ProductDetailProps {
  product: Product
}

const dummyGallery = Array.from({ length: 3 }).map(() => '/images/placeholder.svg')

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // const [selectedVariantId, setSelectedVariantId] = useState<string | null | undefined>(
  //   product.variants?.[0]?.vid,
  // );

  const defaultVariant = product.variants?.[0];

  const [selectdOptions, setSelectedOptions] = useState<Record<string, string> | null>(() => {
    if (!defaultVariant?.options) return null;
    return Object.fromEntries(
      defaultVariant.options?.map((opt) => [opt.option, opt.value])
    );
  });

  const updateOption = (option: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [option]: value }));
  };

  const clearOptions = () => {
    setSelectedOptions(null);
  }

  const selectedVariantId: String | null = React.useMemo(() => {
    // if (!selectdOptions) return null;
    const variant = selectdOptions ? product.variants?.find(variant => {
      const isDeff = variant.options?.find(opt => (opt.value !== selectdOptions[opt.option]))
      return isDeff ? 0 : 1
    }) : defaultVariant;
    return variant?.vid || defaultVariant?.vid || '';

  }, [selectdOptions]);

  const handleAddToCart = async () => {
    let variant: any | null | undefined
    if (selectedVariantId) {
      variant = product.variants?.find((v) => v.vid == selectedVariantId)
    }

    setIsLoading(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500))

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: variant?.price || product.price,
        image: product.image,
        variantId: variant?.vid ?? undefined,
        variantLabel: variant?.options?.map((o: any) => o.value).join(', ') ?? undefined,
      })
    }

    setIsLoading(false)
  }

  const gallery = [...product.images, ...dummyGallery,]

  return (
    <div className="container mx-auto py-8">

      <div className='flex items-center gap-2 mb-3 text-sm text-muted-foreground'>
        {/* breadcrumb */}
        {[
          { label: 'Home', url: '#1' },
          { label: 'Shop', url: '#2' }
        ].map((path, index) => (
          <React.Fragment key={path.url}>
            {index > 0 && <ChevronRight className='w-4 h-4' />}
            <a href={path.url}>{path.label}</a>
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        {/* Product Images */}
        <div className='@container/gallery'>
          <div className="flex gap-4 flex-col @lg/gallery:flex-row-reverse">
            {/* Main Image */}
            <div className='flex-1'>
              <div className="aspect-square rounded-lg overflow-hidden bg-muted/50">
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
                <span className='text-muted-foreground'>{product.category}</span>
                {/* product.name */}
                <h1 className="text-2xl sm:text-3xl font-bold text-balance line-clamp-2">
                  {product.name} Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit veritatis excepturi nihil inventore deserunt esse. Itaque laborum labore, obcaecati delectus laboriosam enim quas. Iusto eaque ratione quae, fugiat nemo consequuntur.
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                      />
                    ))}
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


            <div className="text-3xl font-bold">${product.price}</div>
          </div>

          <Separator />

          {/* Description */}
          {/* <div className="space-y-4">
            <h3 className="font-semibold">Description</h3>

            <div
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: product.description,
              }}
            />
          </div>

          <Separator /> */}

          <div>{selectedVariantId || '---'}</div>

          {/* variants */}
          {/* {product.variants && product.variants?.length > 1 && (
            <div>
              <select
                onChange={(e) => {
                  e.preventDefault()
                  setSelectedVariantId(e.target.value)
                }}
              >
                {product.variants.map((variant, index) => (
                  <option key={variant.vid || index} value={variant.vid || ''}>
                    {variant.options?.map((op) => op.value).join(' / ')}
                  </option>
                ))}
              </select>
            </div>
          )} */}

          {/* <div >
            <pre>
              <code>
                {product.options && JSON.stringify(product.options)}
              </code>
            </pre>
          </div> */}

          {/* options */}
          {product.options && product.options.length > 0 && <div className='relative space-y-3'>
            {product.options.map(({ id, option, value }) => (
              <div key={id} className='space-y-2'>
                <div className='font-medium'>{option}</div>
                <div className='flex gap-2 flex-wrap'>
                  {value.map(value => (
                    <Button
                      key={value}
                      size="lg"
                      variant={selectdOptions?.[option] === value ? "default" : 'outline'}
                      onClick={(e) => {
                        e.preventDefault();
                        updateOption(option, value)
                      }}
                    >{value}</Button>
                  ))}
                </div>
              </div>
            ))}

            {selectdOptions && <Button variant="ghost" size="sm" className=" absolute top-0 right-0" onClick={clearOptions}>
              <XIcon className='h-4 w-4' /> Clear
            </Button>}
          </div>}

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}>
                  +
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.inStock || isLoading}
                className="sm:flex-1"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                {isLoading ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button variant="outline" size="lg" className="sm:w-auto bg-transparent">
                Buy Now
              </Button>
            </div>
          </div>

          <Separator />

          {/* Features */}
          <div className="space-y-4">
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
          </div>
        </div>
      </div>
    </div>
  )
}
