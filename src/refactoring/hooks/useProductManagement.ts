import { useState, useCallback } from 'react';
import { Product, Discount } from '../../types';

type ProductUpdater = (productId: string, updater: (product: Product) => Product) => void;

export const useProductManagement = (initialProducts: Product[], onProductUpdate: (updatedProduct: Product) => void) => {
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newDiscount, setNewDiscount] = useState<Discount>({ quantity: 0, rate: 0 });

  const toggleProductAccordion = useCallback((productId: string) => {
    setOpenProductIds(prev => {
      const newSet = new Set(prev);
      if (prev.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  const updateProduct: ProductUpdater = useCallback((productId, updater) => {
    const product = initialProducts.find(p => p.id === productId);
    if (product) {
      const updatedProduct = updater(product);
      onProductUpdate(updatedProduct);
    }
  }, [initialProducts, onProductUpdate]);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProductId(product.id);
  }, []);

  const handleProductUpdate = useCallback((productId: string, field: keyof Product, value: string | number) => {
    updateProduct(productId, product => ({ ...product, [field]: value }));
  }, [updateProduct]);

  const handleEditComplete = useCallback(() => {
    setEditingProductId(null);
  }, []);

  const handleAddDiscount = useCallback((productId: string) => {
    updateProduct(productId, product => ({
      ...product,
      discounts: [...product.discounts, newDiscount]
    }));
    setNewDiscount({ quantity: 0, rate: 0 });
  }, [newDiscount, updateProduct]);

  const handleRemoveDiscount = useCallback((productId: string, index: number) => {
    updateProduct(productId, product => ({
      ...product,
      discounts: product.discounts.filter((_, i) => i !== index)
    }));
  }, [updateProduct]);

  const setNewDiscountField = useCallback((field: keyof Discount, value: number) => {
    setNewDiscount(prev => ({ ...prev, [field]: value }));
  }, []);

  return {
    openProductIds,
    editingProductId,
    newDiscount,
    toggleProductAccordion,
    handleEditProduct,
    handleProductUpdate,
    handleEditComplete,
    handleAddDiscount,
    handleRemoveDiscount,
    setNewDiscountField
  };
};