import { useCart } from "../../../store/store.tsx"
import { CartItemView } from "../../../features/cart/ui/CartItemView.tsx"

export function SectionCartItemList() {
  const { cart } = useCart()

  return (
    <div className="space-y-2">
      {cart.map((cartItem) => (
        <CartItemView key={cartItem.product.id} cartItem={cartItem} />
      ))}
    </div>
  )
}
