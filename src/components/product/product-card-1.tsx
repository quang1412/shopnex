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
import { ShoppingCart, Heart, Plus } from 'lucide-react'
// import { Separator } from '@/components/ui/separator'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"

// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// import { Spinner } from '@/components/ui/spinner'

interface ProductCardProps {
  product: Product
  viewMode?: 'grid' | 'list'
  className?: string
}

export function ProductCard({ product, viewMode = 'grid', className }: ProductCardProps) {
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
                width={100}
                height={100}
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
              <Button onClick={handleAddToCart} className=" cursor-pointer" disabled={isLoading} >
                Thêm vào giỏ
              </Button>
            </ItemContent>
          </div>
        </Link>
      } />
    )
  }

  return (
    <div className={'group flex flex-col gap-2 text-sm' + (className ? className : '')}>

      {/* Image */}
      <div className='relative aspect-square rounded-xl overflow-hidden'>
        <Link href={`/dashboard/shop/${product.id}`} >
          <Image
            width={200}
            height={200}
            // quality={100}
            src={product.image}
            alt="Event cover"
            className="z-20 w-full h-auto aspect-square object-cover group-hover:scale-105 transition-scale duration-500"
          />
        </Link>
        <Badge className='z-30 absolute top-2 right-2 bg-primary/50' >30% off</Badge>
      </div>

      <div>
        {/* Category */}
        <p className='text-muted-foreground text-xs'>
          {product.category}
        </p>

        {/* Name */}
        <p className='truncate font-semibold'>
          <Link href={`/dashboard/shop/${product.id}`}>{product.name}</Link>
        </p>

        {/* Prices */}
        <div className='flex gap-1 items-end '>
          <span className='font-semibold'>${product.price}</span>
          <del className='text-xs text-muted-foreground'>${product.price + 10}</del>
        </div>


      </div>
      {/* <div className='justify-between gap-3'>
        <Button size="icon" variant="outline" className="cursor-pointer" onClick={(e) => {
          e.preventDefault(); e.stopPropagation()
        }}><Heart /></Button>
        <Button className="flex-1 cursor-pointer" disabled={isLoading} onClick={handleAddToCart}>
          Thêm vào giỏ
        </Button>
      </div> */}
    </div>
  );


  // return (
  //   <Card size="sm" className="relative mx-auto w-full max-w-sm pt-0">
  //     <Badge className='z-30 absolute top-2 right-2 bg-primary/50' >30% off</Badge>
  //     <Link href={`/dashboard/shop/${product.id}`} className='relative '>
  //       <Image
  //         width={200}
  //         height={200}
  //         // quality={100}
  //         src={product.image}
  //         alt="Event cover"
  //         className="z-20 w-full h-auto aspect-square object-cover"
  //       />
  //     </Link>

  //     <CardHeader>
  //       <CardDescription>
  //         {product.category}
  //       </CardDescription>

  //       <CardTitle className='truncate'>
  //         <Link href={`/dashboard/shop/${product.id}`}>{product.name}</Link>
  //       </CardTitle>

  //       <div className='flex gap-1 items-center'>
  //         <del className='text-xs text-muted-foreground'>${product.price + 10}</del>
  //         <span className='font-semibold'>${product.price}</span>
  //       </div>


  //     </CardHeader>
  //     <CardFooter className='justify-between gap-3'>
  //       <Button size="icon" variant="outline" className="cursor-pointer" onClick={(e) => {
  //         e.preventDefault(); e.stopPropagation()
  //       }}><Heart /></Button>
  //       <Button className="flex-1 cursor-pointer" disabled={isLoading} onClick={handleAddToCart}>
  //         Thêm vào giỏ
  //       </Button>
  //     </CardFooter>
  //   </Card>
  // );

}

