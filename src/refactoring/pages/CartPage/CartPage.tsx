import { useProduct } from "../../store/store.tsx"
import { ProductView } from "../../widgets/product/ui/ProductView.tsx"
import { SectionCartSummary } from "../../widgets/cart/ui/SectionCartSummary.tsx"
import { SectionCartItemList } from "../../widgets/cart/ui/SectionCartItemList.tsx"
import { SectionCouponApply } from "../../widgets/coupon/ui/SectionCouponApply.tsx"

// pages/CartPage/ui
export function SectionProductList() {
  const { products } = useProduct()
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

// pages/CartPage/ui
export function SectionCartInfo() {
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

// pages/CartPage
export const CartPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/*상품 목록*/}
        <SectionProductList />

        {/*장바구니 내역*/}
        <SectionCartInfo />
      </div>
    </div>
  )
}
