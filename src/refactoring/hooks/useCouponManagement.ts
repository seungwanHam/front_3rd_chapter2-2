import { useState, useCallback } from 'react';
import { Coupon } from '../../types.ts';

export const useCouponManagement = (onCouponAdd: (newCoupon: Coupon) => void) => {
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0
  });

  const handleCouponChange = useCallback((field: keyof Coupon, value: string | number) => {
    setNewCoupon(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddCoupon = useCallback(() => {
    onCouponAdd(newCoupon);
    setNewCoupon({
      name: '',
      code: '',
      discountType: 'percentage',
      discountValue: 0
    });
  }, [newCoupon, onCouponAdd]);

  return { newCoupon, handleCouponChange, handleAddCoupon };
};