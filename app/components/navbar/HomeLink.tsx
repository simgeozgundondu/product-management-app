"use client";

import Link from 'next/link';

const HomeLink = () => {
    return (
        <Link href="/" className="text-white hover:underline mr-4">
            Home
        </Link>
    );
};

export default HomeLink;

