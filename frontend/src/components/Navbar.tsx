"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    };

    const navLinks = [
        { name: 'Home', path: '/dashboard' },
        { name: 'Search', path: '/search' }
    ];

    return (
        <nav className="bg-indigo-600 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-white text-xl font-bold tracking-tight">DiaryApp</span>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                            {navLinks.map(link => (
                                <Link key={link.name} href={link.path} className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === link.path ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'}`}>
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Mobile layout simplified for hackathon */}
                        <div className="sm:hidden flex space-x-2">
                            {navLinks.map(link => (
                                <Link key={link.name} href={link.path} className="text-indigo-100 text-sm">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <button onClick={handleLogout} className="bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
