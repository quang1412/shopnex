'use client';

// import { useEffect, } from "react";
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
  // const {} = useProductStock()
  const variants = product.variants
  const productOptions = product.options


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

  const optionValidate = (option: string, value: string) => {
    const testOptions = { ...optionsProp, [option]: value }

    // const testVariants = variants.filter(variant => {
    //   const isDeff = variant.options?.find(op => (!!testOptions[op.option] && testOptions[op.option] != op.value));
    //   return !isDeff
    // });

    const testVariants = variants.filter(variant => {
      return variant.options?.find(({ option, value }) => (!!testOptions[option] && testOptions[option] == value));
    });

    const totalRemainingStock = testVariants.reduce((total, variant) => {
      if (variant.stockCount == 0) return total;

      const cartQty = cartItems.find(i => i.variantId == variant.id)?.quantity || 0;
      return (total + (variant.stockCount - cartQty))
    }, 0);

    return totalRemainingStock > 0
  };

  if (!productOptions || productOptions.length === 0) {
    return null;
  };

  const optionsData = productOptions.map(({ option, value: values }) => {
    return ({
      option,
      values: values.map((value) => ({
        label: value,
        disable: !optionValidate(option, value),
      }))
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