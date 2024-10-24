import { useState } from "react";
import { describe, expect, test, vi } from "vitest";
import { act, fireEvent, render, renderHook, screen, within } from "@testing-library/react";
import { Cart as CartPage } from "../../refactoring/pages/Cart";
import { Admin as AdminPage } from "../../refactoring/pages/Admin";
import { Coupon, Product } from "../../types.ts";
import { useCart } from '../../refactoring/hooks/useCart';
import { useCoupons } from '../../refactoring/hooks/useCoupons';
import { useProducts } from '../../refactoring/hooks/useProducts';
import { useProductNewForm } from '../../refactoring/hooks/useProductNewForm';
import { useCouponManagement } from '../../refactoring/hooks/useCouponManagement';
import { useProductManagement } from '../../refactoring/hooks/useProductManagement';
import * as cartUtils from '../../refactoring/utils/cartUtils';
import * as couponUtils from '../../refactoring/utils/couponUtils';
import * as productUtils from '../../refactoring/utils/productUtils';

const mockProducts: Product[] = [
  {
    id: "p1",
    name: "상품1",
    price: 10000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.1 }],
  },
  {
    id: "p2",
    name: "상품2",
    price: 20000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.15 }],
  },
  {
    id: "p3",
    name: "상품3",
    price: 30000,
    stock: 20,
    discounts: [{ quantity: 10, rate: 0.2 }],
  },
];
const mockCoupons: Coupon[] = [
  {
    name: "5000원 할인 쿠폰",
    code: "AMOUNT5000",
    discountType: "amount",
    discountValue: 5000,
  },
  {
    name: "10% 할인 쿠폰",
    code: "PERCENT10",
    discountType: "percentage",
    discountValue: 10,
  },
];

const TestAdminPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const handleProductAdd = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  const handleCouponAdd = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return (
    <AdminPage
      products={products}
      coupons={coupons}
      onProductUpdate={handleProductUpdate}
      onProductAdd={handleProductAdd}
      onCouponAdd={handleCouponAdd}
    />
  );
};

