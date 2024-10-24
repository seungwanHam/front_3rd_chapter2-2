import { useState, useCallback } from 'react';
import { Product } from '../../types.ts';

export const useProductNewForm = (onProductAdd: (newProduct: Product) => void, onCancel: () => void) => {
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: []
  });

  const handleProductChange = useCallback((field: keyof Omit<Product, 'id'>, value: string | number) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddNewProduct = useCallback(() => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct({ name: '', price: 0, stock: 0, discounts: [] });
    onCancel();
  }, [newProduct, onProductAdd, onCancel]);

  return { newProduct, handleProductChange, handleAddNewProduct };
};