import { ScrollArea } from "@/components/ui/scroll-area";
import { FcClearFilters, FcFilledFilter } from "react-icons/fc";

interface FilterSectionProps {
    
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
    handleCloseSidebar:() => void;
    applyFilter: () => void;
    clearFilter: () => void;
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

const FilterSection: React.FC<FilterSectionProps> = ({
    filter,
    sellers,
    categories,
    handleSliderChange,
    handleSellerSelection,
    handleCategorySelection,
    applyFilter,
    clearFilter,
    handleCloseSidebar,
    setFilter

}) => {
    return (
        <>
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
              <button onClick={applyFilter} className="bg-secondaryLightColor hover:bg-secondaryDarkColor text-black px-4 py-2 mt-4 rounded-md w-full flex items-center justify-center space-x-2">
                <FcFilledFilter size={25} />
                <span>Filter</span>
              </button>
            </div>
            <div className="flex justify-center items-center">
              <button onClick={clearFilter} className=" bg-primaryLightColor hover:bg-primaryDarkColor text-white px-4 py-2 mt-2 mb-8 rounded-md w-full flex items-center justify-center space-x-2">
                <FcClearFilters size={25} />
                <span>Clear Filter</span>
              </button>
            </div>
          </div>
        </ScrollArea>

      </div ></>
    )
};
export default FilterSection;