import { Key } from "react"
import {
  CartItem,
  getAppliedDiscountRateOfCartItem,
  removeCartItem,
  updateCartItemQuantity,
} from "../../../entities/cart/Cart.ts"
import { useCart } from "../../../store/store.tsx"

export function CartItemView({ cartItem }: { key: Key; cartItem: CartItem }) {
  const appliedDiscount = getAppliedDiscountRateOfCartItem(cartItem)

  const { setCart } = useCart()

  function handleUpdateQuantity(productId: string, newQuantity: number) {
    setCart((cart) => updateCartItemQuantity(cart, productId, newQuantity))
  }

  function handleFromCart(productId: string) {
    setCart((cart) => removeCartItem(cart, productId))
  }

  return (
    <div className="flex justify-between items-center bg-white p-3 rounded shadow">
      <div>
        <span className="font-semibold">{cartItem.product.name}</span>
        <br />
        <span className="text-sm text-gray-600">
          {cartItem.product.price}원 x {cartItem.quantity}
          {appliedDiscount > 0 && (
            <span className="text-green-600 ml-1">({(appliedDiscount * 100).toFixed(0)}% 할인 적용)</span>
          )}
        </span>
      </div>

      <div>
        <button
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
          onClick={() => handleUpdateQuantity(cartItem.product.id, cartItem.quantity - 1)}
        >
          -
        </button>
        <button
          className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
          onClick={() => handleUpdateQuantity(cartItem.product.id, cartItem.quantity + 1)}
        >
          +
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          onClick={() => handleFromCart(cartItem.product.id)}
        >
          삭제
        </button>
      </div>
    </div>
  )
}
