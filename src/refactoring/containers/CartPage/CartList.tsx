import React from 'react';
import { CartItem } from '../../../types';
import { CartItemCard } from '../../components/CartItemCard';
import { getAppliedDiscount } from '../../utils/cartUtils';

interface CartListProps {
  cart: CartItem[];
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
}

export const CartList: React.FC<CartListProps> = ({ cart, updateQuantity, removeFromCart }) => {

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
      <div className="space-y-2">
        {cart.map(item => (
          <CartItemCard
            key={item.product.id}
            item={item}
            appliedDiscount={getAppliedDiscount(item)}
            onUpdateQuantity={(newQuantity) => updateQuantity(item.product.id, newQuantity)}
            onRemove={() => removeFromCart(item.product.id)}
          />
        ))}
      </div>
    </div>
  );
};