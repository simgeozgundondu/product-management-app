"use client";
import { useEffect, useState } from "react";
import { FcClearFilters, FcFilledFilter } from "react-icons/fc";
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

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filter, setFilter] = useState({

    minPrice: PRICE_RANGE.min,
    maxPrice: PRICE_RANGE.max,
    hideOutOfStock: false,
    selectedSellers: [] as string[],
    selectedCategories: [] as string[]
  });

  const [sellers, setSellers] = useState<string[]>([]);

  const [categories, setCategories] = useState<string[]>([]);

  const [currentImageIndexes, setCurrentImageIndexes] = useState<number[]>(
    products.map(() => 0)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const uniqueSellers = Array.from(new Set(products.map(p => p.sellerInfo)));
    setSellers(uniqueSellers);

    const unigueCategories = Array.from(new Set(products.map(p => p.category)));
    setCategories(unigueCategories);

  }, [products]);

  const handleSellerSelection = (seller: string) => {
    setFilter(prevFilter => {
      const { selectedSellers } = prevFilter;
      if (selectedSellers.includes(seller)) {
        return {
          ...prevFilter,
          selectedSellers: selectedSellers.filter(s => s !== seller),
        };
      } else {
        return {
          ...prevFilter,
          selectedSellers: [...selectedSellers, seller],
        };
      }
    });
  };

  const handleCategorySelection = (category: string) => {
    setFilter(prevFilter => {
      const { selectedCategories } = prevFilter;
      if (selectedCategories.includes(category)) {
        return {
          ...prevFilter,
          selectedCategories: selectedCategories.filter(c => c != category),
        }
      } else {
        return {
          ...prevFilter,
          selectedCategories: [...selectedCategories, category],
        };
      }
    })
  }

  const applyFilter = () => {
    const filtered = products.filter((product) => {
      const price = product.discountedPrice || product.price;
      if (price < filter.minPrice || price > filter.maxPrice) return false;
      if (filter.hideOutOfStock && product.stockCount === 0) return false;
      if (filter.selectedSellers.length > 0 && !filter.selectedSellers.includes(product.sellerInfo)) return false;
      if (filter.selectedCategories.length > 0 && !filter.selectedCategories.includes(product.category)) return false;

      return true;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
    setIsSidebarOpen(false);
  };

  const clearFilter = () => {
    setFilter({
      minPrice: PRICE_RANGE.min,
      maxPrice: PRICE_RANGE.max,
      hideOutOfStock: false,
      selectedSellers: [],
      selectedCategories: []
    });

    setFilteredProducts(products);
    setCurrentPage(1);
    setIsSidebarOpen(false);
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: parseInt(value, 10),
    }));
  };

  const handleNextImage = (productIndex: number) => {
    setCurrentImageIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      newIndexes[productIndex] = (prevIndexes[productIndex] + 1) % products[productIndex].productImageUrls.length;
      return newIndexes;
    });
  };

  const handlePrevImage = (productIndex: number) => {
    setCurrentImageIndexes((prevIndexes) => {
      const newIndexes = [...prevIndexes];
      newIndexes[productIndex] = prevIndexes[productIndex] === 0
        ? products[productIndex].productImageUrls.length - 1
        : prevIndexes[productIndex] - 1;
      return newIndexes;
    });
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };


  return (
    <div className="min-h-screen p-4 flex flex-col md:flex-row bg-cover bg-center" style={{ backgroundImage: 'url(/homePage-bg.avif)' }}>
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mt-24 md:mt-24 flex justify-end ml-8 mb-4 bg-slate-400 hover:bg-primaryDarkColor text-white px-4 py-2 rounded-md items-center space-x-2"
        >
          <FcFilledFilter size={25} />
          <span>Filter</span>
        </button>
      </div>
      <div className={`fixed top-24 left-0 h-auto rounded-md bg-slate-100 bg-opacity-100 z-50 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500 ease-in-out w-80 shadow-lg`}>
        <div className="p-4 ">
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={handleCloseSidebar} className="pt-1 pr-4 text-lg bg-transparent text-primaryDarkColor">✕</button>
            </div>
            <div>
              <label className="block text-lg font-light text-gray-700 p-2">Price Range:</label>
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
            <hr className="border-slate-500" />
            <div>
              <label className="block text-lg font-light text-gray-700 p-2">Sellers:</label>
              <div className="flex flex-wrap px-2">
                {sellers.map(seller => (
                  <label key={seller} className="inline-flex items-center pr-2">
                    <input
                      type="checkbox"
                      checked={filter.selectedSellers.includes(seller)}
                      onChange={() => handleSellerSelection(seller)}
                      className="form-checkbox"
                    />
                    <span className="ml-2 font-light">{seller}</span>
                  </label>
                ))}
              </div>
            </div>
            <hr className="border-slate-500" />
            <div>
              <label className="block text-lg font-light text-gray-700 p-2">Categories:</label>
              <div className="flex flex-wrap px-2">
                {categories.map(category => (
                  <label key={category} className="inline-flex items-center pr-2">
                    <input
                      type="checkbox"
                      checked={filter.selectedCategories.includes(category)}
                      onChange={() => handleCategorySelection(category)}
                      className="form-checkbox"
                    />
                    <span className="ml-2 font-light">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            <hr className="border-slate-500" />
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
            <div className="flex justify-center items-center">
              <button onClick={applyFilter} className="bg-primaryDarkColor hover:bg-primaryLightColor text-white px-4 py-2 mt-4 rounded-md w-full flex items-center justify-center space-x-2">
                <FcFilledFilter size={25} />
                <span>Filter</span>
              </button>
            </div>
            <div className="flex justify-center items-center">
              <button onClick={clearFilter} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 mt-2 rounded-md w-full flex items-center justify-center space-x-2">
                <FcClearFilters size={25} />
                <span>Clear Filter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-4/4 px-4 mt-24 md:mt-24">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 mr-2 rounded-md ${viewMode === 'grid' ? 'bg-primaryDarkColor text-white' : 'bg-slate-400'}`}
          >
            <MdGridView />
          </button>
          <button
            onClick={() => setViewMode('compact')}
            className={`px-4 py-2 rounded-md ${viewMode === 'compact' ? 'bg-primaryDarkColor text-white' : 'bg-slate-400'}`}
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
                <div key={product.id} className={`${viewMode === 'grid' ? 'border bg-white bg-opacity-80 p-4 rounded-md shadow-md' : 'border bg-white bg-opacity-80 p-8 rounded-md shadow-md'}`}>
                  <div className="relative">
                    {product.productImageUrls?.length > 0 && (
                      <div className="relative">
                        <div className="flex overflow-x-hidden space-x-2 pb-2">
                          <img
                            src={product.productImageUrls[currentImageIndexes[productIndex]]}
                            alt={product.productName}
                            className={`object-cover ${viewMode === 'grid' ? 'h-40 w-full' : 'h-72 w-full'} rounded-md`}
                          />
                        </div>
                        {product.productImageUrls.length > 1 && (
                          <>
                            <button
                              onClick={() => handlePrevImage(productIndex)}
                              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-1 rounded-full"
                            >
                              &lt;
                            </button>
                            <button
                              onClick={() => handleNextImage(productIndex)}
                              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white p-1 rounded-full"
                            >
                              &gt;
                            </button>
                          </>
                        )}
                      </div>
                    )}
                    <div className="text-gray-700 font-semibold text-md pt-2">{product.productName}</div>
                    {product.discountedPrice ? (
                      <>
                        <div className="flex items-center space-x-2 pt-2">
                          <p className="text-lg text-gray-500 line-through">${product.price}</p>
                          <p className="text-red-600 font-medium text-xl"><strong></strong>${product.discountedPrice}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-red-600 font-medium text-xl pt-2"><strong></strong>${product.price}</p>
                    )}
                    <div className="text-gray-500 text-sm pt-2">Sold by: {product.sellerInfo}</div>
                    <div className={`text-sm ${product.stockCount > 0 ? 'text-green-600' : 'text-red-600'} pt-2`}>{product.stockCount > 0 ? `In Stock (${product.stockCount})` : 'Out of Stock'}</div>
                    <button
                      onClick={() => (window.location.href = `/product-detail/${product.id}`)}
                      className="bg-secondaryDarkColor hover:bg-secondaryLightColor text-white px-4 p-2 mt-2 rounded-md w-full"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 bg-gray-200 rounded-md ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                Previous
              </button>

              <div className="flex items-center">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-2 py-1 mx-1 rounded-full ${currentPage === index + 1 ? 'bg-primaryDarkColor text-white' : 'bg-gray-200'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 bg-gray-200 rounded-md ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                Next
              </button>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
