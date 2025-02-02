import React from 'react';
import { Product, Coupon } from '../../types.ts';
import { useCart } from "../hooks/useCart.ts";
import { ProductList } from '../features/Cart/ProductList.tsx';
import { CartList } from '../features/Cart/CartList.tsx';
import { CouponSelector } from '../features/Cart/CouponSelector.tsx';
import { OrderSummary } from '../features/Cart/OrderSummary.tsx';
import { getMaxDiscount, getRemainingStock } from '../utils/cartUtils.ts';

interface CartPageProps {
  products: Product[];
  coupons: Coupon[];
}

export const Cart: React.FC<CartPageProps> = ({ products, coupons }) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon
  } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } = calculateTotal();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductList 
          products={products} 
          addToCart={addToCart} 
          cart={cart}
          getMaxDiscount={getMaxDiscount}
          getRemainingStock={getRemainingStock}
        />
        <div>
          <CartList 
            cart={cart} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
          />
          <CouponSelector 
            coupons={coupons} 
            applyCoupon={applyCoupon} 
            selectedCoupon={selectedCoupon} 
          />
          <OrderSummary 
            totalBeforeDiscount={totalBeforeDiscount}
            totalAfterDiscount={totalAfterDiscount}
            totalDiscount={totalDiscount}
          />
        </div>
      </div>
    </div>
  );
};