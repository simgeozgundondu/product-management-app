"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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

const ProductDetail = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        try {
          const products = JSON.parse(savedProducts) as Product[];
          const foundProduct = products.find((p) => p.id === parseInt(id, 10));
          setProduct(foundProduct || null);
        } catch (error) {
          console.error('Failed to parse products from localStorage', error);
        }
      }
    } else {
      console.log("ID is not available yet.");
    }
  }, [id]);

  const handleNextImage = () => {
    if (product) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.productImageUrls.length);
    }
  };

  const handlePrevImage = () => {
    if (product) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? product.productImageUrls.length - 1 : prevIndex - 1
      );
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 bg-cover bg-center" style={{ backgroundImage: 'url(/homePage-bg.avif)' }}>
      <div className="max-w-7xl mx-auto bg-white bg-opacity-80 p-6 rounded-lg shadow-lg mt-32">
        <div className="flex flex-col md:flex-row p-4">
          <div className=" md:w-1/2 relative ">
            <img
              src={product.productImageUrls[currentImageIndex]}
              alt={product.productName}
              className="rounded-lg mb-4 object-cover h-96 w-full"
            />
            {product.productImageUrls.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-slate-500 text-white p-2 rounded-full"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-slate-500 text-white p-2 rounded-full"
                >
                  <FaArrowRight />
                </button>
              </>
            )}
          </div>
          <div className="py-4 md:w-1/2 md:pl-32">
            <h1 className="text-gray-700 font-semibold text-3xl">{product.productName}</h1>
            <p className="text-lg text-gray-500 pt-2"><strong>by </strong> {product.sellerInfo}</p>
            <p className="text-lg text-gray-500 pt-2"><strong>Category:</strong> {product.category}</p>
            {product.discountedPrice ? (
              <>
                <div className="flex items-center space-x-2 pt-2">
                  <p className="text-lg text-gray-500 line-through">${product.price}</p>
                  <p className="text-red-600 font-medium text-2xl"><strong></strong>${product.discountedPrice}</p>
                </div>
              </>
            ) : (
              <p className="text-red-600 font-medium text-xl pt-2"><strong></strong>${product.price}</p>
            )}
            <div className='bg-slate-200 bg-opacity-30 shadow-md shadow-slate-400 rounded-md'>
              <p className="text-sm text-gray-500 p-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque unde impedit eaque ut fugit mollitia doloribus excepturi ad sint! Consectetur.
              </p>
            </div>
            <p className={`text-sm pt-2 ${product.stockCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stockCount > 0 ? `In Stock (${product.stockCount})` : 'Out of Stock'}
            </p>

            <div className="mt-4 space-y-2">
              {product.stockCount > 0 ? (
                <>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 space-x-0 sm:space-x-3">
                    <button
                      className="px-6 py-2 rounded-md w-full bg-primaryDarkColor hover:bg-primaryLightColor text-white"
                    >
                      Buy Now
                    </button>
                    <button
                      className="px-6 py-2 rounded-md w-full bg-secondaryDarkColor hover:bg-secondaryLightColor text-white"
                    >
                      Add to Cart
                    </button>
                  </div>

                </>
              ) : (
                <button
                  disabled
                  className="px-6 py-2 rounded-md w-full bg-gray-400 cursor-not-allowed text-white"
                >
                  Out of Stock
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
