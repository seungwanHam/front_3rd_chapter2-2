import { Coupon } from '../../../types';
import { formatCouponDiscount } from '../../utils/couponUtils';

interface CouponCardProps {
  coupon: Coupon;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const CouponCard = ({ coupon, isSelected = false, onSelect }: CouponCardProps) => {
  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-100 border-blue-500' : 'bg-white hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <h3 className="text-lg font-semibold mb-2">{coupon.name}</h3>
      <p className="text-sm text-gray-600 mb-1">코드: {coupon.code}</p>
      <p className="text-sm font-medium text-blue-600">
        할인: {formatCouponDiscount(coupon)}
      </p>
    </div>
  );
};