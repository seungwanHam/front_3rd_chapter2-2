import { Product } from '../../../types';
import { useProductManagement } from '../../hooks/useProductManagement';
import { ProductEditCard } from './ProductEditCard';

interface ProductManagementProps {
  products: Product[];
  onProductUpdate: (updatedProduct: Product) => void;
}

export const ProductManagement = ({ products, onProductUpdate }: ProductManagementProps) => {
  const {
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
  } = useProductManagement(products, onProductUpdate);

  return (
    <div className="space-y-2">
      {products.map((product, index) => (
        <ProductEditCard
          key={product.id}
          product={product}
          index={index}
          isOpen={openProductIds.has(product.id)}
          isEditing={editingProductId === product.id}
          newDiscount={newDiscount}
          onToggle={() => toggleProductAccordion(product.id)}
          onEdit={() => handleEditProduct(product)}
          onUpdate={(field, value) => handleProductUpdate(product.id, field, value)}
          onAddDiscount={() => handleAddDiscount(product.id)}
          onRemoveDiscount={(idx) => handleRemoveDiscount(product.id, idx)}
          onEditComplete={handleEditComplete}
          setNewDiscountField={setNewDiscountField}
        />
      ))}
    </div>
  );
};