// components/AddToCartButton.tsx
'use client'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
// import { useProductStock } from '@/hooks/use-product-stock'
import { type Product } from '@/lib/products'
import { QuantityControler } from './quantity-controler'

import { useCart } from '@/hooks/use-cart'

interface AddToCartBtnProps {
  product: Product
  variantId?: string
  handleAddToCart?: (qty: number) => void
  handleBuyNow?: () => void
  isLoading?: boolean
}

export function AddToCartButton({
  product,
  variantId,
  handleAddToCart,
  handleBuyNow,
  isLoading,
}: AddToCartBtnProps) {

  const { items } = useCart();
  const [inputQty, setInputQty] = useState(1);

  useEffect(() => {
    console.log({ product });

  }, [product])

  const isVariable = product.type == 'variable';
  const variant = product.variants.find(v => v.id == variantId);
  const isStockManage = Boolean(isVariable ? variant?.stockManage : product.stockManage);
  const stock = isVariable ? (variant?.stockCount || 0) : product.stockCount

  const itemInCart = items.find((i) => ((i.id == product.id) && (!isVariable || (i.variantId == variantId))));

  const quantityInCart = itemInCart?.quantity || 0;
  const remainingStockAllowed = Math.max(0, (stock - quantityInCart));

  useEffect(() => { setInputQty(1) }, [variantId]);

  const isDisabled = () => {
    if (isVariable && !variant) return true;
    if (isStockManage && (remainingStockAllowed === 0 || inputQty > remainingStockAllowed)) return
    return false
  }

  const handleChangeQuantity = (qty: number) => {
    if (isDisabled() || isLoading) return
    setInputQty(qty);
  }

  const hangleClickATC = () => {
    if (isDisabled()) return
    handleAddToCart?.(inputQty);
  }

  const handleClickBuyNow = () => {
    variantId && handleBuyNow?.();
  }

  return (
    <div className='space-y-4'>

      <div className="flex items-center gap-4">
        <QuantityControler
          value={inputQty}
          onValueChange={handleChangeQuantity}
          max={remainingStockAllowed || 1}
        />
      </div>

      <div className='w-full flex flex-col md:flex-row gap-4 items-center '>
        <div className='flex-1 w-full'>
          <Button
            size="lg"
            onClick={handleClickBuyNow}
            variant="default"
            className="w-full"
            disabled={isDisabled()}
          >Mua ngay</Button>
        </div>

        <div className='w-full md:w-[40%]'>
          <Button
            size="lg"
            variant="outline"
            // variant="secondary"
            onClick={hangleClickATC}
            disabled={isDisabled()}
            className="w-full"
          >
            {!isLoading ? "Thêm vào giỏ" : <><Spinner />&nbsp;Đang thêm...</>}
          </Button>
        </div>
      </div>
    </div>
  )
}
