import { CartItem, Coupon } from "../../../types";

export const calculateItemTotal = (item: CartItem) => {
  const { price } = item.product;
  const { quantity } = item;
  const maxDiscount = getMaxApplicableDiscount(item);
  return price * quantity * (1 - maxDiscount);
};

export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;
  return discounts.reduce((maxDiscount, d) => {
    return quantity >= d.quantity && d.rate > maxDiscount ? d.rate : maxDiscount;
  }, 0);
};

export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach(item => {
    const itemTotal = item.product.price * item.quantity;
    totalBeforeDiscount += itemTotal;
    totalAfterDiscount += calculateItemTotal(item);
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
    } else {
      totalAfterDiscount *= (1 - selectedCoupon.discountValue / 100);
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount)
  };
};

export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart.map(item => {
    if (item.product.id === productId) {
      const maxQuantity = item.product.stock;
      const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
      return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null;
    }
    return item;
  }).filter((item): item is CartItem => item !== null);
};