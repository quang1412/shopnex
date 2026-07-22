'use client'

import type React from 'react'
import { useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/use-cart'
import type { Product } from '@/lib/products'
import { ShoppingCart, Heart, ShoppingBasket } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Spinner } from '@/components/ui/spinner'

interface ProductCardProps {
  product: Product
  viewMode?: 'grid' | 'list'
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addItem } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 300))

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variantId: undefined,
      variantLabel: undefined,
    })

    setIsLoading(false)
  }


  if (viewMode === 'list' && !1) {
    return (
      <Link href={`/dashboard/shop/${product.id}`}>
        <Card className="py-0 group cursor-pointer overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 bg-card">
          <CardContent className="p-4">
            <div className="flex gap-4">
              {/* Image */}
              <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-muted/30 to-muted/50 border border-border/30">
                <Image
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!product.inStock && (
                  <Badge variant="secondary" className="absolute top-1 left-1 text-xs">
                    Out of Stock
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    <span className="text-xl font-bold">${product.price}</span>
                    {product.inStock && (
                      <Button
                        size="sm"
                        onClick={handleAddToCart}
                        disabled={isLoading}
                        className="h-8 px-3"
                      >
                        {isLoading ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                        ) : (
                          <>
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }


  if (viewMode === 'list') {
    return (
      <Item variant="outline" render={
        <Link href={`/dashboard/shop/${product.id}`}>
          <div className='flex flex-row gap-2'>

            {/* <ItemMedia variant="image">
            <Image
              src={product.image}
              alt={product.name}
              width={80}
              height={80}
              className="object-cover"
            />
          </ItemMedia> */}

            <div className='w-24 h-24'>
              <Image
                src={product.image}
                alt={product.name}
                width={128}
                height={128}
                className="object-cover aspect-square rounded-lg"
              />
            </div>
            <ItemContent>
              <ItemTitle className="line-clamp-1">
                {product.name}
                {/* - {" "} */}
              </ItemTitle>
              <ItemDescription>{product.category}</ItemDescription>
              <ItemDescription>{product.description}</ItemDescription>
            </ItemContent>
            <ItemContent className="text-right flex flex-col justify-between">
              {/* <div className='font-semibold'>${product.price}</div> */}
              <div className='font-semibold'>${product.price}</div>
              <Button onClick={handleAddToCart} className=" cursor-pointer" size="sm" disabled={isLoading} >
                Thêm vào giỏ
              </Button>
            </ItemContent>
          </div>
        </Link>
      } />
    )
  }

  return (
    <Item variant="outline" className='' render={
      <Link href={`/dashboard/shop/${product.id}`}>
        <ItemHeader>
          <Image
            src={product.image}
            alt={product.name}
            width={128}
            height={128}
            className="aspect-square w-full rounded-lg object-cover"
          />
        </ItemHeader>
        <ItemContent className='overflow-hidden'>
          <ItemTitle className='max-w-full min-w-0 block truncate'>{product.name}</ItemTitle>
          <ItemDescription>
            {product.category}
          </ItemDescription>
        </ItemContent>

        <Separator className="mb-2" />

        <ItemContent className='w-full flex flex-row gap-1 justify-between items-center'>
          <div className='font-semibold'>${product.price}</div>
          <Button onClick={handleAddToCart} className=" cursor-pointer" size="sm" disabled={isLoading} >
            Thêm vào giỏ
          </Button>
        </ItemContent>
      </Link>
    } />
  )
  // return (
  //   <Link href={`/dashboard/shop/${product.id}`}>
  //     {/* <Card size='sm' className="relative mx-auto w-full max-w-sm pt-0">
  //       <Image
  //         src={product.image || "https://avatar.vercel.sh/shadcn1"}
  //         width={128}
  //         height={128}
  //         alt={product.name}
  //         className="relative z-20 aspect-square w-full object-cover brightness-60 grayscale dark:brightness-40"
  //       />
  //       <CardHeader>
  //         <CardTitle className='truncate'>{product.name}</CardTitle>
  //         <CardDescription>
  //           {product.category}
  //         </CardDescription>
  //       </CardHeader>
  //       <CardFooter>
  //         <div className='w-full flex gap-2 justify-between items-center'>
  //           <div className='font-semibold'>${product.price}</div>
  //           <Button onClick={handleAddToCart} className="">Add to cart</Button>
  //         </div>
  //       </CardFooter>
  //     </Card> */}
  //   </Link>
  // )

  // return (
  //   <Link href={`/dashboard/shop/${product.id}`}>
  //     <Card className="py-0 group cursor-pointer overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-card">
  //       <CardContent className="p-0">
  //         {/* Image */}
  //         <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/30 to-muted/50">
  //           <Image
  //             src={product.image || '/placeholder.svg'}
  //             alt={product.name}
  //             fill
  //             className="object-cover group-hover:scale-105 transition-transform duration-300"
  //           />
  //           {!product.inStock && (
  //             <Badge variant="secondary" className="absolute top-3 left-3">
  //               Out of Stock
  //             </Badge>
  //           )}
  //           {product.featured && (
  //             <Badge className="absolute top-3 right-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-md">
  //               Featured
  //             </Badge>
  //           )}

  //           {/* Quick Actions */}
  //           <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex flex-col gap-2">
  //             <Button
  //               size="icon"
  //               variant="secondary"
  //               className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
  //               onClick={(e) => {
  //                 e.preventDefault()
  //                 e.stopPropagation()
  //               }}
  //             >
  //               <Heart className="h-4 w-4" />
  //             </Button>
  //           </div>
  //         </div>

  //         {/* Content */}
  //         <div className="p-5 space-y-3">
  //           <div className="space-y-1">
  //             <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
  //               {product.name}
  //             </h3>
  //             <p className="text-xs text-muted-foreground">{product.category}</p>
  //           </div>

  //           <div className="flex items-center justify-between">
  //             <span className="text-lg font-bold">${product.price}</span>
  //             {product.inStock && (
  //               <Button
  //                 size="sm"
  //                 onClick={handleAddToCart}
  //                 disabled={isLoading}
  //                 className="h-8 px-3"
  //               >
  //                 {isLoading ? (
  //                   <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
  //                 ) : (
  //                   <>
  //                     <ShoppingCart className="h-3 w-3 mr-1" />
  //                     Add
  //                   </>
  //                 )}
  //               </Button>
  //             )}
  //           </div>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   </Link>
  // )
}
