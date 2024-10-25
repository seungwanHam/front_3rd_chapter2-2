// features/Coupon/ui
import { useCoupon } from "../../../store/store.tsx"
import { Coupon } from "../../../entities/coupon/Coupon.ts"

export function CouponSelector() {
  const { coupons, setSelectedCoupon } = useCoupon()

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
        <option key={coupon.code} value={index}>
          {coupon.name} - {coupon.discountType === "amount" ? `${coupon.discountValue}원` : `${coupon.discountValue}%`}
        </option>
      ))}
    </select>
  )
}
