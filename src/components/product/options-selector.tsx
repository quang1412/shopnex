'use client';

import { useEffect, useState } from "react";
import { Product } from "@/lib/products";
import { useProductStock } from "@/hooks/use-product-stock";

import { Button } from "../ui/button";

interface ProductVariantSelectorProps {
  product: Product,
  onVariantChange: (varianId?: string | null) => void
}

export function ProductVariantSelector({
  product,
  onVariantChange,
}: ProductVariantSelectorProps) {

  const [optionsSlt, setOptionsSlt] = useState<{ [key: string]: string }>({});

  const toggleOption = (option: string, value: string) => {

    const newValue = (optionsSlt[option] === value ? "" : value);

    setOptionsSlt({ ...optionsSlt, [option]: newValue });
  }

  const variantSelected = product.variants?.find((variant) => {
    const isDeff = variant.options?.find((op) => op.value !== optionsSlt[op.option]);
    return !isDeff;
  });

  useEffect(() => {
    console.log({ variantSelected });

    onVariantChange(variantSelected?.id);
  }, [variantSelected]);

  if (!product?.options || product.options.length === 0) {
    return null;
  }

  return (
    <div className='relative space-y-4'>
      {product.options.map(({ id, option, value }) => (
        <div key={id} className='space-y-2'>
          <div className=' space-x-1'>
            <span className='font-medium text-sm'>{option}:</span>
            <span className='text-xs text-muted-foreground'>{optionsSlt?.[option] ?? ''}</span>
          </div>
          <div className='flex gap-2 flex-wrap'>
            {value.map(value => {
              const isDisabled = false;

              return (
                <Button
                  key={value}
                  size="lg"
                  variant={isDisabled ? "outline" : optionsSlt?.[option] === value ? "default" : 'outline'}
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
    </div>
  );
}