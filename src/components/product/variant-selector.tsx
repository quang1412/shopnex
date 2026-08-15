'use client';

import { useState } from "react";
import type { Product, Variant } from "@/lib/products";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ProductVariantSelectorProps {
  // product: Product,
  // options: { [key: string]: string }
  // onOptionsChange: (opts: { [key: string]: string }) => void

  variants?: Variant[]
  variantId?: string | null,
  onVariantChange?: (variantId: null | string) => void
}

interface Option { [key: string]: string[] }

export function ProductVariantSelector({
  // product,
  variants,
  onVariantChange,
}: ProductVariantSelectorProps) {
  const { items: cartItems } = useCart();
  const [options, setOptions] = useState<{ [key: string]: string }>({});

  // const productOptions = product.options
  const optionValues: { [key: string]: string[] } = {}

  variants?.forEach(({ options }) => {
    options.forEach(({ option, value }) => {
      optionValues[option] = [...new Set([...(optionValues[option] || []), value])];
    })
  });

  // const xxx = Object.entries(optionValues)

  const toggleOption = (name: string, value: string) => {
    const newOptions = { ...options, [name]: value }
    if (value === options[name]) {
      (delete newOptions[name])
    }
    setOptions(newOptions);
    if (Object.keys(newOptions).length !== Object.keys(optionValues).length) {
      return;
    }
    const variant = variants?.find(v => {
      const isDeff = v.options.find(op => (newOptions[op.option] !== op.value));
      return !isDeff;
    });
    variant && onVariantChange?.(variant.id);
  }

  const handleClearOptions = () => {
    setOptions({});
    onVariantChange?.(null);
  }

  const optionValidate = (name: string, value: string) => {
    const testOptions = { ...options, [name]: value }

    const testVariants = variants?.filter(variant => {
      return !variant.options?.find(op => (!!testOptions[op.option] && testOptions[op.option] != op.value));
    });

    const totalRemainingStock = testVariants?.reduce((total, variant) => {
      if (variant.stockCount == 0) return total;

      const cartQty = cartItems.find(i => i.variantId == variant.id)?.quantity || 0;
      return (total + (variant.stockCount - cartQty))
    }, 0) || 0;

    return totalRemainingStock > 0
  };

  const optionsData = Object.entries(optionValues).map(([option, values]) => {
    return ({
      option,
      values: values.map((value) => ({
        label: value,
        disable: !optionValidate(option, value),
      }))
    })
  });

  if (optionsData.length === 0) {
    return null;
  }

  return (
    <div className='relative space-y-4'>
      {optionsData.map(({ option: name, values }) => (
        <div key={name} className='space-y-2'>
          <div className=' space-x-1'>
            <span className='font-medium text-sm'>{name}:</span>
            <span className='text-xs text-muted-foreground'>{options[name] ?? ''}</span>
          </div>
          <div className='flex gap-2 flex-wrap'>
            {values.map(({ label, disable }) => {
              return (
                <Button
                  key={label}
                  size="lg"
                  variant={disable ? "outline" : options[name] === label ? "default" : 'outline'}
                  disabled={disable}
                  className="cursor-pointer disabled:cursor-not-allowed disabled:border-dashed disabled:border-black/50 disabled:dark:border-white/50"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleOption(name, label)
                  }}
                >{label}</Button>
              )
            })}
          </div>
        </div>
      ))}
      {Object.keys(options).length > 0 && <Button
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