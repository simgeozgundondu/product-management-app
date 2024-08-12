"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleAddProductClick = () => {
    router.push('/add-product');
  };

  const handleProductListClick = () => {
    router.push('/products');
  };

  return (
    <div className="flex flex-col md:flex-row justify-around items-center min-h-screen px-8 md:px-20 bg-white">
      <div className="flex flex-col justify-center items-start max-w-lg space-y-6 mb-8 md:mb-0 md:pl-12">
        <h1 className="text-4xl md:text-5xl font-bold text-primaryDarkColor">SHOPPING</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-secondaryDarkColor">LANDING PAGE</h2>
        <p className="text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam monummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.
        </p>
        <div className="flex justify-start items-center space-x-4">
          <button 
            onClick={handleAddProductClick}
            className="bg-secondaryDarkColor text-white py-2 px-4 md:py-3 md:px-6 rounded-full shadow-lg hover:bg-secondaryLightColor transition-colors">
            Add Product
          </button>
          <button 
            onClick={handleProductListClick}
            className="bg-secondaryDarkColor text-white py-2 px-4 md:py-3 md:px-6 rounded-full shadow-lg hover:bg-secondaryLightColor transition-colors">
            All Products
          </button>
        </div>
      </div>
      <div className="relative flex justify-center md:justify-end w-full md:w-auto">
        <img src="/icon1.png" alt="Shopping" className="w-64 h-auto md:w-[28rem] lg:w-[32rem]" />
        <div className="absolute top-0 right-0 bg-red-500 text-white py-1 px-3 rounded-full shadow-lg">
          <span className="text-sm md:text-lg">New</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
