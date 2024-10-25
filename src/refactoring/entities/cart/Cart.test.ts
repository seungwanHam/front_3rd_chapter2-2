import { describe, expect, it } from "vitest"

import {
  addCartItem,
  calculateTotal,
  Cart,
  CartItem,
  getCartItemByProductId,
  getCartItemMaxDiscountRate,
  hasCartItem,
  increaseCartItemQuantityOne,
  removeCartItem,
  updateCartItemQuantity,
} from "./Cart.ts"

import { initialCoupons, initialProducts } from "../../store/mockData.ts"

describe("장바구니 함수 테스트", () => {
  // 테스트용 기본 장바구니 설정
  const baseCart: Cart = [
    { product: initialProducts[0], quantity: 1 }, // 상품1, 10000원
    { product: initialProducts[1], quantity: 2 }, // 상품2, 20000원
  ]

  describe("상품 ID로 장바구니 상품 찾기", () => {
    it("상품이 존재하는 경우 해당 장바구니 상품을 반환해야 함", () => {
      const result = getCartItemByProductId(baseCart, "p1")
      expect(result).toEqual({ product: initialProducts[0], quantity: 1 })
    })

    it("상품이 존재하지 않는 경우 undefined를 반환해야 함", () => {
      const result = getCartItemByProductId(baseCart, "nonexistent")
      expect(result).toBeUndefined()
    })
  })

  describe("장바구니 상품의 최대 할인율 계산", () => {
    it("수량이 할인 기준을 충족하는 경우 최대 할인율을 반환해야 함", () => {
      const cartItem: CartItem = { product: initialProducts[0], quantity: 20 }
      const result = getCartItemMaxDiscountRate(cartItem)
      expect(result).toBe(0.2) // 20개 구매시 20% 할인
    })

    it("수량이 할인 기준을 충족하지 않는 경우 0을 반환해야 함", () => {
      const cartItem: CartItem = { product: initialProducts[0], quantity: 5 }
      const result = getCartItemMaxDiscountRate(cartItem)
      expect(result).toBe(0)
    })
  })

  describe("장바구니에 상품 존재 여부 확인", () => {
    it("상품이 장바구니에 있는 경우 true를 반환해야 함", () => {
      const result = hasCartItem(baseCart, initialProducts[0])
      expect(result).toBeTruthy()
    })

    it("상품이 장바구니에 없는 경우 false를 반환해야 함", () => {
      const result = hasCartItem(baseCart, initialProducts[2])
      expect(result).toBeFalsy()
    })
  })

  describe("장바구니 상품 수량 1개 증가", () => {
    it("수량이 1 증가해야 함", () => {
      const result = increaseCartItemQuantityOne(baseCart, initialProducts[0])
      const updatedItem = result.find((item) => item.product.id === "p1")
      expect(updatedItem?.quantity).toBe(2)
    })

    it("재고 한도를 초과하지 않아야 함", () => {
      const cart: Cart = [{ product: initialProducts[0], quantity: 20 }]
      const result = increaseCartItemQuantityOne(cart, initialProducts[0])
      const updatedItem = result.find((item) => item.product.id === "p1")
      expect(updatedItem?.quantity).toBe(20) // 재고 한도 20개
    })
  })

  describe("장바구니에 상품 추가", () => {
    it("새로운 상품을 장바구니에 추가해야 함", () => {
      const result = addCartItem(baseCart, initialProducts[2])
      expect(result).toHaveLength(baseCart.length + 1)
      expect(result[result.length - 1]).toEqual({ product: initialProducts[2], quantity: 1 })
    })
  })

  describe("장바구니에서 상품 제거", () => {
    it("장바구니에서 상품을 제거해야 함", () => {
      const result = removeCartItem(baseCart, "p1")
      expect(result).toHaveLength(baseCart.length - 1)
      expect(result.find((item) => item.product.id === "p1")).toBeUndefined()
    })
  })

  describe("장바구니 상품 수량 업데이트", () => {
    it("기존 상품의 수량을 업데이트해야 함", () => {
      const result = updateCartItemQuantity(baseCart, "p1", 5)
      const updatedItem = result.find((item) => item.product.id === "p1")
      expect(updatedItem?.quantity).toBe(5)
    })

    it("수량이 0인 경우 상품을 제거해야 함", () => {
      const result = updateCartItemQuantity(baseCart, "p1", 0)
      expect(result.find((item) => item.product.id === "p1")).toBeUndefined()
    })

    it("재고 한도를 초과하지 않아야 함", () => {
      const result = updateCartItemQuantity(baseCart, "p1", 25)
      const updatedItem = result.find((item) => item.product.id === "p1")
      expect(updatedItem?.quantity).toBe(20) // 재고 한도 20개
    })
  })

  describe("총액 계산", () => {
    it("할인이 없는 경우 총액을 계산해야 함", () => {
      const result = calculateTotal(baseCart, null)
      expect(result.totalBeforeDiscount).toBe(50000) // 10000 + (20000 * 2)
      expect(result.totalAfterDiscount).toBe(50000)
      expect(result.totalDiscount).toBe(0)
    })

    it("수량 할인을 적용해야 함", () => {
      const cartWithQuantityDiscount: Cart = [
        { product: initialProducts[0], quantity: 10 }, // 10개 구매시 10% 할인
      ]
      const result = calculateTotal(cartWithQuantityDiscount, null)
      expect(result.totalBeforeDiscount).toBe(100000) // 10000 * 10
      expect(result.totalAfterDiscount).toBe(90000) // 100000 * 0.9
      expect(result.totalDiscount).toBe(10000)
    })

    it("정액 쿠폰을 적용해야 함", () => {
      const result = calculateTotal(baseCart, initialCoupons[0]) // 5000원 할인 쿠폰
      expect(result.totalBeforeDiscount).toBe(50000)
      expect(result.totalAfterDiscount).toBe(45000) // 50000 - 5000
      expect(result.totalDiscount).toBe(5000)
    })

    it("정률 쿠폰을 적용해야 함", () => {
      const result = calculateTotal(baseCart, initialCoupons[1]) // 10% 할인 쿠폰
      expect(result.totalBeforeDiscount).toBe(50000)
      expect(result.totalAfterDiscount).toBe(45000) // 50000 * 0.9
      expect(result.totalDiscount).toBe(5000)
    })

    it("수량 할인과 쿠폰을 모두 적용해야 함", () => {
      const cartWithQuantityDiscount: Cart = [
        { product: initialProducts[0], quantity: 10 }, // 10개 구매시 10% 할인
      ]
      const result = calculateTotal(cartWithQuantityDiscount, initialCoupons[1]) // 10% 할인 쿠폰
      expect(result.totalBeforeDiscount).toBe(100000) // 10000 * 10
      expect(result.totalAfterDiscount).toBe(81000) // (100000 * 0.9) * 0.9
      expect(result.totalDiscount).toBe(19000)
    })
  })
})
