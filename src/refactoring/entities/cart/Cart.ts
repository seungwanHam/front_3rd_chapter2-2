import { Product, ProductId } from "../product/Product.ts"

import { Coupon } from "../coupon/Coupon.ts"

export interface CartItem {
  product: Product
  quantity: number
}

export type Cart = CartItem[]

//
// entities/CartItem
export const getCartItemByProductId = (cart: Cart, productId: ProductId) =>
  cart.find((item) => item.product.id === productId)

export const getCartItemMaxDiscountRate = (item: CartItem) => {
  return item.product.discounts.reduce((maxDiscount, discount) => {
    return item.quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount
  }, 0)
}

export const hasCartItem = (cart: Cart, product: Product) => cart.find((item) => item.product.id === product.id)

export const increaseCartItemQuantityOne = (cart: Cart, product: Product) =>
  cart.map((item) =>
    item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item,
  )

export const addCartItem = (cart: Cart, product: Product) => [...cart, { product, quantity: 1 }]

export const removeCartItem = (cart: Cart, productId: ProductId) => cart.filter((item) => item.product.id !== productId)

export const updateCartItemQuantity = (cart: Cart, productId: ProductId, newQuantity: number) =>
  cart
    .map((item) => {
      return item.product.id === productId ? { ...item, quantity: Math.min(newQuantity, item.product.stock) } : item
    })
    .filter((item) => item.quantity > 0)

//
// features/Cart
export const getAppliedDiscountRateOfCartItem = (cartItem: CartItem) => getCartItemMaxDiscountRate(cartItem)

export const calculateTotal = (cart: Cart, selectedCoupon: Coupon | null) => {
  // 총액
  const totalBeforeDiscount = cart.reduce((totalBeforeDiscount, item) => {
    return totalBeforeDiscount + item.product.price * item.quantity
  }, 0)

  // 할인
  const totalAfterDiscount = (() => {
    // 할인율
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
