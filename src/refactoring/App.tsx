import { useState } from "react";
import { Cart as CartPage } from "./pages/Cart";
import { Admin as AdminPage } from "./pages/Admin";
import { useCoupons, useProducts } from "./hooks";
import { Button } from "./shared/ui/Button";
import { initialProducts, initialCoupons } from "./shared/data/data.ts";

const App = () => {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">쇼핑몰 관리 시스템</h1>
          <Button onClick={() => setIsAdmin(!isAdmin)} variant="secondary">
            {isAdmin ? "장바구니 페이지로" : "관리자 페이지로"}
          </Button>
        </div>
      </nav>
      <main className="container mx-auto mt-6">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onProductUpdate={updateProduct}
            onProductAdd={addProduct}
            onCouponAdd={addCoupon}
          />
        ) : (
          <CartPage products={products} coupons={coupons} />
        )}
      </main>
    </div>
  );
};

export default App;
