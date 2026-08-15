import { type Product, calculateItemPrice } from "@/lib/products";

interface ProductPriceProps {
  product: Product,
  variantId?: string | null
  // isVariable?: boolean

  mainPrice?: number | null,
  salePrice?: number | null
  dateOnSaleTo?: string | null
  placceholder?: string | null
}

export function ProductPrice({
  product,
  // isVariable,
  variantId,
}: ProductPriceProps) {
  const { type } = product;
  const isVariable = type == "variable";

  const { mainPrice, oldPrice, maxPrice, minPrice, } = calculateItemPrice(product, variantId);

  return <>
    <span className="font-bold">{
      mainPrice ?? (isVariable ? (maxPrice > minPrice ? `từ ${minPrice} - ${maxPrice}` : minPrice) : "Liên hệ")
    }</span>
    {oldPrice && oldPrice > 0 && <del className="text-sm  text-muted-foreground">{oldPrice}</del>}
  </>
}