describe("advanced > ", () => {
  describe("시나리오 테스트 > ", () => {
    test("장바구니 페이지 테스트 > ", async () => {
      render(<CartPage products={mockProducts} coupons={mockCoupons} />);
      const product1 = screen.getByTestId("product-p1");
      const product2 = screen.getByTestId("product-p2");
      const product3 = screen.getByTestId("product-p3");
      const addToCartButtonsAtProduct1 =
        within(product1).getByText("장바구니에 추가");
      const addToCartButtonsAtProduct2 =
        within(product2).getByText("장바구니에 추가");
      const addToCartButtonsAtProduct3 =
        within(product3).getByText("장바구니에 추가");

      // 1. 상품 정보 표시
      expect(product1).toHaveTextContent("상품1");
      expect(product1).toHaveTextContent("10,000원");
      expect(product1).toHaveTextContent("재고: 20개");
      expect(product2).toHaveTextContent("상품2");
      expect(product2).toHaveTextContent("20,000원");
      expect(product2).toHaveTextContent("재고: 20개");
      expect(product3).toHaveTextContent("상품3");
      expect(product3).toHaveTextContent("30,000원");
      expect(product3).toHaveTextContent("재고: 20개");

      // 2. 할인 정보 표시
      expect(screen.getByText("10개 이상: 10% 할인")).toBeInTheDocument();

      // 3. 상품1 장바구니에 상품 추가
      fireEvent.click(addToCartButtonsAtProduct1); // 상품1 추가

      // 4. 할인율 계산
      expect(screen.getByText("상품 금액: 10,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 0원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 10,000원")).toBeInTheDocument();

      // 5. 상품 품절 상태로 만들기
      for (let i = 0; i < 19; i++) {
        fireEvent.click(addToCartButtonsAtProduct1);
      }

      // 6. 품절일 때 상품 추가 안 되는지 확인하기
      expect(product1).toHaveTextContent("재고: 0개");
      fireEvent.click(addToCartButtonsAtProduct1);
      expect(product1).toHaveTextContent("재고: 0개");

      // 7. 할인율 계산
      expect(screen.getByText("상품 금액: 200,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 20,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 180,000원")).toBeInTheDocument();

      // 8. 상품을 각각 10개씩 추가하기
      fireEvent.click(addToCartButtonsAtProduct2); // 상품2 추가
      fireEvent.click(addToCartButtonsAtProduct3); // 상품3 추가

      const increaseButtons = screen.getAllByText("+");
      for (let i = 0; i < 9; i++) {
        fireEvent.click(increaseButtons[1]); // 상품2
        fireEvent.click(increaseButtons[2]); // 상품3
      }

      // 9. 할인율 계산
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 110,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 590,000원")).toBeInTheDocument();

      // 10. 쿠폰 적용하기
      const couponSelect = screen.getByRole("combobox");
      fireEvent.change(couponSelect, { target: { value: "1" } }); // 10% 할인 쿠폰 선택

      // 11. 할인율 계산
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 169,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 531,000원")).toBeInTheDocument();

      // 12. 다른 할인 쿠폰 적용하기
      fireEvent.change(couponSelect, { target: { value: "0" } }); // 5000원 할인 쿠폰
      expect(screen.getByText("상품 금액: 700,000원")).toBeInTheDocument();
      expect(screen.getByText("할인 금액: 115,000원")).toBeInTheDocument();
      expect(screen.getByText("최종 결제 금액: 585,000원")).toBeInTheDocument();
    });

    test("관리자 페이지 테스트 > ", async () => {
      render(<TestAdminPage />);

      const $product1 = screen.getByTestId("product-1");

      // 1. 새로운 상품 추가
      fireEvent.click(screen.getByText("새 상품 추가"));

      fireEvent.change(screen.getByLabelText("상품명"), {
        target: { value: "상품4" },
      });
      fireEvent.change(screen.getByLabelText("가격"), {
        target: { value: "15000" },
      });
      fireEvent.change(screen.getByLabelText("재고"), {
        target: { value: "30" },
      });

      fireEvent.click(screen.getByText("추가"));

      const $product4 = screen.getByTestId("product-4");

      expect($product4).toHaveTextContent("상품4");
      expect($product4).toHaveTextContent("15000원");
      expect($product4).toHaveTextContent("재고: 30");

      // 2. 상품 선택 및 수정
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId("toggle-button"));
      fireEvent.click(within($product1).getByTestId("modify-button"));

      act(() => {
        fireEvent.change(within($product1).getByDisplayValue("20"), {
          target: { value: "25" },
        });
        fireEvent.change(within($product1).getByDisplayValue("10000"), {
          target: { value: "12000" },
        });
        fireEvent.change(within($product1).getByDisplayValue("상품1"), {
          target: { value: "수정된 상품1" },
        });
      });

      fireEvent.click(within($product1).getByText("수정 완료"));

      expect($product1).toHaveTextContent("수정된 상품1");
      expect($product1).toHaveTextContent("12000원");
      expect($product1).toHaveTextContent("재고: 25");

      // 3. 상품 할인율 추가 및 삭제
      fireEvent.click($product1);
      fireEvent.click(within($product1).getByTestId("modify-button"));

      // 할인 추가
      act(() => {
        fireEvent.change(screen.getByPlaceholderText("수량"), {
          target: { value: "5" },
        });
        fireEvent.change(screen.getByPlaceholderText("할인율 (%)"), {
          target: { value: "5" },
        });
      });
      fireEvent.click(screen.getByText("할인 추가"));

      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).toBeInTheDocument();

      // 할인 삭제
      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).toBeInTheDocument();

      fireEvent.click(screen.getAllByText("삭제")[0]);
      expect(
        screen.queryByText("10개 이상 구매 시 10% 할인")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("5개 이상 구매 시 5% 할인")
      ).not.toBeInTheDocument();

      // 4. 쿠폰 추가
      fireEvent.change(screen.getByPlaceholderText("쿠폰 이름"), {
        target: { value: "새 쿠폰" },
      });
      fireEvent.change(screen.getByPlaceholderText("쿠폰 코드"), {
        target: { value: "NEW10" },
      });
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "percentage" },
      });
      fireEvent.change(screen.getByPlaceholderText("할인 값"), {
        target: { value: "10" },
      });

      fireEvent.click(screen.getByText("쿠폰 추가"));

      const $newCoupon = screen.getByTestId("coupon-3");

      expect($newCoupon).toHaveTextContent("새 쿠폰 (NEW10):10% 할인");
    });
  });

