import { Key, useState } from "react"
import { Coupon, Discount, Product } from "../../types"
import { useAdmin, useCoupon, useProduct } from "../store/store.tsx"

// entities/Product
const addProductDiscount = (prdocut: Product, newDiscount: Discount) => ({
  ...prdocut,
  discounts: [...prdocut.discounts, newDiscount],
})

const removeProductDiscountByIndex = (product: Product, index: number) => ({
  ...product,
  discounts: product.discounts.filter((_, i) => i !== index),
})

// entities/Products
const getProductById = (products: Product[], productId: string) => products.find((p) => p.id === productId)

const replaceProductInProducts = (prevProducts: Product[], updatedProduct: Product) => {
  return prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
}

const updateEditingProductName = (editingProduct: Product | null, name: string) => {
  return editingProduct ? { ...editingProduct, name: name } : null
}

const updateEditingProductPrice = (editingProduct: Product | null, price: number) => {
  return editingProduct ? { ...editingProduct, price: price } : null
}

const updateEditingProductStock = (editingProduct: Product | null, stock: number) => {
  return editingProduct ? { ...editingProduct, stock: stock } : null
}

// widgets/Product/ui
function ModifyProductDiscountForm({ product }: { product: Product }) {
  const { editingProduct, setEditingProduct } = useAdmin()
  if (!(editingProduct && editingProduct.id === product.id)) return <></>

  const { products, setProducts } = useProduct()

  const initialDiscountInput: Discount = { quantity: 0, rate: 0 }
  const [discountInput, setDiscountInput] = useState<Discount>(initialDiscountInput)

  const handleAddDiscount = (productId: string) => {
    const updatedProduct = getProductById(products, productId)
    if (!updatedProduct) {
      return
    }

    const newProduct = addProductDiscount(updatedProduct, discountInput)
    setProducts((products) => replaceProductInProducts(products, newProduct))

    setEditingProduct(newProduct)
    setDiscountInput(initialDiscountInput)
  }

  const handleRemoveDiscount = (productId: string, index: number) => {
    const updatedProduct = getProductById(products, productId)
    if (!updatedProduct) {
      return
    }

    const newProduct = removeProductDiscountByIndex(updatedProduct, index)
    setProducts((products) => replaceProductInProducts(products, newProduct))

    setEditingProduct(newProduct)
  }

  return (
    <div>
      <h4 className="text-lg font-semibold mb-2">할인 정보</h4>

      {editingProduct.discounts.map((discount, index) => (
        <div key={index} className="flex justify-between items-center mb-2">
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>

          <button
            onClick={() => handleRemoveDiscount(product.id, index)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            삭제
          </button>
        </div>
      ))}

      <div className="flex space-x-2">
        <input
          type="number"
          placeholder="수량"
          value={discountInput.quantity}
          onChange={(e) => setDiscountInput({ ...discountInput, quantity: parseInt(e.target.value) })}
          className="w-1/3 p-2 border rounded"
        />
        <input
          type="number"
          placeholder="할인율 (%)"
          value={discountInput.rate * 100}
          onChange={(e) => setDiscountInput({ ...discountInput, rate: parseInt(e.target.value) / 100 })}
          className="w-1/3 p-2 border rounded"
        />

        <button
          onClick={() => handleAddDiscount(product.id)}
          className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          할인 추가
        </button>
      </div>
    </div>
  )
}

//
function AdminProductModifyForm({ product }: { product: Product }) {
  const { editingProduct, setEditingProduct } = useAdmin()
  if (!(editingProduct && editingProduct.id === product.id)) return <></>

  const { setProducts } = useProduct()

  function handleNameUpdate(newName: string) {
    setEditingProduct((editingProduct) => updateEditingProductName(editingProduct, newName))
  }

  function handlePriceUpdate(newPrice: number) {
    setEditingProduct((editingProduct) => updateEditingProductPrice(editingProduct, newPrice))
  }

  const handleStockUpdate = (newStock: number) => {
    setEditingProduct((editingProduct) => updateEditingProductStock(editingProduct, newStock))
  }

  // 수정 완료 핸들러 함수 추가
  const handleEditComplete = () => {
    setProducts((products) => replaceProductInProducts(products, editingProduct))
    setEditingProduct(null)
  }

  return (
    <div>
      <div className="mb-4">
        <label className="block mb-1">상품명: </label>
        <input
          type="text"
          value={editingProduct.name}
          onChange={(e) => handleNameUpdate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">가격: </label>
        <input
          type="number"
          value={editingProduct.price}
          onChange={(e) => handlePriceUpdate(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">재고: </label>
        <input
          type="number"
          value={editingProduct.stock}
          onChange={(e) => handleStockUpdate(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* 할인 정보 수정 부분 */}
      <ModifyProductDiscountForm product={product} />

      <button
        onClick={handleEditComplete}
        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
      >
        수정 완료
      </button>
    </div>
  )
}

function ModifyProductButton({ product }: { product: Product }) {
  const { setEditingProduct } = useAdmin()

  function handleEditProduct(product: Product) {
    setEditingProduct({ ...product })
  }

  return (
    <button
      data-testid="modify-button"
      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
      onClick={() => handleEditProduct(product)}
    >
      수정
    </button>
  )
}

// widgets/Product/ui
function AdminProductDiscountModifyForm({ product }: { product: Product }) {
  return (
    <div>
      {product.discounts.map((discount, index) => (
        <div key={index} className="mb-2">
          <span>
            {discount.quantity}개 이상 구매 시 {discount.rate * 100}% 할인
          </span>
        </div>
      ))}

      <ModifyProductButton product={product} />
    </div>
  )
}

// widgets/Product/ui
function AdminProductView({ product, index }: { key: Key; product: Product; index: number }) {
  const { openProductIds, setOpenProductIds, editingProduct } = useAdmin()

  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  return (
    <div data-testid={`product-${index + 1}`} className="bg-white p-4 rounded shadow">
      <button
        data-testid="toggle-button"
        className="w-full text-left font-semibold"
        onClick={() => toggleProductAccordion(product.id)}
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>

      {openProductIds.has(product.id) && (
        <>
          <div className="mt-2">
            {editingProduct && editingProduct.id === product.id ? (
              <AdminProductModifyForm product={product} />
            ) : (
              <AdminProductDiscountModifyForm product={product} />
            )}
          </div>
        </>
      )}
    </div>
  )
}

function SectionCouponList() {
  const { coupons } = useCoupon()
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">현재 쿠폰 목록</h3>

      <div className="space-y-2">
        {coupons.map((coupon, index) => (
          <div key={index} data-testid={`coupon-${index + 1}`} className="bg-gray-100 p-2 rounded">
            {coupon.name} ({coupon.code}):
            {coupon.discountType === "amount" ? `${coupon.discountValue}원` : `${coupon.discountValue}%`} 할인
          </div>
        ))}
      </div>
    </div>
  )
}

function NewProductForm() {
  const { setIsShowNewProductForm } = useAdmin()
  const { setProducts } = useProduct()

  const initialProduct: Omit<Product, "id"> = {
    name: "",
    price: 0,
    stock: 0,
    discounts: [],
  }

  const [newProduct, setNewProduct] = useState(initialProduct)

  function handleAddNewProduct() {
    const productWithId = { ...newProduct, id: Date.now().toString() }
    setProducts((prevProducts) => [...prevProducts, productWithId])
    setNewProduct(initialProduct)
    setIsShowNewProductForm(false)
  }

  function handleSetProductName(name: string) {
    setNewProduct({ ...newProduct, name: name })
  }

  function handleSetProductPrice(price: number) {
    setNewProduct({ ...newProduct, price: price })
  }

  function handleSetProductStock(stock: number) {
    setNewProduct({ ...newProduct, stock: stock })
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-xl font-semibold mb-2">새 상품 추가</h3>

      <div className="mb-2">
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
          상품명
        </label>
        <input
          className="w-full p-2 border rounded"
          id="productName"
          type="text"
          value={newProduct.name}
          onChange={(e) => handleSetProductName(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
          가격
        </label>
        <input
          className="w-full p-2 border rounded"
          id="productPrice"
          type="number"
          value={newProduct.price}
          onChange={(e) => handleSetProductPrice(+e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label htmlFor="productStock" className="block text-sm font-medium text-gray-700">
          재고
        </label>
        <input
          className="w-full p-2 border rounded"
          id="productStock"
          type="number"
          value={newProduct.stock}
          onChange={(e) => handleSetProductStock(+e.target.value)}
        />
      </div>

      <button onClick={handleAddNewProduct} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        추가
      </button>
    </div>
  )
}

function SectionAdminProductList() {
  const { products } = useProduct()
  const { setIsShowNewProductForm, isShowNewProductForm } = useAdmin()

  function handleToggleNewProductForm() {
    setIsShowNewProductForm((showNewProductForm) => !showNewProductForm)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
        onClick={handleToggleNewProductForm}
      >
        {isShowNewProductForm ? "취소" : "새 상품 추가"}
      </button>

      {isShowNewProductForm && <NewProductForm />}

      <div className="space-y-2">
        {products.map((product, index) => (
          <AdminProductView key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  )
}

function SectionCouponManage() {
  const initialState: Coupon = {
    name: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
  }

  const [newCoupon, setNewCoupon] = useState<Coupon>(initialState)
  const { setCoupons } = useCoupon()

  function handleAddCoupon() {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon])
    setNewCoupon(initialState)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>

      <div className="bg-white p-4 rounded shadow">
        <div className="space-y-2 mb-4">
          <input
            type="text"
            placeholder="쿠폰 이름"
            value={newCoupon.name}
            onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="쿠폰 코드"
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-2">
            <select
              value={newCoupon.discountType}
              onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as "amount" | "percentage" })}
              className="w-full p-2 border rounded"
            >
              <option value="amount">금액(원)</option>
              <option value="percentage">할인율(%)</option>
            </select>

            <input
              type="number"
              placeholder="할인 값"
              value={newCoupon.discountValue}
              onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
            />
          </div>

          <button onClick={handleAddCoupon} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            쿠폰 추가
          </button>
        </div>

        <SectionCouponList />
      </div>
    </div>
  )
}

// pages/AdminPage
export const AdminPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionAdminProductList />
        <SectionCouponManage />
      </div>
    </div>
  )
}
