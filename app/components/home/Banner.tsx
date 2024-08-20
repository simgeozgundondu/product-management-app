"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

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

const Banner = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts) as Product[]);
      } catch (error) {
        console.error("Failed to parse products from localStorage", error);
      }
    }
  }, []);

  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  return (
    <div className="h-[80px] bg-white flex items-center justify-center">
        <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-400">
          {categories.map((category, index) => (
            <Link
              href={`/category/${category.toLowerCase()}`}
              key={index}
              className="text-black font-semibold hover:text-blue-500 text-lg px-4 py-2"
            >
              {category}
            </Link>
          ))}
        </div>
    </div>
  );
};

export default Banner;
