"use client";

import { Product } from '@/app/interfaces/product';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const ProductDetail = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  }

  const closeDialog = () => {
    setIsDialogOpen(false);
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 bg-white">
      <div className="max-w-7xl mx-auto bg-gray-100 rounded-lg bg-opacity-80 p-6 my-12 md:my-28">
        <div className="flex flex-col md:flex-row p-4 md:p-8">
          <div className="md:w-1/2 relative mb-6 md:mb-0">
            <img
              src={product.productImageUrls[currentImageIndex]}
              alt={product.productName}
              className="rounded-xl mb-4 object-contain w-full h-64 md:h-96 cursor-pointer border shadow-md"
              onClick={openDialog}
            />
            {product.productImageUrls.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-100 text-gray-500 p-2 rounded-full md:left-4"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-100 text-gray-500 p-2 rounded-full md:right-4"
                >
                  <FaArrowRight />
                </button>
              </>
            )}
            {/* Thumbnail Images */}
            <div className="flex mt-4 space-x-2">
              {product.productImageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-11 object-contain cursor-pointer rounded-md border-2 ${
                    index === currentImageIndex ? 'border-gray-700' : 'border-transparent'
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          </div>
          <div className="py-4 md:w-1/2 md:pl-16">
            <h1 className="text-gray-700 font-semibold text-2xl md:text-3xl">{product.productName}</h1>
            <p className="text-base text-gray-500 pt-2"><strong>By </strong> {product.sellerInfo}</p>
            <p className="text-base text-gray-500 pt-2"><strong>Category:</strong> {product.category}</p>
            {product.discountedPrice ? (
              <div className="flex items-center space-x-2 pt-2">
                <p className="text-base text-gray-500 line-through">${product.price}</p>
                <p className="text-red-600 font-medium text-xl">${product.discountedPrice}</p>
              </div>
            ) : (
              <p className="text-red-600 font-medium text-xl pt-2">${product.price}</p>
            )}
            <div className='bg-white bg-opacity-30 shadow-md shadow-slate-400 rounded-md mt-4'>
              <p className="text-sm text-gray-700 p-4 my-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque unde impedit eaque ut fugit mollitia doloribus excepturi ad sint! Consectetur.
              </p>
            </div>
            <p className={`text-sm pt-2 ${product.stockCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stockCount > 0 ? `In Stock (${product.stockCount})` : 'Out of Stock'}
            </p>

            <div className="mt-4 space-y-2">
              {product.stockCount > 0 ? (
                <div className="flex flex-col sm:flex-row sm:space-x-4">
                  <button
                    className="btn px-6 py-2 rounded-md w-full bg-primaryLightColor hover:bg-primaryDarkColor text-white"
                  >
                    Buy Now
                  </button>
                  <button
                    className="btn px-6 py-2 rounded-md w-full bg-secondaryDarkColor hover:bg-secondaryLightColor text-white"
                  >
                    Add to Cart
                  </button>
                </div>
              ) : (
                <button
                  disabled
                  className="btn px-6 py-2 rounded-md w-full bg-gray-400 cursor-not-allowed text-white"
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[60rem] max-h-auto p-8">
          <button onClick={closeDialog} className="absolute top-4 right-4">
            <DialogClose className="text-2xl"></DialogClose>
          </button>
          <img
            src={product.productImageUrls[currentImageIndex]}
            alt={product.productName}
            className="w-full h-auto max-h-[90vh] object-cover mt-4 rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
