"use client";
import { useEffect, useState } from "react";
import { FcClearFilters, FcEmptyFilter, FcFilledFilter } from "react-icons/fc";
import { MdGridView, MdOutlineViewAgenda } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Product } from "../interfaces/product";
import ProductCard from "../components/ProductCard";
import MobileFilterSection from "../components/filtering/MobileFilterSection";
import FilterSection from "../components/filtering/FilterSection";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";



const ITEMS_PER_PAGE = 12;
const PRICE_RANGE = {
  min: 0,
  max: 1000,
};

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          className="btn flex justify-start ml-10 bg-slate-400 hover:bg-primaryDarkColor text-white px-2 py-2 rounded-md items-center space-x-2 hover:transition-transform hover:duration-500"
        >
          <FcFilledFilter size={25} />
          <span>Filter</span>
        </button>
      </div>
      {/*  filtering on mobile */}
      <MobileFilterSection
        filter={filter}
        sellers={sellers}
        categories={categories}
        handleSliderChange={handleSliderChange}
        handleSellerSelection={handleSellerSelection}
        handleCategorySelection={handleCategorySelection}
        applyFilter={applyFilter}
        clearFilter={clearFilter}
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        setFilter={setFilter}
      />
      <FilterSection
        filter={filter}
        sellers={sellers}
        categories={categories}
        handleSliderChange={handleSliderChange}
        handleSellerSelection={handleSellerSelection}
        handleCategorySelection={handleCategorySelection}
        applyFilter={applyFilter}
        clearFilter={clearFilter}
        handleCloseSidebar={handleCloseSidebar}
        setFilter={setFilter}
      />


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
                  <ProductCard
                    key={product.id}
                    product={product}
                    productIndex={productIndex}
                    currentImageIndexes={currentImageIndexes}
                    hoveredIndex={hoveredIndex}
                    handleMouseMove={handleMouseMove}
                    handleMouseLeave={handleMouseLeave}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </div>



              <div className="flex justify-center items-center space-x-2 mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      {currentPage > 1 && (
                        <PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} />
                      )}
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, index) => (
                      <PaginationItem key={index + 1}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === index + 1}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      {currentPage < totalPages && (
                        <PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} />
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

              </div>
            </>
          )
        }
      </div >

    </div >
  );


};

export default ProductList;
