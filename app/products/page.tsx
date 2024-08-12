"use client";
import { useState } from "react";
import { MdGridView, MdOutlineViewAgenda } from "react-icons/md";

const ITEMS_PER_PAGE = 12;
const PRICE_RANGE = {
  min: 0,
  max: 1000,
};

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
        return [];
      }
    }
    return [];
  });

  // State to manage filtered products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Filter state
  const [filter, setFilter] = useState({
    minPrice: PRICE_RANGE.min,
    maxPrice: PRICE_RANGE.max,
    hideOutOfStock: false,
  });

  const [activeImageIndexes, setActiveImageIndexes] = useState<number[]>(
    products.map(() => 0)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');

  // Function to update filtered products based on filter criteria
  const applyFilter = () => {
    const filtered = products.filter((product) => {
      const price = product.discountedPrice || product.price;
      if (price < filter.minPrice || price > filter.maxPrice) return false;
      if (filter.hideOutOfStock && product.stockCount === 0) return false;
      return true;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  // Function to clear all filters
  const clearFilter = () => {
    setFilter({
      minPrice: PRICE_RANGE.min,
      maxPrice: PRICE_RANGE.max,
      hideOutOfStock: false,
    });
    setFilteredProducts(products);
    setCurrentPage(1); // Reset to the first page
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Page change handler
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Filter slider change handler
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: parseInt(value, 10),
    }));
  };

  // Handle image scroll
  const handleScroll = (direction: "left" | "right", productIndex: number) => {
    setActiveImageIndexes((prevIndexes) => {
      const images = products[productIndex].productImageUrls;
      const currentIndex = prevIndexes[productIndex];
      let newIndex;

      if (direction === "left") {
        newIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
      } else {
        newIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
      }

      const newIndexes = [...prevIndexes];
      newIndexes[productIndex] = newIndex;

      return newIndexes;
    });
  };

  return (
    <div className="min-h-screen p-4 flex flex-col md:flex-row bg-cover bg-center" style={{ backgroundImage: 'url(/homePage-bg.avif)' }}>
      <div className="w-full md:w-1/4 p-4 mt-32 md:mt-32 bg-white bg-opacity-60 border-r rounded-md md:border-r-0 md:border-b">
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-light text-gray-700 p-4">Price Range:</label>
            <div className="flex flex-col">
              <input
                type="range"
                name="minPrice"
                min={PRICE_RANGE.min}
                max={PRICE_RANGE.max}
                value={filter.minPrice}
                onChange={handleSliderChange}
                className="w-full"
              />
              <input
                type="range"
                name="maxPrice"
                min={filter.minPrice}
                max={PRICE_RANGE.max}
                value={filter.maxPrice}
                onChange={handleSliderChange}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Min: {filter.minPrice}</span>
              <span>Max: {filter.maxPrice}</span>
            </div>
          </div>
          <div>
            <label className="inline-flex items-center mt-2">
              <input
                type="checkbox"
                checked={filter.hideOutOfStock}
                onChange={(e) => setFilter({ ...filter, hideOutOfStock: e.target.checked })}
                className="form-checkbox"
              />
              <span className="ml-2 font-light">Hide Out of Stock</span>
            </label>
          </div>
          <button onClick={applyFilter} className="bg-primaryDarkColor hover:bg-primaryLightColor text-white px-4 py-2 mt-4 rounded-md w-full">
            Filter
          </button>
          <button onClick={clearFilter} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 mt-2 rounded-md w-full">
            Clear Filter
          </button>
        </div>
      </div>
      <div className="w-full md:w-3/4 px-4 mt-32 md:mt-32">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 mr-2 rounded-md ${viewMode === 'grid' ? 'bg-primaryDarkColor text-white' : 'bg-gray-200'}`}
          >
            <MdGridView />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`px-4 py-2 rounded-md ${viewMode === 'compact' ? 'bg-primaryDarkColor text-white' : 'bg-gray-200'}`}
          >
            <MdOutlineViewAgenda />
          </button>
        </div>
        {paginatedProducts.length === 0 ? (
          <div className="rounded-md bg-slate-200 bg-opacity-50 flex justify-center items-center text-center text-lg font-bold text-gray-700">
            No products available :(
          </div>
        ) : (
          <>
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'}`}>
              {paginatedProducts.map((product, productIndex) => (
                <div key={product.id} className="border bg-white bg-opacity-80 p-4 rounded-md shadow-md">
                  <div className="relative">
                    {product.productImageUrls?.length > 0 && (
                      <div className="relative">
                        <div className="flex overflow-x-hidden space-x-2 pb-2">
                          {product.productImageUrls.map((image, imageIndex) => (
                            <img
                              key={imageIndex}
                              src={image}
                              alt={product.productName}
                              className={`object-cover ${viewMode === 'grid' ? 'h-40 w-full' : 'h-32 w-full'} rounded-md ${imageIndex === activeImageIndexes[productIndex] ? 'block' : 'hidden'}`}
                            />
                          ))}
                        </div>
                        {product.productImageUrls.length > 1 && (
                          <>
                            <button
                              onClick={() => handleScroll("left", productIndex)}
                              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full"
                            >
                              &lt;
                            </button>
                            <button
                              onClick={() => handleScroll("right", productIndex)}
                              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full"
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
                        className="bg-secondaryDarkColor hover:bg-secondaryLightColor text-white px-4 py-2 mt-2 rounded-md w-full"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-slate-500 bg-opacity-30 text-white px-4 py-2 rounded-md"
              >
                &lt; Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-primaryDarkColor text-white' : 'bg-gray-200'}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-slate-500 bg-opacity-30 text-white px-4 py-2 rounded-md"
              >
                Next &gt;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
