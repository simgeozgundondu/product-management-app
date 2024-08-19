"use client";
import { useRef, useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import IMask from "imask";

interface FormErrors {
  productName?: string;
  sellerInfo?: string;
  stockCount?: string;
  price?: string;
  discountedPrice?: string;
  category?: string;
}

const AddProduct = () => {
  const stockCountRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const discountedPriceRef = useRef<HTMLInputElement | null>(null);

  const [productName, setProductName] = useState<string>("");
  const [sellerInfo, setSellerInfo] = useState<string>("");
  const [stockCount, setStockCount] = useState<number | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [discountedPrice, setDiscountedPrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<string>("");
  const [productImageUrls, setProductImageUrls] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (stockCountRef.current) {
      IMask(stockCountRef.current, {
        mask: Number,
        scale: 2,
        signed: false,
        thousandsSeparator: "",
        padFractionalZeros: true,
        normalizeZeros: true,
        radix: ".",
      });
    }

    if (priceRef.current) {
      IMask(priceRef.current, {
        mask: Number,
        scale: 2,
        signed: false,
        thousandsSeparator: "",
        padFractionalZeros: true,
        normalizeZeros: true,
        radix: ".",
      });
    }

    if (discountedPriceRef.current) {
      IMask(discountedPriceRef.current, {
        mask: Number,
        scale: 2,
        signed: false,
        thousandsSeparator: "",
        padFractionalZeros: true,
        normalizeZeros: true,
        radix: ".",
      });
    }
  }, []);

  const handleAddImageUrl = () => {
    if (imageUrl) {
      setProductImageUrls((prevUrls) => [...prevUrls, imageUrl]);
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductImageUrls((prevUrls) =>
      prevUrls.filter((_, i) => i !== index)
    );
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!/^[a-zA-Z]/.test(productName)) {
      errors.productName = "Product name must start with a letter.";
    }
    if (
      !sellerInfo.match(/^[a-zA-Z0-9]/) ||
      /[^a-zA-Z0-9.-]/.test(sellerInfo)
    ) {
      errors.sellerInfo =
        "Seller info is invalid. Only letters, numbers, - and . are allowed.";
    }
    if (stockCount === undefined || stockCount < 0) {
      errors.stockCount = "Stock count must be a positive number.";
    }
    if (price === undefined || price <= 0) {
      errors.price = "Price must be a positive decimal number.";
    }
    if (discountedPrice === undefined || discountedPrice < 0) {
      errors.discountedPrice =
        "Discounted price must be a non-negative decimal number.";
    }
    if (!/^[a-zA-Z\s]+$/.test(category)) {
      errors.category = "Category must contain only letters and spaces.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const product = {
        id: Date.now(),
        productName,
        sellerInfo,
        stockCount,
        price,
        discountedPrice,
        category,
        productImageUrls,
      };

      const existingProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );
      existingProducts.push(product);
      localStorage.setItem("products", JSON.stringify(existingProducts));
      alert("Product added successfully!");
      window.location.reload();
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url(/homePage-bg.avif)" }}
    >
      <div className="w-full max-w-md md:max-w-2xl mt-32 md:mt-32 bg-opacity-50 backdrop-blur-sm bg-slate-100 rounded-lg shadow-lg p-4 md:p-8">
        <h2 className="text-xl md:text-3xl font-semibold text-center text-gray-800 mt-4">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Name:
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              required
            />
            {formErrors.productName && (
              <p className="text-red-500 text-sm">{formErrors.productName}</p>
            )}

            <label className="block text-sm font-medium text-gray-700">
              Seller Info:
            </label>
            <input
              type="text"
              value={sellerInfo}
              onChange={(e) => setSellerInfo(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              required
            />
            {formErrors.sellerInfo && (
              <p className="text-red-500 text-sm">{formErrors.sellerInfo}</p>
            )}

            <label className="block text-sm font-medium text-gray-700">
              Stock Count:
            </label>
            <input
              ref={stockCountRef}
              type="text"
              value={stockCount === undefined ? "" : stockCount.toString()}
              onChange={(e) => setStockCount(Number(e.target.value))}
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              required
            />
            {formErrors.stockCount && (
              <p className="text-red-500 text-sm">{formErrors.stockCount}</p>
            )}

            <label className="block text-sm font-medium text-gray-700">
              Price:
            </label>
            <input
              ref={priceRef}
              type="text"
              value={price === undefined ? "" : price.toFixed(2)}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              required
            />
            {formErrors.price && (
              <p className="text-red-500 text-sm">{formErrors.price}</p>
            )}

            <label className="block text-sm font-medium text-gray-700">
              Discounted Price:
            </label>
            <input
              ref={discountedPriceRef}
              type="text"
              value={
                discountedPrice === undefined ? "" : discountedPrice.toFixed(2)
              }
              onChange={(e) => setDiscountedPrice(parseFloat(e.target.value))}
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            />
            {formErrors.discountedPrice && (
              <p className="text-red-500 text-sm">
                {formErrors.discountedPrice}
              </p>
            )}

            <label className="block text-sm font-medium text-gray-700">
              Category:
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              required
            />
            {formErrors.category && (
              <p className="text-red-500 text-sm">{formErrors.category}</p>
            )}

            <div className="bg-opacity-50 backdrop-blur-sm p-4 rounded-md mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Product Image URL:
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="block flex-grow border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Add Image
                </button>
              </div>
            </div>
            {productImageUrls.length > 0 && (
              <div className="mt-2 space-y-2">
                {productImageUrls.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-200 p-2 rounded-md"
                  >
                    <img
                      src={url}
                      alt={`Product Image ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <AiOutlineClose size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 w-full mt-4"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
