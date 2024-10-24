import { Product, CartItem } from "../../../types.ts";
import { ProductCard } from "./ProductCard.tsx";

interface ProductListProps {
  products: Product[];
  addToCart: (product: Product) => void;
  cart: CartItem[];
  getMaxDiscount: (discounts: { quantity: number; rate: number }[]) => number;
  getRemainingStock: (product: Product, cart: CartItem[]) => number;
}

export const ProductList = ({
  products,
  addToCart,
  cart,
  getMaxDiscount,
  getRemainingStock,
}: ProductListProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
      <div className="space-y-2">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            remainingStock={getRemainingStock(product, cart)}
            maxDiscount={getMaxDiscount(product.discounts)}
            onAddToCart={() => addToCart(product)}
          />
        ))}
      </div>
    </div>
  );
};
