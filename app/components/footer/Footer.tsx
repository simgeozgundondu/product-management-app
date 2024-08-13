import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-secondaryLightColor bg-opacity-20 backdrop-blur-sm backdrop-filter text-slate-500 py-8 border-t border-slate-600">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Online Shopping</h2>
                        <p className="mb-4">Lorem ipsum dolor sit amet.</p>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <a href="https://facebook.com" className="text-gray-300 hover:text-slate-500">
                                <FaFacebookF size={20} />
                            </a>
                            <a href="https://twitter.com" className="text-gray-300 hover:text-slate-500">
                                <FaTwitter size={20} />
                            </a>
                            <a href="https://instagram.com" className="text-gray-300 hover:text-slate-500">
                                <FaInstagram size={20} />
                            </a>
                            <a href="https://linkedin.com" className="text-gray-300 hover:text-slate-500">
                                <FaLinkedinIn size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="mt-8 md:mt-0">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="hover:text-gray-300">Home</Link>
                            </li>
                            <li>
                                <Link href="/add-product" className="hover:text-gray-300">Add Product</Link>
                            </li>
                            <li>
                                <Link href="/products" className="hover:text-gray-300">All Products</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-gray-300">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-8 md:mt-0 text-center md:text-right">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Contact Us</h3>
                        <p className="mb-2">1234 Street Name, City, State, 12345</p>
                        <p className="mb-2">Email: <a href="mailto:info@company.com" className="hover:text-gray-400">info@company.com</a></p>
                        <p>Phone: <a href="tel:+1234567890" className="hover:text-gray-400">+1 (234) 567-890</a></p>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-4 text-center">
                    <p className="text-sm text-gray-500">© {new Date().getFullYear()} Company Name. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
