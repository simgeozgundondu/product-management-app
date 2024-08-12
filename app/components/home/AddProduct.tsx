"use client";

import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface FormErrors {
  productName?: string;
  sellerInfo?: string;
  stockCount?: string;
  price?: string;
  discountedPrice?: string;
  category?: string;
}

const AddProduct = () => {
  const [productName, setProductName] = useState<string>("");
  const [sellerInfo, setSellerInfo] = useState<string>("");
  const [stockCount, setStockCount] = useState<number | undefined>(undefined);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [discountedPrice, setDiscountedPrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<string>("");
  const [productImageUrls, setProductImageUrls] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleAddImageUrl = () => {
    if (imageUrl) {
      setProductImageUrls((prevUrls) => [...prevUrls, imageUrl]);
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!/^[a-zA-Z]/.test(productName)) {
      errors.productName = "Product name must start with a letter.";
    }
    if (!sellerInfo.match(/^[a-zA-Z0-9]/) || /[^a-zA-Z0-9.-]/.test(sellerInfo)) {
      errors.sellerInfo = "Seller info is invalid. Only letters, numbers, - and . are allowed.";
    }
    if (stockCount === undefined || stockCount < 0) {
      errors.stockCount = "Stock count must be a positive number.";
    }
    if (price === undefined || price <= 0) {
      errors.price = "Price must be a positive decimal number.";
    }
    if (discountedPrice === undefined || discountedPrice < 0) {
      errors.discountedPrice = "Discounted price must be a non-negative decimal number.";
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
      const existingProducts = JSON.parse(localStorage.getItem("products") || "[]");
      existingProducts.push(product);
      localStorage.setItem("products", JSON.stringify(existingProducts));
      alert("Product added successfully!");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-customBackground p-6 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 my-4">Add Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4 w-[800px] mx-auto">
          <div className="bg-opacity-50 backdrop-blur-sm bg-orange-200 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 p-4">Product Name:</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              required
            />
            {formErrors.productName && <p className="text-red-500 text-sm">{formErrors.productName}</p>}

            <label className="block text-sm font-medium text-gray-700 p-4">Seller Info:</label>
            <input
              type="text"
              value={sellerInfo}
              onChange={(e) => setSellerInfo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              required
            />
            {formErrors.sellerInfo && <p className="text-red-500 text-sm">{formErrors.sellerInfo}</p>}

            <label className="block text-sm font-medium text-gray-700 p-4">Stock Count:</label>
            <input
              type="number"
              value={stockCount}
              onChange={(e) => setStockCount(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              required
            />
            {formErrors.stockCount && <p className="text-red-500 text-sm">{formErrors.stockCount}</p>}
            <label className="block text-sm font-medium text-gray-700 p-4">Price:</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              required
            />
            {formErrors.price && <p className="text-red-500 text-sm">{formErrors.price}</p>}
            <label className="block text-sm font-medium text-gray-700 p-4">Discounted Price:</label>
            <input
              type="number"
              step="0.01"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(Number(e.target.value))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            />
            {formErrors.discountedPrice && <p className="text-red-500 text-sm">{formErrors.discountedPrice}</p>}

            <label className="block text-sm font-medium text-gray-700 p-4">Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              required
            />
            {formErrors.category && <p className="text-red-500 text-sm">{formErrors.category}</p>}
            <div className="bg-opacity-50 backdrop-blur-sm bg-orange-100 rounded-md">
              <label className="block text-sm font-medium text-gray-700 p-4">Product Image URL:</label>
              <div className="flex items-center">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="mt-1 block flex-grow border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="ml-2 bg-blue-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center justify-center"
                >
                  Add Image
                </button>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {productImageUrls.map((url, index) => (
                <div key={index} className="relative w-24 h-24 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden shadow-md">
                  <img
                    src={url}
                    alt={`Product ${index}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-700 transition duration-200"
                  >
                    <AiOutlineClose size={16} />
                  </button>
                </div>
              ))}
            </div>

          </div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-indigo-600 transition duration-200">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;