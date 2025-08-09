import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { BookOpen, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './CSS/Header.css';
import { AuthContext } from '../Provider/AuthProvider';
import ThemeToggle from './ThemeToggle';

const Header = () => {
    const { logOut, user, loading } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const Navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logOut();
            toast.success('Logged out successfully.');
        } catch (error) {
            toast.error('Failed to logout. Please try again.');
            console.error('Logout error:', error);
        }
    };



    useEffect(() => {
        const handleRouteChange = () => {
            setIsOpen(false);
            setDropdownOpen(false);
        };
        window.addEventListener('popstate', handleRouteChange);
        return () => {
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-md shadow-md transition-colors duration-200">
            <div className="container w-full mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-[#1A1F2C] dark:text-white text-xl font-bold flex items-center gap-1">
                            <BookOpen size={24} className="text-blue-600" /> BlogCraft
                        </Link>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        <NavLink to="/" className="text-[#374151] dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 transition-colors">Home</NavLink>
                        <NavLink to="/blogs" className="text-[#374151] dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 transition-colors">All Blogs</NavLink>
                        <NavLink to="/add-blog" className="text-[#374151] dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 transition-colors">Add Blogs</NavLink>
                        <NavLink to="/featured" className="text-[#374151] dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 transition-colors">Featured Blogs</NavLink>
                        <NavLink to="/wishlist" className="text-[#374151] dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 transition-colors">Wishlist</NavLink>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        {loading ? (
                            <>
                                <Skeleton circle width={36} height={36} />
                            </>
                        ) : user ? (
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="rounded-full h-9 w-9 overflow-hidden border border-gray-300 cursor-pointer hover:scale-110 transition"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
                                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    )}
                                </div>
                                {dropdownOpen && (
                                    <div className="absolute right-0 w-60 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 rounded-md z-50 mt-1.5">
                                        <div className="py-2 px-3 border-b border-gray-200 dark:border-gray-600 text-sm font-semibold">
                                            <span className="text-gray-600 dark:text-gray-400 font-normal">Signed in as:</span><br />
                                            <span className="text-gray-800 dark:text-gray-200">{user.email}</span>
                                        </div>
                                        <NavLink to="/profile" className="block px-1 pt-1">
                                            <div onClick={() => setDropdownOpen(false)} className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md transition">Profile</div>
                                        </NavLink>
                                        <NavLink to="/wishlist" className="block px-1">
                                            <div onClick={() => setDropdownOpen(false)} className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md transition">Wishlist</div>
                                        </NavLink>
                                        <button onClick={handleLogout} className="block px-1 pb-1 w-full text-left cursor-pointer">
                                            <div className="hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md transition">Log Out</div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="border border-gray-300 dark:border-gray-600 bg-[#F1F5F9] dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-1 rounded hover:scale-105 transition">Login</Link>
                                <Link to="/register" className="bg-[#3A63D8] text-white px-4 py-1 rounded hover:scale-105 transition">Register</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <ThemeToggle className="mr-2" />
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 dark:text-gray-200">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-3">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <NavLink onClick={() => setIsOpen(false)} to="/" className="block text-[#374151] dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 hover:scale-105 transition-transform">Home</NavLink>
                            <NavLink onClick={() => setIsOpen(false)} to="/blogs" className="block text-[#374151] dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 hover:scale-105 transition-transform">All blogs</NavLink>
                            <NavLink onClick={() => setIsOpen(false)} to="/add-blog" className="block text-[#374151] dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 hover:scale-105 transition-transform">Add blogs</NavLink>
                            <NavLink onClick={() => setIsOpen(false)} to="/featured" className="block text-[#374151] dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 hover:scale-105 transition-transform">Featured Blogs</NavLink>
                            <NavLink onClick={() => setIsOpen(false)} to="/wishlist" className="block text-[#374151] dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 px-3 py-2 hover:scale-105 transition-transform">wishlist</NavLink>
                            {loading ? (
                                <div className="px-3 mt-4 space-y-2">
                                    <Skeleton circle height={36} width={36} />
                                    <Skeleton height={14} width={180} />
                                </div>
                            ) : user ? (
                                <div className="border-t border-gray-200 dark:border-gray-600 mt-4 pt-4 px-3">
                                    <div onClick={() => { Navigate('/profile'), setIsOpen(false) }} className="flex items-center">
                                        <div className="rounded-full h-9 w-9 overflow-hidden border border-gray-300">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt={user.displayName} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
                                                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {user.displayName || 'User'}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Email: {user.email}</div>
                                    <button onClick={handleLogout} className="mt-2 w-full bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded text-gray-800 dark:text-gray-200 hover:scale-105 transition">Log out</button>
                                </div>
                            ) : (
                                <div className="mt-4 px-3 space-y-2">
                                    <Link to="/login" className="block w-full border border-gray-300 dark:border-gray-600 text-center bg-[#F1F5F9] dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded">Login</Link>
                                    <Link to="/register" className="block w-full text-center bg-[#3A63D8] text-white py-2 rounded">Register</Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Header;