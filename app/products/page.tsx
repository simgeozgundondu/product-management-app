"use client";
import { useEffect, useState } from "react";
import { FcClearFilters, FcFilledFilter } from "react-icons/fc";
import { MdGridView, MdOutlineViewAgenda } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area"



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

  const [filter, setFilter] = useState({
    minPrice: PRICE_RANGE.min,
    maxPrice: PRICE_RANGE.max,
    hideOutOfStock: false,
    selectedSellers: [] as string[],
    selectedCategories: [] as string[]
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
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
          selectedCategories: selectedCategories.filter(c => c !== category),
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

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    const imageCount = paginatedProducts[index].productImageUrls.length;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const imageIndex = Math.floor((x / rect.width) * imageCount);

    setCurrentImageIndexes((prevState) => ({
      ...prevState,
      [index]: imageIndex,
    }));

    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };


  return (
    <div className="min-h-screen p-4 flex">
      {/* Mobile Filter Button */}
      <div className="absolute mt-20 py-3 left-4 z-10 md:hidden">
        <button
          onClick={handleOpenModal}
          className="btn flex justify-start ml-10 bg-slate-400 hover:bg-primaryDarkColor text-white px-2 py-2 rounded-md items-center space-x-2 transition-transform duration-500 ease-in-out"
        >
          <FcFilledFilter size={25} />
          <span>Filter</span>
        </button>
      </div>
      {/*  filtering on mobile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white border rounded-md shadow-lg z-50 overflow-auto p-4">
          <div className="relative p-4 w-auto mx-auto h-screen ">
            <button onClick={handleCloseModal} className="btn absolute top-2 right-2 text-2xl  bg-transparent text-primaryDarkColor transition-transform duration-500 ease-in-out">
              ✕
            </button>

            <div className="space-y-4 py-8">
              <div>
                <label className="block text-lg font-light text-gray-700 p-4 pt-2">Price Range:</label>
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
                <div className="flex justify-between text-sm my-2">
                  <span>Min: {filter.minPrice}</span>
                  <span>Max: {filter.maxPrice}</span>
                </div>
              </div>
              <hr className="border-slate-500" />
              <div>
                <label className="block text-lg font-bold text-gray-700 p-2">Sellers</label>
                <div className="flex flex-col px-2">
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
                <label className="block text-lg font-bold text-gray-700 p-2">Categories</label>
                <div className="flex flex-col px-2">
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
              <div className="flex justify-center items-center space-x-2">
                <button onClick={applyFilter} className="btn bg-primaryDarkColor hover:bg-primaryLightColor text-white px-4 rounded-md flex items-center space-x-2">
                  <FcFilledFilter size={25} />
                  <span>Filter</span>
                </button>
                <button onClick={clearFilter} className="btn bg-gray-500 hover:bg-gray-600 text-white px-4 mb-4 py-2 rounded-md flex items-center space-x-2 ">
                  <FcClearFilters size={25} />
                  <span>Clear Filter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="hidden md:flex md:w-1/4 pl-2 top-24 h-screen bg-white bg-opacity-80 border-r rounded-md sticky">
        <ScrollArea className="h-full w-full rounded-md border p-4">
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={handleCloseSidebar} className="btn pt-1 pr-4 text-lg bg-transparent text-primaryDarkColor md:hidden">✕</button>
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
            <hr className="mt-4 border-slate-500" />
            <div>
              <label className="block text-md font-bold text-gray-700 p-2">Sellers</label>
              <div className="flex flex-col p-2">
                {sellers.map(seller => (
                  <label key={seller} className="inline-flex items-center pr-2">
                    <input
                      type="checkbox"
                      checked={filter.selectedSellers.includes(seller)}
                      onChange={() => handleSellerSelection(seller)}
                      className="form-checkbox "
                    />
                    <span className="ml-2 font-light">{seller}</span>
                  </label>
                ))}
              </div>
            </div>
            <hr className="border-slate-500" />
            <div>
              <label className="block text-md font-bold text-gray-700 p-2">Categories</label>
              <div className="flex flex-col p-2">
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
                <span className="ml-2 font-bold text-gray-700 font-quicksand">Hide Out of Stock</span>
              </label>
            </div>
            <div className="flex justify-center items-center">
              <button onClick={applyFilter} className="btn bg-primaryDarkColor hover:bg-primaryLightColor text-white px-4 py-2 mt-4 rounded-md w-full flex items-center justify-center space-x-2">
                <FcFilledFilter size={25} />
                <span>Filter</span>
              </button>
            </div>
            <div className="flex justify-center items-center">
              <button onClick={clearFilter} className="btn bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 mt-2 mb-8 rounded-md w-full flex items-center justify-center space-x-2">
                <FcClearFilters size={25} />
                <span>Clear Filter</span>
              </button>
            </div>
          </div>
        </ScrollArea>

      </div >

      {/* Content Section */}
      <div className="w-full md:w-4/4 ml-4 px-4 mt-20 md:mt-16" >

        {
          paginatedProducts.length === 0 ? (
            <div className="rounded-md bg-slate-200 bg-opacity-50 flex justify-center items-center text-center text-lg font-bold text-gray-700">
              No products available :(
            </div>
          ) : (
            <><div className="min-h-screen ">
              <div className="flex justify-end py-3 pr-4">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`btn px-4 py-2 mr-2 rounded-md ${viewMode === 'grid' ? 'bg-primaryDarkColor text-white' : 'bg-gray-300'} transition-transform duration-500 ease-in-out`}
                >
                  <MdGridView />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`btn px-4 py-2 rounded-md ${viewMode === 'compact' ? 'bg-primaryDarkColor text-white' : 'bg-gray-300'} transition-transform duration-500 ease-in-out`}
                >
                  <MdOutlineViewAgenda />
                </button>
              </div>
              <div className={`grid gap-10 px-4 pb-8 mt-4 md:m-0  ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {paginatedProducts.map((product, productIndex) => (
                  <div
                    key={product.id}
                    className={`max-h-[320px] border bg-white bg-opacity-80 rounded-md shadow-md overflow-hidden ${viewMode === 'grid' ? 'w-full max-w-xs' : 'w-full max-w-lg'} hover:border hover:shadow-gray-500 hover:shadow-lg`}
                    onMouseMove={(e) => handleMouseMove(e, productIndex)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="relative w-full h-40">
                      {product.productImageUrls?.length > 0 && (
                        <div className="relative p-4 w-full h-full">
                          <img
                            src={product.productImageUrls[hoveredIndex === productIndex ? currentImageIndexes[productIndex] ?? 0 : 0]}
                            alt={product.productName}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-2 flex flex-col justify-between h-40">
                      <div className="text-gray-700 font-semibold text-sm truncate">{product.productName}</div>
                      {product.discountedPrice ? (
                        <div className="flex items-center space-x-1 pt-1">
                          <p className="text-xs text-gray-500 line-through">${product.price}</p>
                          <p className="text-red-600 font-medium text-sm">${product.discountedPrice}</p>
                        </div>
                      ) : (
                        <p className="text-red-600 font-medium text-sm pt-1">${product.price}</p>
                      )}
                      <div className="text-gray-500 text-xs pt-1 truncate">Sold by: {product.sellerInfo}</div>
                      <div className={`text-xs ${product.stockCount > 0 ? 'text-green-600' : 'text-red-600'} pt-1`}>
                        {product.stockCount > 0 ? `In Stock (${product.stockCount})` : 'Out of Stock'}
                      </div>
                      <button
                        onClick={() => (window.location.href = `/product-detail/${product.id}`)}
                        className="btn bg-transparent border border-black hover:bg-gray-500 hover:text-white text-black hover:border-none justify-center py-1 mt-2 rounded-md mx-4 text-xs"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>



              <div className="flex justify-center items-center space-x-2 mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`btn px-4 py-2 bg-gray-400 rounded-md ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  Previous
                </button>

                <div className="flex items-center">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`btn px-2 py-1 mx-1 rounded-full ${currentPage === index + 1 ? 'bg-primaryDarkColor text-white' : 'bg-gray-200'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`btn px-4 py-2 bg-gray-400 rounded-md ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  Next
                </button>
              </div>
            </>
          )
        }
      </div >

    </div >
  );


};

export default ProductList;
