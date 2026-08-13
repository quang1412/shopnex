// hooks/useProductStock.ts
import { useCart } from "./use-cart"

export function useProductStock(productId: string | number, variantId: string | number | undefined, totalStock: number) {
  const { items } = useCart()

  // Tìm xem sản phẩm này đã có trong giỏ hàng chưa, nếu có thì số lượng là bao nhiêu
  const itemInCart = items.find((item) => (item.id === productId) && (item.variantId === variantId));

  const quantityInCart = itemInCart ? itemInCart.quantity : 0

  // Số lượng tối đa còn lại mà user ĐƯỢC PHÉP THÊM TIẾP vào giỏ
  const remainingStockAllowed = Math.max(0, totalStock - quantityInCart)

  return {
    quantityInCart,
    remainingStockAllowed,
    isMaxedOut: remainingStockAllowed === 0,
  }
}
