"use client";

import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [sellerInfo, setSellerInfo] = useState("");
  const [stockCount, setStockCount] = useState("");
  const [price, setPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [category, setCategory] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setProductImages((prevImages) => [
        ...prevImages,
        ...Array.from(files),
      ]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setProductImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!productName.match(/^[a-zA-Z]/)) {
      errors.productName = "Product name must start with a letter.";
    }
    if (!sellerInfo.match(/^[a-zA-Z0-9]/) || /[^a-zA-Z0-9.-]/.test(sellerInfo)) {
      errors.sellerInfo = "Seller info is invalid. Only letters, numbers, - and . are allowed.";
    }
    if (!stockCount.match(/^[0-9]+$/)) {
      errors.stockCount = "Stock count must be a number.";
    }
    if (!price.match(/^\d+(\.\d{1,2})?$/)) {
      errors.price = "Price must be a decimal number.";
    }
    if (discountedPrice && !discountedPrice.match(/^\d+(\.\d{1,2})?$/)) {
      errors.discountedPrice = "Discounted price must be a decimal number.";
    }
    if (!category.match(/^[a-zA-Z\s]+$/)) {
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
        productImages,
      };
      const existingProducts = JSON.parse(localStorage.getItem("products") || "[]");
      existingProducts.push(product);
      localStorage.setItem("products", JSON.stringify(existingProducts));
      alert("Product added successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-100">
      <div className="bg-white p-4 rounded-md shadow-md">
        <label className="block text-sm font-medium text-gray-700">Product Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          required
        />
        {formErrors.productName && <p className="text-red-500 text-sm">{formErrors.productName}</p>}
      </div>
      <div className="bg-white p-4 rounded-md shadow-md">
        <label className="block text-sm font-medium text-gray-700">Seller Info:</label>
        <input
          type="text"
          value={sellerInfo}
          onChange={(e) => setSellerInfo(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          required
        />
        {formErrors.sellerInfo && <p className="text-red-500 text-sm">{formErrors.sellerInfo}</p>}
      </div>
      <div className="bg-white p-4 rounded-md shadow-md">
        <label className="block text-sm font-medium text-gray-700">Stock Count:</label>
        <input
          type="number"
          value={stockCount}
          onChange={(e) => setStockCount(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          required
        />
        {formErrors.stockCount && <p className="text-red-500 text-sm">{formErrors.stockCount}</p>}
      </div>
      <div className="bg-white p-4 rounded-md shadow-md">
        <label className="block text-sm font-medium text-gray-700">Price:</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          required
        />
        {formErrors.price && <p className="text-red-500 text-sm">{formErrors.price}</p>}
      </div>
      <div className="bg-white p-4 rounded-md shadow-md">
        <label className="block text-sm font-medium text-gray-700">Discounted Price:</label>
        <input
          type="text"
          value={discountedPrice}
          onChange={(e) => setDiscountedPrice(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
        />
        {formErrors.discountedPrice && <p className="text-red-500 text-sm">{formErrors.discountedPrice}</p>}
      </div>
      <div className="bg-white p-4 rounded-md shadow-md">
        <label className="block text-sm font-medium text-gray-700">Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          required
        />
        {formErrors.category && <p className="text-red-500 text-sm">{formErrors.category}</p>}
      </div>
      <div className="bg-white p-4 rounded-md shadow-md">
        <label className="block text-sm font-medium text-gray-700">Product Images:</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {productImages.map((image, index) => (
            <div key={index} className="relative w-24 h-24 bg-gray-200 flex items-center justify-center">
              <img
                src={URL.createObjectURL(image)}
                alt={`Product ${index}`}
                className="object-cover w-full h-full rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
              >
                <AiOutlineClose />
              </button>
            </div>
          ))}
        </div>
      </div>
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 mt-2 rounded-md">Add Product</button>
    </form>
  );
};

export default AddProduct;
