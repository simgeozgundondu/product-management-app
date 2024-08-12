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
    <div 
      className="flex flex-col md:flex-row justify-around items-center min-h-screen px-8 md:px-20 bg-cover bg-center"
      style={{ backgroundImage: 'url(/homePage-bg.avif)' }} 
    >
      <div className=" flex flex-col justify-start items-center max-w-lg space-y-4 mb-8 md:mb-0 mt-[4rem] pl-12 bg-slate-100 bg-opacity-50 p-8 rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-primaryDarkColor">SHOPPING</h1>
        <h2 className="text-2xl pb-8 md:text-3xl font-semibold text-secondaryDarkColor">LANDING PAGE</h2>
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
      {/* <div className="relative flex justify-center md:justify-end w-full md:w-auto">
        <img src="" className="w-64 h-auto md:w-[28rem] lg:w-[32rem]" />
        
      </div> */}
    </div>
  );
};

export default HomePage;
