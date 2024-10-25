import { createContext, useContext, useState } from "react"
import { initialCoupons, initialProducts } from "./mockData"
import { Product } from "../entities/product/Product.ts"
import { Cart } from "../entities/cart/Cart.ts"
import { Coupon } from "../entities/coupon/Coupon.ts"

export const createContextHook = <T, U>(useStoreState: (props: U) => T) => {
  const Context = createContext({} as T)

  function ContextProvider({ children, ...props }: U) {
    return <Context.Provider value={useStoreState(props)}>{children}</Context.Provider>
  }

  function useStoreContext() {
    const context = useContext(Context)
    if (!context) {
      throw new Error("must be used within ContextProvider")
    }
    return context as ReturnType<typeof useStoreState>
  }

  return [ContextProvider, useStoreContext] as const
}

export const [CartPageContextProvider, useCartPage] = createContextHook(() => {
  const useProduct = () => {
    const [products, setProducts] = useState<Product[]>(initialProducts)

    return new (class {
      products = products
      setProducts = setProducts
    })()
  }

  const useCart = () => {
    const [cart, setCart] = useState<Cart>([])

    // @NOTE: 이렇게 하는게 더 가독성이 좋으나 이 방식은 typescript 참조를 잘 못한다. (좀 개선좀 해주라. ㅠ)
    // return {
    //   cart,
    //   setCart,
    // }

    return new (class {
      cart = cart
      setCart = setCart
    })()
  }

  const useCoupon = () => {
    const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

    return new (class {
      coupons = coupons
      setCoupons = setCoupons
      selectedCoupon = selectedCoupon
      setSelectedCoupon = setSelectedCoupon
    })()
  }

  const useAdmin = () => {
    const [isShowNewProductForm, setIsShowNewProductForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set())

    return new (class {
      isShowNewProductForm = isShowNewProductForm
      setIsShowNewProductForm = setIsShowNewProductForm

      editingProduct = editingProduct
      setEditingProduct = setEditingProduct

      openProductIds = openProductIds
      setOpenProductIds = setOpenProductIds
    })()
  }

  return new (class {
    useProduct = useProduct()
    useCart = useCart()
    useCoupon = useCoupon()

    useAdmin = useAdmin()
  })()
})

export const useProduct = () => useCartPage().useProduct
export const useCart = () => useCartPage().useCart
export const useCoupon = () => useCartPage().useCoupon
export const useAdmin = () => useCartPage().useAdmin
