import React, { useState } from 'react';
import { Product } from '../../../types';
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

interface NewProductFormProps {
  onProductAdd: (newProduct: Product) => void;
  onCancel: () => void;
}

export const NewProductForm: React.FC<NewProductFormProps> = ({ onProductAdd, onCancel }) => {
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: []
  });

  const handleAddNewProduct = () => {
    const productWithId = { ...newProduct, id: Date.now().toString() };
    onProductAdd(productWithId);
    setNewProduct({ name: '', price: 0, stock: 0, discounts: [] });
    onCancel();
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
      <div className="mb-2">
        <Input
          id="productName"
          label="상품명"
          type="text"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <Input
          id="productPrice"
          label="가격"
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <Input
          id="productStock"
          label="재고"
          type="number"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
          className="w-full p-2 border rounded"
        />
      </div>
      <Button
        onClick={handleAddNewProduct}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        추가
      </Button>
    </div>
  );
};