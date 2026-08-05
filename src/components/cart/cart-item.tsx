'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCart, type CartItem as CartItemType } from '@/hooks/use-cart'
import { Minus, Plus, Trash2 } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"


interface CartItemProps {
  item: CartItemType
  variant?: "default" | "outline" | "muted" | null
  className?: string
}

export function CartItem({ item, className, variant }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > item.stock) return;

    if (newQuantity <= 0) {
      removeItem(item.id, item.variantId)
    } else {
      updateQuantity(newQuantity, item.id, item.variantId)
    }
  }

  return (
    <Item variant={variant} className={cn('', className && className)}>
      {/* <ItemMedia variant="image" className='w-[80px] aspect-square'>
        <Image
          src={item.image || `https://avatar.vercel.sh/${item.name}`}
          alt={item.name}
          width={100}
          height={100}
          className="object-cover   aspect-square"
          sizes='80px'
        />
      </ItemMedia> */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={item.image || `https://avatar.vercel.sh/${item.name}`}
          alt={item.name}
          width={100}
          height={100}
          className="object-cover   aspect-square"
          sizes='80px'
        />
      </div>

      <ItemContent className=' flex flex-col justify-between'>

        <div className="flex justify-between">
          <div>
            <ItemTitle className="truncate pr-6 text-sm font-medium">
              {item.name}
            </ItemTitle>
            <ItemDescription className=" text-xs">
              {item.variantLabel}
            </ItemDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => removeItem(item.id, item.variantId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Quantity control */}
        <div className="mt-2 flex items-center justify-between flex-1">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-7 text-center text-sm">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            {/* {item.price && (
              <div className="text-muted-foreground text-xs line-through">
                ${(item.originalPrice * item.quantity).toFixed(2)}
              </div>
            )} */}
          </div>
        </div>
      </ItemContent>
    </Item>
  )

  return (
    <div
      className="flex gap-3 border-b pb-4 last:border-0"
    >
      {/* Product Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={item.image}
          alt={item.name}
          className="object-cover aspect-square"
          sizes="80px"
        />
      </div>

      {/* Product Details */}
      <div className="min-w-0 flex-1 flex flex-col justify-between">

        <div className="flex justify-between">
          <div>
            <h3 className="truncate pr-6 text-sm font-medium">
              {item.name}
            </h3>
            <p className="text-muted-foreground text-xs">
              {item.variantLabel}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => removeItem(item.id, item.variantId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Quantity control */}
        <div className="mt-2 flex items-center justify-between flex-1">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-7 text-center text-sm">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            {/* {item.price && (
              <div className="text-muted-foreground text-xs line-through">
                ${(item.originalPrice * item.quantity).toFixed(2)}
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
