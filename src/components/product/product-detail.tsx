'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from "@/components/ui/button-group"
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/hooks/use-cart'
import type { Product } from '@/lib/products'
import { ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Star, ChevronRight, XIcon, Ruler, ChevronLeft } from 'lucide-react'
// import { useIsMobile } from '@/hooks/use-mobile'
import { SizeGuidDrawer } from './size-guide-drawer'

import { toast } from 'sonner'
import { AddToCartButton } from './add-to-cart-btn'
import { ProductVariantSelector } from './variant-selector'

interface ProductDetailProps {
  product: Product
}

const dummyGallery = Array.from({ length: 3 }).map(() => '/images/placeholder.svg')

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const isPreOrder = true;
  const regularPrice = product.originalPrice || Math.floor(product.price + (product.price / 10)) || 0;
  const savedPercent = !!regularPrice ? (100 - (product.price / (regularPrice / 100))).toFixed(1) : 0;

  // đặt biến thể mặc định, hoặc lấy biến thể đầu tiên
  const defaultVariant = product.variants?.find(v => v.sku === 'SN-default') ||
    product.variants?.find(v => (v.stockCount && v.stockCount > 0)) ||
    product.variants?.[0];

  // const [selectedVariant, setSelectedVariant] = useState<NonNullable<Product['variants']>[number] | undefined | null>(
  //   defaultVariant
  // );

  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>(() => {
    return {};

    // if (!defaultVariant?.options) return {};
    // return Object.fromEntries(
    //   defaultVariant.options.map((opt) => [opt.option, opt.value])
    // );
  });

  const variantSelected = product.variants?.find((variant) => {
    const isDeff = variant.options?.find((op) => op.value !== selectedOptions[op.option]);
    return !isDeff;
  });

  // const updateOption = (option: string, value: string) => {
  //   setSelectedOptions(prev => ({ ...prev, [option]: value }));
  //   setQuantity(1);
  // };

  // const toggleOption = (option: string, value: string) => {
  //   // Fn cập nhật options
  //   setSelectedOptions(prev => {
  //     const update = ({ ...prev, [option]: value });
  //     if (prev?.[option] === value) {
  //       delete update[option];
  //     }
  //     return update;
  //   });
  //   setQuantity(1);
  // };

  // const clearOptions = () => {
  //   // Fn xoá các options 
  //   setSelectedOptions(null);
  //   setQuantity(1);
  // };

  // React.useEffect(() => {
  //   // Fn xác định biến thể dựa theo các options của client.
  //   const variant = !selectedOptions ? null : product.variants?.find(variant => {
  //     const isDeff = variant.options?.find(opt => (opt.value !== selectedOptions[opt.option]))
  //     return isDeff ? 0 : 1
  //   });
  //   setSelectedVariant(variant);
  // }, [selectedOptions]);

  // const isOptionSelectable = (option: string, value: string): boolean => {
  //   // Fn check xem các options nào tiếp theo có thể chọn, dựa trên options hiện tại của client và các biến thể
  //   const testOptions = { ...selectedOptions, [option]: value };

  //   const matchedVariants = product.variants?.filter((variant) => {
  //     const isDeff = Boolean(variant.options?.find(({ option: o, value: v }) => (testOptions[o] && testOptions[o] != v)))
  //     return isDeff ? 0 : 1
  //   }).filter(({ stockCount }) => (stockCount && stockCount > 0));

  //   const isSelectable = Boolean(matchedVariants?.length);
  //   return isSelectable;
  // };

  // DELETE
  const handleAddToCart = async () => {
    // Fn thêm vào giỏ hàng
    if (!variantSelected) return alert('vui lòng chọn biến thể sp');

    setIsLoading(true);

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500))

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        image: product.image,
        price: variantSelected?.price || product.price,
        variantId: variantSelected?.id ?? undefined,
        variantLabel: variantSelected?.options?.map((o: any) => o.value).join(' • ') ?? undefined,
        stock: variantSelected.stockCount || 0,
      })
    }

    setIsLoading(false);
    toast.success(`Đã thêm ${quantity} sp vào giỏ hàng`, { description: product.name });
  }

  const handleAddToCart_ = async (variantId: string, qty: number) => {
    const variant = product.variants?.find(v => v.id === variantId);
    if (!variant) return alert('vui lòng chọn biến thể sp');

    // Fn thêm vào giỏ hàng
    if (!variantSelected) return alert('vui lòng chọn biến thể sp');

    setIsLoading(true);

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500))

    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        image: product.image,
        price: variant?.price || product.price,
        variantId: variant?.id ?? undefined,
        variantLabel: variant?.options?.map((o: any) => o.value).join(' • ') || undefined,
        stock: variant.stockCount || 0,
      })
    }

    setSelectedOptions({});
    setIsLoading(false);
    toast.success(`Đã thêm ${quantity} sp vào giỏ hàng`, { description: product.name });
  }


  const gallery = [...product.images, ...dummyGallery,]

  return (
    <div className="container mx-auto pb-8 space-y-4 4xl:overflow-x-auto 4xl:scrollbar-none 4xl:h-[calc(100vh-4em)] w-full">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start  ">

        {/* Product Images */}
        <div className='@container/gallery 4xl:sticky 4xl:top-0 self-start'>
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
        <div className="space-y-6 lg:col-span-1  ">

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
                    { label: 'Home', url: '/dashboard' },
                    { label: 'Products', url: '/dashboard/products' },
                    { label: product.category, url: `/dashboard/products?category=${product.category}` }
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

          <ProductVariantSelector
            product={product}
            options={selectedOptions}
            onOptionsChange={setSelectedOptions}

          // onVariantChange={(variantId) => {
          //   toast.info(variantId || 'clear');
          //   setSelectedVariant(!variantId ? null : product.variants?.find(v => v.id == variantId) || null)
          // }}
          />

          {/* Options control */}
          {/* {product.options && product.options.length > 0 && <div className='relative space-y-4'>

            {product.options.map(({ id, option, value }) => (
              <div key={id} className='space-y-2'>
                <div className=' space-x-1'>
                  <span className='font-medium text-sm'>{option}:</span>
                  <span className='text-xs text-muted-foreground'>{selectedOptions?.[option] ?? ''}</span>
                </div>
                <div className='flex gap-2 flex-wrap'>
                  {value.map(value => {
                    const isDisabled = !isOptionSelectable(option, value);

                    return (
                      <Button
                        key={value}
                        size="lg"
                        variant={isDisabled ? "outline" : selectedOptions?.[option] === value ? "default" : 'outline'}
                        disabled={isDisabled}
                        className="cursor-pointer disabled:cursor-not-allowed disabled:border-dashed disabled:border-black/80 disabled:dark:border-white/80"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleOption(option, value)
                        }}
                      >{value}</Button>
                    )
                  })}
                </div>
              </div>
            ))}

            <div className='absolute top-0 right-0'>
              <SizeGuidDrawer content={''} />
            </div>
          </div>} */}

          <AddToCartButton
            variant={variantSelected}
            handleAddToCart={handleAddToCart_}
            handlleBuyNow={(id) => {
              toast.info(`Buy now ${id}`)

              setSelectedOptions({})
            }}
            isLoading={isLoading}
          />

          {/* Add to Cart */}
          {/* DELETE */}
          <div className="space-y-4 hidden">

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg p-0.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!variantSelected || quantity <= 1}
                >
                  -
                </Button>
                <span className=" min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!variantSelected || quantity >= 100}
                >
                  +
                </Button>
              </div>

              <span className="text-sm text-muted-foreground">
                {isPreOrder ? "Đặt trước có hàng sau 02 ngày" : product.inStock ? 'Sẵn hàng' : 'Hết hàng'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <Button
                size="lg"
                onClick={handleAddToCart}
                // disabled={!product.inStock || isLoading || !selectedVariant}
                disabled={isLoading || !(product.inStock || (variantSelected?.stockCount && variantSelected.stockCount > 0))}
                className="sm:flex-1"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                {isLoading ? 'Đang thêm...' : 'Thêm vào Giỏ'}
              </Button>

              <Button variant="outline" size="lg" className="  sm:w-[33.33%] bg-transparent">
                Mua ngay
              </Button>

              <div className=' w-full '>
                {/* after ATC button content */}
                <p className='text-xs text-muted-foreground text-center'>Bạn chọn nhầm size? chúng mình hỗ trợ đổi size miễn phí.</p>
              </div>

            </div>

          </div>
          {/* DELETE */}

          <Separator />

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

          {/* Features */}
          <div className='space-y-2'>
            {product.customFields.map((i, index) => (
              <p key={index} className='w-full flex justify-between text-sm'>
                <span className='text-muted-foreground'>{i.name}</span>
                <span >{i.value}</span>
              </p>
            ))}
          </div>

          {/* <div className='space-y-6'>
            {Array.from({ length: 4 }).map((i, index) => (
              <div className='border rounded-lg p-4' key={index}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, nobis ratione iusto provident inventore aperiam, dolore molestias labore aut enim saepe esse veniam, tempora culpa id alias adipisci natus expedita!</div>
            ))}
          </div> */}
        </div>
      </div>
      {/* <div>{JSON.stringify(candidateVariants?.map(c => c.options))}</div> */}
    </div>
  )
}
