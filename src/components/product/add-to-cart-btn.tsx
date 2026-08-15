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
  // product: Product
  // variantId?: string
  // isVariable?: boolean
  // isLoading?: boolean
  quantity: number,
  onQuantityChange: (qty: number) => void;
  onAddToCart?: () => Promise<void>
  handleBuyNow?: () => Promise<void>
  disabled?: boolean
  maxQty?: number
}

export function AddToCartButton({
  // product,
  // isLoading,
  // isVariable,
  // variantId,
  quantity,
  onQuantityChange,
  onAddToCart,
  handleBuyNow,
  disabled,
  maxQty = 1
}: AddToCartBtnProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const { items: cartItems } = useCart();
  // const [qty, setQty] = useState<number>(quantity);

  // const [inputQty, setInputQty] = useState(quantity);

  // useEffect(() => { qty && onQuantityChange?.(qty) }, [qty])
  // useEffect(() => { setQty(1) }, [variantId]);

  // const isVariable = product.type == 'variable';
  // const variant = product.variants?.find(v => v.id == variantId);
  // const isStockManage = Boolean(isVariable ? variant?.stockManage : product.stockManage);
  // const stock = isVariable ? (variant?.stockCount || 0) : product.stockCount

  // const itemInCart = cartItems.find((i) => ((i.id == product.id) && (!isVariable || (i.variantId == variantId))));

  // const quantityInCart = itemInCart?.quantity || 0;
  // const remainingStockAllowed = Math.max(0, (stock - quantityInCart));

  // const isDisabled = (isVariable && !variantId) || (isStockManage && (remainingStockAllowed === 0 || qty > remainingStockAllowed))

  const handleChangeQuantity = (qty: number) => {
    if (disabled) return
    onQuantityChange(qty);
  }

  const hangleClickATC = async () => {
    if (disabled) return;
    setIsLoading(true);
    await onAddToCart?.();
    setIsLoading(false);
  }

  const handleClickBuyNow = () => {
    if (disabled) return;
    setIsLoading(true);
    handleBuyNow?.();
    setIsLoading(false);
  }

  return (
    <div className='space-y-4'>

      <div className="flex items-center gap-4">
        <QuantityControler
          value={quantity}
          onValueChange={handleChangeQuantity}
          max={maxQty}
          disabled={isLoading || disabled}
        />
      </div>

      <div className='w-full flex flex-col md:flex-row gap-4 items-center '>
        <div className='flex-1 w-full'>
          <Button
            size="lg"
            onClick={handleClickBuyNow}
            variant="default"
            className="w-full"
            disabled={isLoading || disabled}
          >Mua ngay</Button>
        </div>

        <div className='w-full md:w-[40%]'>
          <Button
            size="lg"
            variant="outline"
            // variant="secondary"
            onClick={hangleClickATC}
            disabled={isLoading || disabled}
            className="w-full"
          >
            {!isLoading ? "Thêm vào giỏ" : <><Spinner />&nbsp;Đang thêm...</>}
          </Button>
        </div>
      </div>
    </div>
  )
}
