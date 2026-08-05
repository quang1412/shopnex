'use client';

// import { useEffect, useState, useCallback } from "react";
import { Product } from "@/lib/products";
import { useCart } from "@/hooks/use-cart";

import { Button } from "../ui/button";

interface ProductVariantSelectorProps {
  product: Product,
  options: { [key: string]: string }
  onOptionsChange: (opts: { [key: string]: string }) => void
}

export function ProductVariantSelector({
  product,
  options,
  onOptionsChange,
}: ProductVariantSelectorProps) {
  const { items: cartItems } = useCart();

  const toggleOption = (option: string, value: string) => {
    const newValue = (options[option] === value ? "" : value);
    onOptionsChange({ ...options, [option]: newValue });
  }

  const getVariant = (options: { [key: string]: string }) => {
    const variant = product.variants?.find((variant) => {
      const isDeff = variant.options?.find((op) => op.value !== options[op.option]);
      return !isDeff;
    });
    return variant;
  };

  if (!product?.options || product.options.length === 0) {
    return null;
  }

  return (
    <div className='relative space-y-4'>
      {product.options.map(({ id, option, value }) => (
        <div key={id} className='space-y-2'>
          <div className=' space-x-1'>
            <span className='font-medium text-sm'>{option}:</span>
            <span className='text-xs text-muted-foreground'>{options[option] ?? ''}</span>
          </div>
          <div className='flex gap-2 flex-wrap'>
            {value.map(value => {
              let isDisplay: boolean = true;

              const thisVariant = getVariant({ ...options, [option]: value })
              const cartItem = thisVariant ? cartItems.find(i => i.variantId == thisVariant.id) : null;

              if (thisVariant) {
                isDisplay = Boolean((thisVariant?.stockCount || 0) > 0);

                if ((cartItem?.quantity || -1) >= (thisVariant.stockCount || 0)) {
                  isDisplay = false
                };
              }

              return (
                <Button
                  key={value}
                  size="lg"
                  variant={!isDisplay ? "outline" : options[option] === value ? "default" : 'outline'}
                  disabled={!isDisplay}
                  className="cursor-pointer disabled:cursor-not-allowed disabled:border-dashed disabled:border-black/50 disabled:dark:border-white/50"
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
    </div>
  );
}