describe('Custom Hooks and Utility Functions', () => {
  // useCart 훅 테스트
  describe('useCart Hook', () => {
    test('상품을 장바구니에 추가할 수 있어야 한다', () => {
      const { result } = renderHook(() => useCart());
      const testProduct = { id: '1', name: 'Test Product', price: 100, stock: 10, discounts: [] };

      act(() => {
        result.current.addToCart(testProduct);
      });

      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0].product).toEqual(testProduct);
    });

    test('쿠폰을 적용할 수 있어야 한다', () => {
      const { result } = renderHook(() => useCart());
      const testCoupon = { name: 'Test Coupon', code: 'TEST', discountType: 'percentage' as 'percentage', discountValue: 10 };

      act(() => {
        result.current.applyCoupon(testCoupon);
      });

      expect(result.current.selectedCoupon).toEqual(testCoupon);
    });
  });

  // useCoupons 훅 테스트
  describe('useCoupons Hook', () => {
    test('초기 쿠폰 목록을 설정할 수 있어야 한다', () => {
      const initialCoupons = [{ name: 'Test Coupon', code: 'TEST', discountType: 'amount' as 'amount', discountValue: 5000 }];
      const { result } = renderHook(() => useCoupons(initialCoupons));

      expect(result.current.coupons).toEqual(initialCoupons);
    });

    test('새로운 쿠폰을 추가할 수 있어야 한다', () => {
      const { result } = renderHook(() => useCoupons([]));
      const newCoupon = { name: 'New Coupon', code: 'NEW', discountType: 'amount' as 'amount', discountValue: 1000 };

      act(() => {
        result.current.addCoupon(newCoupon);
      });

      expect(result.current.coupons).toHaveLength(1);
      expect(result.current.coupons[0]).toEqual(newCoupon);
    });
  });

  // useProducts 훅 테스트
  describe('useProducts Hook', () => {
    test('초기 상품 목록을 설정할 수 있어야 한다', () => {
      const initialProducts = [{ id: '1', name: 'Test Product', price: 100, stock: 10, discounts: [] }];
      const { result } = renderHook(() => useProducts(initialProducts));

      expect(result.current.products).toEqual(initialProducts);
    });

    test('새로운 상품을 추가할 수 있어야 한다', () => {
      const { result } = renderHook(() => useProducts([]));
      const newProduct = { id: '2', name: 'New Product', price: 200, stock: 5, discounts: [] };

      act(() => {
        result.current.addProduct(newProduct);
      });

      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0]).toEqual(newProduct);
    });
  });

  // useProductManagement 훅 테스트
  describe('useProductManagement Hook', () => {
    test('상품을 업데이트할 수 있어야 한다', () => {
      const initialProducts = [{ id: '1', name: 'Test Product', price: 100, stock: 10, discounts: [] }];
      const onProductUpdate = vi.fn();
      const { result } = renderHook(() => useProductManagement(initialProducts, onProductUpdate));

      act(() => {
        result.current.handleProductUpdate('1', 'price', 200);
      });

      expect(onProductUpdate).toHaveBeenCalledWith(expect.objectContaining({ id: '1', price: 200 }));
    });
  });

  // cartUtils 유틸 함수 테스트
  describe('cartUtils', () => {
    test('calculateItemTotal은 할인 없이 총 금액을 계산해야 한다', () => {
      const product = { id: '1', name: 'Test Product', price: 100, stock: 10, discounts: [] };
      const item = { product, quantity: 1 };
      const total = cartUtils.calculateItemTotal(item);

      expect(total).toBe(100);
    });

    test('getMaxApplicableDiscount는 올바른 할인율을 반환해야 한다', () => {
      const product = { id: '1', name: 'Test Product', price: 100, stock: 10, discounts: [{ quantity: 2, rate: 0.1 }] };
      const item = { product, quantity: 2 };
      const discount = cartUtils.getMaxApplicableDiscount(item);

      expect(discount).toBe(0.1);
    });
  });

  // couponUtils 유틸 함수 테스트
  describe('couponUtils', () => {
    test('validateCoupon은 유효한 쿠폰에 대해 true를 반환해야 한다', () => {
      const validCoupon = { name: 'Valid Coupon', code: 'VALID', discountType: 'amount' as 'amount', discountValue: 1000 };
      const isValid = couponUtils.validateCoupon(validCoupon);

      expect(isValid).toBe(true);
    });

    test('applyCouponDiscount는 금액 할인 적용을 올바르게 해야 한다', () => {
      const coupon = { name: 'Amount Coupon', code: 'AMOUNT', discountType: 'amount' as 'amount', discountValue: 500 };
      const discountedTotal = couponUtils.applyCouponDiscount(2000, coupon);

      expect(discountedTotal).toBe(1500);
    });
  });

  // productUtils 유틸 함수 테스트
  describe('productUtils', () => {
    test('getMaxDiscount는 최대 할인율을 반환해야 한다', () => {
      const discounts = [{ quantity: 1, rate: 0.1 }, { quantity: 2, rate: 0.2 }];
      const maxDiscount = productUtils.getMaxDiscount(discounts);

      expect(maxDiscount).toBe(0.2);
    });

    test('getRemainingStock은 남은 재고를 계산해야 한다', () => {
      const product = { id: '1', name: 'Test Product', price: 100, stock: 10, discounts: [] };
      const cart = [{ product, quantity: 2 }];
      const remainingStock = productUtils.getRemainingStock(product, cart);

      expect(remainingStock).toBe(8);
    });
  });
});
});
