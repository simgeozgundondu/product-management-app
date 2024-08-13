import Link from "next/link";

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return (
        <div
            className={`fixed top-0 right-0 w-64 h-full bg-primaryDarkColor text-slate-100 transform ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            } transition-transform duration-300 ease-in-out`}
        >
            <div className="flex justify-end p-4">
                <button onClick={onClose} className="pt-4 pr-4 text-2xl">✕</button>
            </div>
            <div className="flex flex-col flex-items-center text-center p-4 space-y-4">
                <Link href="/" className=" font-reenie text-4xl text-white p-4 hover:underline" onClick={onClose}>
                    Home
                </Link>
                <Link href="/add-product" className="font-reenie text-4xl text-white p-4 hover:underline" onClick={onClose}>
                    Add Product
                </Link>
                <Link href="/products" className="font-reenie text-4xl text-white p-4 hover:underline" onClick={onClose}>
                    All Products
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
