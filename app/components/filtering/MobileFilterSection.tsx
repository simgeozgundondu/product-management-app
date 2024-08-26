import { FcClearFilters, FcFilledFilter } from "react-icons/fc";

interface MobileFilterSectionProps {
    
    filter: {
        minPrice: number,
        maxPrice: number,
        hideOutOfStock: boolean,
        selectedSellers: string[],
        selectedCategories: string[]
    };
    sellers: string[],
    categories: string[],
    handleSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSellerSelection: (seller: string) => void;
    handleCategorySelection: (category: string) => void;
    applyFilter: () => void;
    clearFilter: () => void;
    isModalOpen: boolean;
    handleCloseModal: () => void;
    setFilter: React.Dispatch<React.SetStateAction<{
        minPrice: number;
        maxPrice: number;
        hideOutOfStock: boolean;
        selectedSellers: string[];
        selectedCategories: string[];
      }>>;

}
const PRICE_RANGE = {
    min: 0,
    max: 1000,
  };


const MobileFilterSection: React.FC<MobileFilterSectionProps> = ({
    filter,
    sellers,
    categories,
    handleSliderChange,
    handleSellerSelection,
    handleCategorySelection,
    applyFilter,
    clearFilter,
    isModalOpen,
    handleCloseModal,
    setFilter

}) => {
    return (
        <>
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
                <button onClick={applyFilter} className="btn bg-primaryLightColor hover:bg-primaryDarkColor text-white px-4 mb-4 rounded-md flex items-center space-x-2">
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
      )}</>
    )
};
export default MobileFilterSection;