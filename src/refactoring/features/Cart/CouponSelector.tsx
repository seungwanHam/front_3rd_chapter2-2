import { Coupon } from '../../../types.ts';
import { Select } from '../../shared/ui/Select.tsx';
import { CouponCard } from './CouponCard.tsx';

interface CouponSelectorProps {
  coupons: Coupon[];
  applyCoupon: (coupon: Coupon) => void;
  selectedCoupon: Coupon | null;
}

export const CouponSelector = ({ coupons, applyCoupon, selectedCoupon }: CouponSelectorProps) => {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
      <Select
        label="쿠폰 선택"
        onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
        value={selectedCoupon ? coupons.findIndex(c => c.code === selectedCoupon.code).toString() : ""}
      >
        <option value="">쿠폰 선택</option>
        {coupons.map((coupon, index) => (
          <option key={coupon.code} value={index}>
            {coupon.name}
          </option>
        ))}
      </Select>
      {selectedCoupon && (
        <CouponCard coupon={selectedCoupon} isSelected={true} />
      )}
    </div>
  );
};