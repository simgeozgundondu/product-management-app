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
      <div className="max-w-4xl mx-auto bg-white bg-opacity-80 p-6 rounded-lg shadow-lg mt-32">
        <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 relative">
            <img
              src={product.productImageUrls[currentImageIndex]}
              alt={product.productName}
              className="rounded-lg mb-4"
            />
            {product.productImageUrls.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black text-white p-2 rounded-full"
                >
                  <FaArrowRight />
                </button>
              </>
            )}
          </div>
          <div className="md:w-1/2 md:pl-8">
            <p className="text-lg"><strong>Seller:</strong> {product.sellerInfo}</p>
            <p className="text-lg"><strong>Category:</strong> {product.category}</p>
            <p className="text-lg"><strong>Price:</strong> {product.price} TL</p>
            {product.discountedPrice && <p className="text-lg text-red-500"><strong>Discounted Price:</strong> {product.discountedPrice} TL</p>}
            <p className="text-lg"><strong>Stock Count:</strong> {product.stockCount}</p>
            <button
              disabled={product.stockCount === 0}
              className={`mt-4 px-6 py-2 rounded-md w-full ${product.stockCount > 0 ? 'bg-primaryDarkColor hover:bg-primaryLightColor text-white' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {product.stockCount > 0 ? 'Buy Now' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
