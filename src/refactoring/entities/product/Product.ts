import { Cart, getCartItemByProductId } from "../cart/Cart.ts"

export interface Product {
  id: string
  name: string
  price: number
  stock: number
  discounts: Discount[]
}

export interface Discount {
  quantity: number
  rate: number
}

export type ProductId = Product["id"]

// entities/Product
export const addProductDiscount = (product: Product, newDiscount: Discount) => ({
  ...product,
  discounts: [...product.discounts, newDiscount],
})

export const removeProductDiscountByIndex = (product: Product, index: number) => ({
  ...product,
  discounts: product.discounts.filter((_, i) => i !== index),
})

// entities/Products
export const getProductById = (products: Product[], productId: string) => products.find((p) => p.id === productId)

export const replaceProductInProducts = (prevProducts: Product[], updatedProduct: Product) => {
  return prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
}

// entities/EditingProduct
export const updateEditingProductName = (editingProduct: Product | null, name: string) => {
  return editingProduct ? { ...editingProduct, name: name } : null
}

export const updateEditingProductPrice = (editingProduct: Product | null, price: number) => {
  return editingProduct ? { ...editingProduct, price: price } : null
}

export const updateEditingProductStock = (editingProduct: Product | null, stock: number) => {
  return editingProduct ? { ...editingProduct, stock: stock } : null
}

// entities/Product
export const getProductMaxDiscountRate = (discounts: { quantity: number; rate: number }[]) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0)
}

export const getProductRemainingStock = (product: Product, cart: Cart) => {
  const cartItem = getCartItemByProductId(cart, product.id)
  return product.stock - (cartItem?.quantity || 0)
}
