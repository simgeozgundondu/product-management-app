"use client";
import Link from 'next/link';
import Search from "../navbar/Search";

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-[1000] flex flex-col">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-xl text-gray-600 hover:text-gray-800">
                <span className="sr-only">Close</span>
                &times;
            </button>
            <div className="flex-1 overflow-y-auto mt-12 px-4 py-2">
                <Search />
                <nav className="mt-8 space-y-2">
                    <Link href="/" className="block px-4 py-2 text-black hover:bg-gray-200 rounded">
                        Home
                    </Link>
                    <Link href="/add-product" className="block px-4 py-2 text-black hover:bg-gray-200 rounded">
                        Add Product
                    </Link>
                    <Link href="/products" className="block px-4 py-2 text-black hover:bg-gray-200 rounded">
                        Products
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
