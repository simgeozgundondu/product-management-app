import { Product } from '../interfaces/product';

interface ProductCardProps {
  product: Product;
  productIndex: number;
  currentImageIndexes: { [key: number]: number };
  hoveredIndex: number | null;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>, index: number) => void;
  handleMouseLeave: () => void;
  viewMode: 'grid' | 'compact';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  productIndex,
  currentImageIndexes,
  hoveredIndex,
  handleMouseMove,
  handleMouseLeave,
  viewMode,
}) => {
  const discountPercentage = product.discountedPrice && product.price
    ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
    : null;

  return (
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
        {discountPercentage && (
          <p className={`m-1 p-1 max-w-fit text-white text-xs rounded-sm ${discountPercentage && discountPercentage <= 50 ? ' bg-orange-600 ' : 'bg-green-600'}`}>
            -{discountPercentage}% Discount
          </p>
        )}

        <div className="text-gray-500 text-xs pt-1 truncate">Sold by: {product.sellerInfo}</div>
        <div className={`text-xs ${product.stockCount && product.stockCount > 0 ? 'text-green-600' : 'text-red-600'} pt-1`}>
          {product.stockCount && product.stockCount > 0 ? `In Stock (${product.stockCount})` : 'Out of Stock'}
        </div>
        <button
          onClick={() => (window.location.href = `/product-detail/${product.id}`)}
          className="btn bg-transparent border border-primaryDarkColor hover:bg-primaryDarkColor hover:text-white text-black hover:border-none justify-center py-1 mt-2 rounded-md mx-4 text-xs"
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
