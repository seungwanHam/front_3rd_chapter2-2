import { Coupon } from '../../types.ts';

export const validateCoupon = (coupon: Coupon): boolean => {
  if (!coupon.name || !coupon.code) {
    return false;
  }
  if (coupon.discountType !== 'amount' && coupon.discountType !== 'percentage') {
    return false;
  }
  if (coupon.discountValue < 0) {
    return false;
  }
  if (coupon.discountType === 'percentage' && coupon.discountValue > 100) {
    return false;
  }
  return true;
};

export const applyCouponDiscount = (totalAmount: number, coupon: Coupon): number => {
  if (coupon.discountType === 'amount') {
    return Math.max(0, totalAmount - coupon.discountValue);
  } else {
    return totalAmount * (1 - coupon.discountValue / 100);
  }
};

export const formatCouponDiscount = (coupon: Coupon): string => {
  return coupon.discountType === 'amount'
    ? `${coupon.discountValue}원`
    : `${coupon.discountValue}%`;
};