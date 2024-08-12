"use client";
import { useState } from 'react';
import HamburgerMenu from "./HamburgerMenu";
import Logo from "./Logo";
import Search from "./Search";
import Sidebar from './Sidebar';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50">
            <div className="bg-transparent bg-opacity-50 bg-slate-100 border-b border-slate-600 backdrop-blur-sm backdrop-filter flex items-center justify-between gap-3 md:gap-10 md:px-10 h-24 text-slate-100">
                <Logo />
                <Search />
                <HamburgerMenu onClick={toggleSidebar} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
    );
};

export default Navbar;
