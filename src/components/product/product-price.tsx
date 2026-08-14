import { type Product, calculateItemPrice } from "@/lib/products";

interface ProductPriceProps {
  product: Product,
  variantId?: string
  isVariable?: boolean
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