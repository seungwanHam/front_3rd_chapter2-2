import { Product } from "../../../types";
import { Input } from "../../shared/ui/Input";
import { Button } from "../../shared/ui/Button";
import { useProductNewForm } from "../../hooks/useProductNewForm";

interface ProductNewFormProps {
  onProductAdd: (newProduct: Product) => void;
  onCancel: () => void;
}

export const ProductNewForm = ({ onProductAdd, onCancel }: ProductNewFormProps) => {
  const { newProduct, handleProductChange, handleAddNewProduct } = useProductNewForm(onProductAdd, onCancel);

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>
      <div className="mb-2">
        <Input
          id="productName"
          label="상품명"
          type="text"
          value={newProduct.name}
          onChange={(e) => handleProductChange("name", e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <Input
          id="productPrice"
          label="가격"
          type="number"
          value={newProduct.price}
          onChange={(e) =>
            handleProductChange("price", parseInt(e.target.value))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-2">
        <Input
          id="productStock"
          label="재고"
          type="number"
          value={newProduct.stock}
          onChange={(e) => handleProductChange("stock", parseInt(e.target.value))}
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
