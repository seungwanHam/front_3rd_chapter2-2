import { Key, useState } from "react"
import { CartItem, Coupon, Product } from "../../types.ts"

interface Props {
  products: Product[]
  coupons: Coupon[]
}

type Cart = CartItem[]

type ProductId = Product["id"]

//
// entities/CartItem
const getCartItemByProductId = (cart: Cart, productId: ProductId) => cart.find((item) => item.product.id === productId)

const getCartItemMaxDiscountRate = (item: CartItem) => {
  return item.product.discounts.reduce((maxDiscount, discount) => {
    return item.quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount
  }, 0)
}

const hasCartItem = (cart: Cart, product: Product) => cart.find((item) => item.product.id === product.id)

const increaseQuantityOne = (cart: Cart, product: Product) =>
  cart.map((item) =>
    item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item,
  )

const addCartItem = (cart: Cart, product: Product) => [...cart, { product, quantity: 1 }]

const removeCartItem = (cart: Cart, productId: ProductId) => cart.filter((item) => item.product.id !== productId)

const updateCartItemQuantity = (cart: Cart, productId: ProductId, newQuantity: number) =>
  cart
    .map((item) => {
      return item.product.id === productId ? { ...item, quantity: Math.min(newQuantity, item.product.stock) } : item
    })
    .filter((item) => item.quantity >= 0)

//
// entities/Product
const getProductMaxDiscountRate = (discounts: { quantity: number; rate: number }[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0)
}

const getProductRemainingStock = (product: Product, cart: Cart) => {
  const cartItem = getCartItemByProductId(cart, product.id)
  return product.stock - (cartItem?.quantity || 0)
}

//
// features/Cart
const getAppliedDiscountRateOfCartItem = (cartItem: CartItem) => getCartItemMaxDiscountRate(cartItem)

const calculateTotal = (cart: Cart, selectedCoupon: Coupon | null) => {
  const totalBeforeDiscount = cart.reduce((totalBeforeDiscount, item) => {
    return totalBeforeDiscount + item.product.price * item.quantity
  }, 0)

  const totalAfterDiscount = (() => {
    let totalAfterDiscount = cart.reduce((totalAfterDiscount, item) => {
      const discount = getCartItemMaxDiscountRate(item)
      return totalAfterDiscount + item.product.price * item.quantity * (1 - discount)
    }, 0)

    // 쿠폰 적용
    if (selectedCoupon) {
      if (selectedCoupon.discountType === "amount") {
        totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue)
      } else {
        totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100
      }
    }

    return totalAfterDiscount
  })()

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  }
}

// pages/CartPage
export const CartPage = ({ products, coupons }: Props) => {
  const [cart, setCart] = useState<Cart>([])
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  // pages/CartPage
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/*상품 목록*/}
        {SectionProductList()}

        {/*장바구니 내역*/}
        {SectionCartInfo()}
      </div>
    </div>
  )

  // pages/CartPage/ui
  function SectionProductList() {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
        <div className="space-y-2">
          {products.map((product) => (
            <ProductView key={product.id} product={product} />
          ))}
        </div>
      </div>
    )
  }

  function SectionCartInfo() {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

        <SectionCartItemList />

        {/*쿠폰 적용*/}
        <SectionCouponApply />

        {/*주문 요약*/}
        <SectionCartSummary />
      </div>
    )
  }

  function SectionCartItemList() {
    return (
      <div className="space-y-2">
        {cart.map((cartItem) => (
          <CartItemView key={cartItem.product.id} cartItem={cartItem} />
        ))}
      </div>
    )
  }

  function SectionCouponApply() {
    return (
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>

        <CouponSelector />

        {selectedCoupon && (
          <p className="text-green-600">
            적용된 쿠폰: {selectedCoupon.name}(
            {selectedCoupon.discountType === "amount"
              ? `${selectedCoupon.discountValue}원`
              : `${selectedCoupon.discountValue}%`}{" "}
            할인)
          </p>
        )}
      </div>
    )
  }

  function SectionCartSummary() {
    const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal(cart, selectedCoupon)
    return (
      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
        <div className="space-y-1">
          <p>상품 금액: {totalBeforeDiscount.toLocaleString()}원</p>
          <p className="text-green-600">할인 금액: {totalDiscount.toLocaleString()}원</p>
          <p className="text-xl font-bold">최종 결제 금액: {totalAfterDiscount.toLocaleString()}원</p>
        </div>
      </div>
    )
  }

  // features/Coupon/ui
  function CouponSelector() {
    function handleApplyCoupon(coupon: Coupon) {
      setSelectedCoupon(coupon)
    }

    return (
      <select
        onChange={(e) => handleApplyCoupon(coupons[parseInt(e.target.value)])}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">쿠폰 선택</option>
        {coupons.map((coupon, index) => (
          <CouponOption key={coupon.code} index={index} coupon={coupon} />
        ))}
      </select>
    )
  }

  // entities/Coupon/ui/CouponOption
  function CouponOption({ index, coupon }: { key: Key; index: number; coupon: Coupon }) {
    return (
      <option value={index}>
        {coupon.name} - {coupon.discountType === "amount" ? `${coupon.discountValue}원` : `${coupon.discountValue}%`}
      </option>
    )
  }

  // features/Cart/ui/ProductView
  function CartItemView({ cartItem }: { key: Key; cartItem: CartItem }) {
    const appliedDiscount = getAppliedDiscountRateOfCartItem(cartItem)

    function handleUpdateQuantity(productId: string, newQuantity: number) {
      setCart((prevCart) => updateCartItemQuantity(prevCart, productId, newQuantity))
    }

    function handleFromCart(productId: string) {
      setCart((prevCart) => removeCartItem(prevCart, productId))
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

  // features/product/ui/AddToCartButton
  function AddToCartButton({ product }: { product: Product }) {
    const remainingStock = getProductRemainingStock(product, cart)

    function handleAddToCart(product: Product) {
      if (remainingStock <= 0) return
      setCart((prevCart) => {
        return hasCartItem(prevCart, product) ? increaseQuantityOne(prevCart, product) : addCartItem(prevCart, product)
      })
    }

    return (
      <button
        className={`w-full px-3 py-1 rounded ${
          remainingStock > 0
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={remainingStock <= 0}
        onClick={() => handleAddToCart(product)}
      >
        {remainingStock > 0 ? "장바구니에 추가" : "품절"}
      </button>
    )
  }

  // widgets/product/ui/ProductView
  function ProductView({ product }: { key: Key; product: Product }) {
    const remainingStock = getProductRemainingStock(product, cart)

    return (
      <div data-testid={`product-${product.id}`} className="bg-white p-3 rounded shadow">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">{product.name}</span>
          <span className="text-gray-600">{product.price.toLocaleString()}원</span>
        </div>

        <div className="text-sm text-gray-500 mb-2">
          <span className={`font-medium ${remainingStock > 0 ? "text-green-600" : "text-red-600"}`}>
            재고: {remainingStock}개
          </span>

          {product.discounts.length > 0 && (
            <span className="ml-2 font-medium text-blue-600">
              최대 {(getProductMaxDiscountRate(product.discounts) * 100).toFixed(0)}% 할인
            </span>
          )}
        </div>

        {product.discounts.length > 0 && (
          <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
            {product.discounts.map((discount, index) => (
              <li key={index}>
                {discount.quantity}개 이상: {(discount.rate * 100).toFixed(0)}% 할인
              </li>
            ))}
          </ul>
        )}

        <AddToCartButton product={product} />
      </div>
    )
  }
}
