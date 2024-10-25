import { useCoupon } from "../../../store/store.tsx"
import { CouponSelector } from "../../../features/coupon/ui/CouponSelector.tsx"

export function SectionCouponApply() {
  const { selectedCoupon } = useCoupon()

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
