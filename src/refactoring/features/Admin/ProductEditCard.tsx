import { Product, Discount } from '../../../types';
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";

interface ProductEditCardProps {
  product: Product;
  index: number;
  isOpen: boolean;
  isEditing: boolean;
  newDiscount: Discount;
  onToggle: () => void;
  onEdit: () => void;
  onUpdate: (field: keyof Product, value: string | number) => void;
  onAddDiscount: () => void;
  onRemoveDiscount: (index: number) => void;
  onEditComplete: () => void;
  setNewDiscountField: (field: keyof Discount, value: number) => void;
}

export const ProductEditCard = ({
  product,
  index,
  isOpen,
  isEditing,
  newDiscount,
  onToggle,
  onEdit,
  onUpdate,
  onAddDiscount,
  onRemoveDiscount,
  onEditComplete,
  setNewDiscountField
}: ProductEditCardProps) => {
  return (
    <div data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
      <Button
        data-testid="toggle-button"
        onClick={onToggle}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </Button>
      {isOpen && (
        <div className="mt-2">
          {isEditing ? (
            <div>
              <Input
                label="상품명"
                type="text"
                value={product.name}
                onChange={(e) => onUpdate('name', e.target.value)}
              />
              <Input
                label="가격"
                type="number"
                value={product.price}
                onChange={(e) => onUpdate('price', parseInt(e.target.value))}
              />
              <Input
                label="재고"
                type="number"
                value={product.stock}
                onChange={(e) => onUpdate('stock', parseInt(e.target.value))}
              />
              <div>
                <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                {product.discounts.map((discount, idx) => (
                  <div key={idx} className="flex justify-between items-center mb-2">
                    <span>{discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인</span>
                    <Button onClick={() => onRemoveDiscount(idx)} variant="danger">
                      삭제
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="수량"
                    value={newDiscount.quantity}
                    onChange={(e) => setNewDiscountField('quantity', parseInt(e.target.value))}
                    className="w-1/3"
                  />
                  <Input
                    type="number"
                    placeholder="할인율 (%)"
                    value={newDiscount.rate * 100}
                    onChange={(e) => setNewDiscountField('rate', parseInt(e.target.value) / 100)}
                    className="w-1/3"
                  />
                  <Button onClick={onAddDiscount} variant="primary" className="w-1/3">
                    할인 추가
                  </Button>
                </div>
              </div>
              <Button onClick={onEditComplete} variant="primary" className="mt-2">
                수정 완료
              </Button>
            </div>
          ) : (
            <div>
              {product.discounts.map((discount, idx) => (
                <div key={idx} className="mb-2">
                  <span>{discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인</span>
                </div>
              ))}
              <Button data-testid="modify-button" onClick={onEdit} variant="primary" className="mt-2">
                수정
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};