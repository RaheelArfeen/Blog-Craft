import React from 'react';
import { Link } from 'react-router';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-300 drop-shadow-2xl drop-shadow-black transition-colors duration-200 dark:border-t dark:border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            <span className="font-bold text-xl text-gray-900 dark:text-gray-100">BlogCraft</span>
                        </Link>
                        <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                            Empowering writers and readers to share knowledge, stories, and insights that matter. Join our community of passionate creators.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" aria-label="Facebook" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-500 dark:text-gray-400">
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" aria-label="Twitter" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-500 dark:text-gray-400">
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a href="#" aria-label="Instagram" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-500 dark:text-gray-400">
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-500 dark:text-gray-400">
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Links</h3>
                        <ul className="space-y-2">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/blogs', label: 'All Blogs' },
                                { to: '/add-blog', label: 'Add Blogs' },
                                { to: '/featured', label: 'Featured Blogs' },
                                { to: '/wishlist', label: 'Wishlist' },
                            ].map(({ to, label }) => (
                                <li key={to}>
                                    <Link
                                        to={to}
                                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-700 dark:text-gray-300"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Categories</h3>
                        <ul className="space-y-2">
                            {['Technology', 'Design', 'Business', 'Lifestyle', 'Travel'].map(category => (
                                <li key={category}>
                                    <a
                                        href="#"
                                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-700 dark:text-gray-300"
                                    >
                                        {category}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Info</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-gray-700 dark:text-gray-300">hello@blogcraft.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-gray-700 dark:text-gray-300">123 Blog Street, Writer City, WC 12345</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-300 dark:border-gray-700 mt-10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            © 2024 BlogCraft. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            {[
                                { to: '/privacy', label: 'Privacy Policy' },
                                { to: '/terms', label: 'Terms of Service' },
                                { to: '/cookies', label: 'Cookie Policy' },
                            ].map(({ to, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm text-gray-600 dark:text-gray-400"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
