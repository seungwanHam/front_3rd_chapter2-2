// features/product/ui/AddToCartButton
import { getProductRemainingStock, Product } from "../../../entities/product/Product.ts"
import { useCart } from "../../../store/store.tsx"
import { addCartItem, hasCartItem, increaseCartItemQuantityOne } from "../../../entities/cart/Cart.ts"

export function AddToCartButton({ product }: { product: Product }) {
  const { cart } = useCart()
  const remainingStock = getProductRemainingStock(product, cart)

  const { setCart } = useCart()

  function handleAddToCart(product: Product) {
    const remainingStock = getProductRemainingStock(product, cart)
    if (remainingStock <= 0) return

    setCart((cart) => {
      return hasCartItem(cart, product) ? increaseCartItemQuantityOne(cart, product) : addCartItem(cart, product)
    })
  }

  return (
    <button
      className={`w-full px-3 py-1 rounded ${
        remainingStock > 0 ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
      disabled={remainingStock <= 0}
      onClick={() => handleAddToCart(product)}
    >
      {remainingStock > 0 ? "장바구니에 추가" : "품절"}
    </button>
  )
}
