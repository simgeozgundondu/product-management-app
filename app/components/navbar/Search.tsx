"use client";

import { useState, useEffect } from 'react';

interface Product {
  productName: string;
}

const Search = () => {
    const [query, setQuery] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    useEffect(() => {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        }
    }, []);

    useEffect(() => {
        if (query) {
            const results = products.filter(product =>
                product.productName.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(results);
            setIsDropdownOpen(true);
        } else {
            setFilteredProducts([]);
            setIsDropdownOpen(false);
        }
    }, [query, products]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            setActiveIndex(prevIndex => (prevIndex + 1) % filteredProducts.length);
        } else if (e.key === 'ArrowUp') {
            setActiveIndex(prevIndex => (prevIndex === 0 ? filteredProducts.length - 1 : prevIndex - 1));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            const selectedProduct = filteredProducts[activeIndex];
            setQuery(selectedProduct.productName);
            setIsDropdownOpen(false);
        } else if (e.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };

    return (
        <div className="relative flex-2 md:flex-1">
            <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsDropdownOpen(filteredProducts.length > 0)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)} // Close dropdown when focus is lost
            />
            {isDropdownOpen && (
                <ul className="absolute top-full left-0 w-full text-gray-500 bg-white border border-gray-300 rounded-lg max-h-60 overflow-y-auto mt-1">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <li
                                key={index}
                                className={`px-4 py-2 cursor-pointer ${index === activeIndex ? 'bg-gray-200' : ''}`}
                                onMouseEnter={() => setActiveIndex(index)}
                                onClick={() => {
                                    setQuery(product.productName);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                {product.productName}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-red-600">No products found :(</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Search;