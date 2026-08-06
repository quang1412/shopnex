'use client';

// import { useEffect, useState, useCallback } from "react";
import { Product } from "@/lib/products";
import { useCart } from "@/hooks/use-cart";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ProductVariantSelectorProps {
  product: Product,
  options: { [key: string]: string }
  onOptionsChange: (opts: { [key: string]: string }) => void
}

export function ProductVariantSelector({
  product,
  options: optionsProp,
  onOptionsChange,
}: ProductVariantSelectorProps) {
  const { items: cartItems } = useCart();

  const toggleOption = (option: string, value: string) => {
    const newOptions = { ...optionsProp, [option]: value }

    if (value === optionsProp[option]) {
      (delete newOptions[option])
    }

    onOptionsChange(newOptions);
  }

  const handleClearOptions = () => {
    onOptionsChange({})
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

  const optionsData = product.options.map(({ option, value: values }) => {
    return ({
      option,
      values: values.map((value) => {
        let isDisabled: boolean = false;

        const testVariant = getVariant({ ...optionsProp, [option]: value })
        const cartItem = testVariant && cartItems.find(i => i.variantId == testVariant?.id) || null;

        if (!testVariant) {
          // Tính tổng của toàn bộ các biến thể có cùng option
          const totalRemainingStock = (product.variants.
            filter(v => (v.options?.find(({ option: op, value: val }) => op === option && val === value))).
            reduce((total, v) => {
              const cartQty = cartItems.find(i => i.variantId == v.id)?.quantity || 0;
              return (total + (v.stockCount - cartQty))
            }, 0)
          );

          (totalRemainingStock <= 0) && (isDisabled = true);

        } else {
          (testVariant && testVariant.stockCount <= 0) && (isDisabled = true);

          ((cartItem?.quantity || 0) >= (testVariant?.stockCount || 0)) && (isDisabled = true);
        };

        return ({
          label: value,
          disable: isDisabled,
        })
      })
    })
  });

  return (
    <div className='relative space-y-4'>
      {optionsData.map(({ option, values }) => (
        <div key={option} className='space-y-2'>
          <div className=' space-x-1'>
            <span className='font-medium text-sm'>{option}:</span>
            <span className='text-xs text-muted-foreground'>{optionsProp[option] ?? ''}</span>
          </div>
          <div className='flex gap-2 flex-wrap'>
            {values.map(({ label, disable }) => {

              return (
                <Button
                  key={label}
                  size="lg"
                  variant={disable ? "outline" : optionsProp[option] === label ? "default" : 'outline'}
                  disabled={disable}
                  className="cursor-pointer disabled:cursor-not-allowed disabled:border-dashed disabled:border-black/50 disabled:dark:border-white/50"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleOption(option, label)
                  }}
                >{label}</Button>
              )
            })}
          </div>
        </div>
      ))}
      {Object.keys(optionsProp).length > 0 && <Button
        className="absolute right-0 bottom-0 text-destructive"
        size="sm"
        variant="link"
        onClick={handleClearOptions}
      >
        <Trash2 /> Xóa
      </Button>}
    </div>
  );
}