// components/AddToCartButton.tsx
'use client'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
// import { useProductStock } from '@/hooks/use-product-stock'
import { Product } from '@/lib/products'
import { QuantityControler } from './quantity-controler'

import { useCart } from '@/hooks/use-cart'

interface AddToCartBtnProps {
  variant?: NonNullable<Product['variants']>[0] | null
  handleAddToCart?: (variantId: string, qty: number) => void
  handlleBuyNow?: (variantId: string) => void
  isLoading?: boolean
}

export function AddToCartButton({
  variant,
  handleAddToCart,
  handlleBuyNow,
  isLoading,
}: AddToCartBtnProps) {
  const { items } = useCart();

  // const { quantityInCart, remainingStockAllowed, isMaxedOut } = useProductStock(String(variant?.id), (variant?.stockCount ?? 0));
  const [inputQty, setInputQty] = useState(1);

  const variantId = variant?.id || null

  const itemInCart = items.find((i) => (i.variantId == variantId));
  const quantityInCart = itemInCart?.quantity || 0;
  const remainingStockAllowed = Math.max(0, (variant?.stockCount || 0) - quantityInCart);

  useEffect(() => {
    setInputQty(1);
  }, [variant])

  const onClickATC = () => {
    if (remainingStockAllowed === 0 || inputQty > remainingStockAllowed) return;

    variantId && handleAddToCart?.(variantId, inputQty);
  }

  const onClickBuyNow = () => {
    variantId && handlleBuyNow?.(variantId);
  }

  return (
    <fieldset disabled={isLoading || !variantId} className='space-y-4'>
      <div className="flex items-center gap-4">

        <QuantityControler
          value={inputQty}
          onValueChange={setInputQty}
          max={remainingStockAllowed || 1}
          min={1}
        // className='border-0'
        // buttonVariant="outline"
        // disabled={!variantId}
        />

      </div>

      <div className='flex gap-4'>
        <Button
          size="lg"
          onClick={onClickATC}
          disabled={remainingStockAllowed === 0}
          className="flex-1"
        >
          {!variant ? "Chọn một biến thể"
            : isLoading ? <><Spinner />&nbsp;Đang thêm...</>
              : "Thêm vào giỏ"}
        </ Button>
        <Button
          size="lg"
          onClick={onClickBuyNow}
          variant="outline"
          className="w-[30%]"
        >
          Mua ngay
        </Button>
      </div>
    </fieldset>
  )
}
