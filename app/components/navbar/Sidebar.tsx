import Link from "next/link";
import { FaHome, FaPlus, FaList } from "react-icons/fa"; 

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return (
        <div
            className={`fixed top-0 right-0 w-64 h-full bg-primaryDarkColor text-slate-100 bg-opacity-95 rounded-l-3xl transform ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-500 ease-in-out`}
        >
            <div className="flex justify-end p-4">
                <button onClick={onClose} className="pt-4 pr-8 text-3xl">✕</button>
            </div>
            <div className="flex flex-col text-center p-4 space-y-4">
                <Link href="/" className="flex items-center space-x-2 font-reenie text-4xl text-white p-4 hover:border hover:border-s-slate-600 hover:rounded-lg hover:bg-slate-300 hover:bg-opacity-50" onClick={onClose}>
                    <FaHome className="text-xl" />
                    <span>Home</span>
                </Link>
                <Link href="/add-product" className="flex items-center space-x-2 font-reenie text-4xl text-white p-4 hover:border hover:border-s-slate-600 hover:rounded-lg hover:bg-slate-300 hover:bg-opacity-50" onClick={onClose}>
                    <FaPlus className="text-xl" />
                    <span>Add Product</span>
                </Link>
                <Link href="/products" className="flex items-center space-x-2 font-reenie text-4xl text-white p-4 hover:border hover:border-s-slate-600 hover:rounded-lg hover:bg-slate-300 hover:bg-opacity-50" onClick={onClose}>
                    <FaList className="text-xl" />
                    <span>All Products</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
