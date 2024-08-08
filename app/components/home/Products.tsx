"use client";

import { useState } from "react";

interface Product {
  id: number;
  productName: string;
  sellerInfo: string;
  stockCount: number;
  price: number;
  discountedPrice?: number;
  category: string;
  productImageUrls: string[];
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      try {
        return JSON.parse(savedProducts) as Product[];
      } catch (error) {
        console.error("Failed to parse products from localStorage", error);
      }
    }
    return [];
  });

  const [filter, setFilter] = useState({
    minPrice: "",
    maxPrice: "",
    hideOutOfStock: false,
  });

  const [activeImageIndexes, setActiveImageIndexes] = useState<number[]>(
    products.map(() => 0) 
  );

  const handleFilter = () => {
    const filteredProducts = products.filter((product) => {
      const price = product.discountedPrice || product.price;

      if (filter.minPrice && price < Number(filter.minPrice)) return false;
      if (filter.maxPrice && price > Number(filter.maxPrice)) return false;
      if (filter.hideOutOfStock && product.stockCount === 0) return false;
      return true;
    });
    setProducts(filteredProducts);
  };

  const handleScroll = (direction: "left" | "right", productIndex: number) => {
    const images = products[productIndex].productImageUrls;
    setActiveImageIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      const currentIndex = newIndexes[productIndex];
      if (direction === "left") {
        newIndexes[productIndex] = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      } else {
        newIndexes[productIndex] = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      }
      return newIndexes;
    });
  };

  return (
    <div className="p-4 flex">
      <div className="w-1/4 p-4 border-r">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Price:</label>
          <input
            type="text"
            value={filter.minPrice}
            onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Price:</label>
          <input
            type="text"
            value={filter.maxPrice}
            onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
          />
        </div>
        <div>
          <label className="inline-flex items-center mt-2">
            <input
              type="checkbox"
              checked={filter.hideOutOfStock}
              onChange={(e) => setFilter({ ...filter, hideOutOfStock: e.target.checked })}
              className="form-checkbox"
            />
            <span className="ml-2">Hide Out of Stock</span>
          </label>
        </div>
        <button onClick={handleFilter} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md">
          Filter
        </button>
      </div>
      <div className="w-3/4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, productIndex) => (
            <div key={product.id} className="border p-4 rounded-md shadow-md">
              <div className="relative">
                {product.productImageUrls?.length > 0 && (
                  <div className="relative">
                    <div className="flex overflow-x-hidden space-x-2 pb-2">
                      {product.productImageUrls.map((image, imageIndex) => (
                        <img
                          key={imageIndex}
                          src={image}
                          alt={product.productName}
                          className={`object-cover h-40 w-full rounded-md ${imageIndex === activeImageIndexes[productIndex] ? 'block' : 'hidden'}`}
                        />
                      ))}
                    </div>
                    {product.productImageUrls.length > 1 && (
                      <>
                        <button
                          onClick={() => handleScroll("left", productIndex)}
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
                        >
                          &lt;
                        </button>
                        <button
                          onClick={() => handleScroll("right", productIndex)}
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
                        >
                          &gt;
                        </button>
                      </>
                    )}
                  </div>
                )}
                <div className="mt-4">
                  <h2 className="text-xl font-bold">{product.productName}</h2>
                  <p>Seller: {product.sellerInfo}</p>
                  <p>Category: {product.category}</p>
                  <p>Price: {product.price} TL</p>
                  {product.discountedPrice && <p className="text-red-500">Discounted Price: {product.discountedPrice} TL</p>}
                  <button
                    onClick={() => (window.location.href = `/product-detail/${product.id}`)}
                    className="bg-green-500 text-white px-4 py-2 mt-2 rounded-md"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
