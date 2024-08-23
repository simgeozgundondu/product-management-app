"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Product {
    id: number;
    productName: string;
    sellerInfo: string;
    productImageUrls: string;
}

const Search = () => {
    const [query, setQuery] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLUListElement>(null);

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

    useEffect(() => {
        if (dropdownRef.current && activeIndex >= 0 && isDropdownOpen) {
            const activeItem = dropdownRef.current.querySelectorAll('li')[activeIndex] as HTMLElement;
            if (activeItem) {
                activeItem.scrollIntoView({ block: 'nearest', behavior:'smooth' });
            }
        }
    }, [activeIndex, isDropdownOpen]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            setActiveIndex(prevIndex => (prevIndex + 1) % filteredProducts.length);
            setHoveredIndex(-1);
        } else if (e.key === 'ArrowUp') {
            setActiveIndex(prevIndex => (prevIndex === 0 ? filteredProducts.length - 1 : prevIndex - 1));
            setHoveredIndex(-1);
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            const selectedProduct = filteredProducts[activeIndex];
            setQuery(selectedProduct.productName);
            setIsDropdownOpen(false);
            router.push(`/product-detail/${selectedProduct.id}`);
        } else if (e.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };

    const handleProductClick = (product: Product) => {
        setQuery(product.productName);
        setIsDropdownOpen(false);
        router.push(`/product-detail/${product.id}`);
    };

    const handleMouseEnter = (index: number) => {
        setHoveredIndex(index);
        setActiveIndex(-1);
    };

    return (
        <div className="relative md:mx-16 flex-2 md:w-[48rem]">
            <input
                type="text"
                className="w-full px-4 py-2 border font-quicksand bg-gray-100 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-black"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsDropdownOpen(filteredProducts.length > 0)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
            />

            {isDropdownOpen && (
                <ul
                    ref={dropdownRef}
                    className="absolute top-full left-0 w-full text-gray-500 bg-white border border-gray-300 rounded-lg max-h-60 overflow-y-auto mt-1"
                >
                    <ScrollArea>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => {
                            const isActive = index === activeIndex;
                            const isHovered = index === hoveredIndex;
                            return (
                                <li
                                    key={index}
                                    className={`flex items-center px-4 py-2 cursor-pointer ${
                                        isActive ? 'border border-black' : isHovered ? 'bg-gray-300' : ''
                                    }`}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={() => setHoveredIndex(-1)}
                                    onClick={() => handleProductClick(product)}
                                >
                                    <img src={product.productImageUrls} alt={product.productName} className="object-contain w-10 h-10 mr-4" />
                                    <div>
                                        <div className="font-semibold">{product.productName}</div>
                                        <div className="text-sm text-gray-400">Seller: {product.sellerInfo}</div>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <li className="px-4 py-2 text-red-600 font-quicksand">No products found :(</li>
                    )}
                    </ScrollArea>
                    
                </ul>
            )}
        </div>
    );
};

export default Search;
