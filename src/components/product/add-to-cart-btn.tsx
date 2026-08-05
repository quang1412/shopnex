// components/AddToCartButton.tsx
'use client'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useProductStock } from '@/hooks/use-product-stock'
import { Product } from '@/lib/products'

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

  const { quantityInCart, remainingStockAllowed, isMaxedOut } = useProductStock(String(variant?.id), (variant?.stockCount ?? 0));
  const [inputQty, setInputQty] = useState(1);

  useEffect(() => {
    setInputQty(1);
  }, [variant])

  const onClickATC = () => {
    if (!variant?.id) return;
    handleAddToCart?.(variant.id, inputQty);
  }

  const onClickBuyNow = () => {
    if (!variant?.id) return;
    handlleBuyNow?.(variant.id);
  }

  return (
    <fieldset disabled={isLoading} className='space-y-4'>
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-lg p-0.5">
          {/* quantity control */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setInputQty(inputQty - 1) }}
            disabled={!variant?.id || (inputQty == 1)}
          >
            <>-</>
          </Button>
          <span className=" min-w-[3rem] text-center">{inputQty}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setInputQty(inputQty + 1) }}
            disabled={!variant?.id || (inputQty >= remainingStockAllowed)}
          >
            <>+</>
          </Button>
        </div>

        {/* <span className="text-sm text-muted-foreground">
          {isPreOrder ? "Đặt trước có hàng sau 02 ngày" : product.inStock ? 'Sẵn hàng' : 'Hết hàng'}
        </span> */}

      </div>

      <div className='flex gap-4'>
        < Button
          onClick={onClickATC}
          disabled={isMaxedOut || quantityInCart >= remainingStockAllowed}
          className="flex-1"
        >
          {isLoading ? <><Spinner />&nbsp;Đang thêm...</>
            : !variant ? "Chọn một biến thể"
              : (quantityInCart >= remainingStockAllowed) ? "Bạn đã gom hết"
                : isMaxedOut ? "Hết hàng"
                  : "Thêm vào giỏ"}
        </ Button>
        <Button
          onClick={onClickBuyNow}
          variant="outline"
        >
          Mua ngay
        </Button>
      </div>
    </fieldset>
  )
}
