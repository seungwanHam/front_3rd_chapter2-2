import React from 'react';
import { CartItem } from '../../types';
import { Button } from './Button';

interface CartItemCardProps {
  item: CartItem;
  appliedDiscount: number;
  onUpdateQuantity: (newQuantity: number) => void;
  onRemove: () => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item, appliedDiscount, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;
  const discountedPrice = product.price * (1 - appliedDiscount);

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded shadow">
      <div>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">
          {product.price.toLocaleString()}원 x {quantity}
        </p>
        {appliedDiscount > 0 && (
          <p className="text-sm text-green-600">
            할인: {(appliedDiscount * 100).toFixed(0)}% 
            (개당 {discountedPrice.toLocaleString()}원)
          </p>
        )}
        <p className="font-medium">
          총 {(discountedPrice * quantity).toLocaleString()}원
        </p>
      </div>
      <div className="flex items-center">
        <Button
          onClick={() => onUpdateQuantity(quantity - 1)}
          disabled={quantity <= 1}
          variant="secondary"
          className="px-2 py-1 mr-1"
        >
          -
        </Button>
        <span className="mx-2">{quantity}</span>
        <Button
          onClick={() => onUpdateQuantity(quantity + 1)}
          disabled={quantity >= product.stock}
          variant="secondary"
          className="px-2 py-1 mr-1"
        >
          +
        </Button>
        <Button onClick={onRemove} variant="danger" className="px-2 py-1">
          삭제
        </Button>
      </div>
    </div>
  );
};