import React from 'react';
import { Link } from 'react-router';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 drop-shadow-2xl drop-shadow-black">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <BookOpen className="h-8 w-8 text-blue-400" />
                            <span className="font-bold text-xl text-white">BlogCraft</span>
                        </Link>
                        <p className="leading-relaxed">
                            Empowering writers and readers to share knowledge, stories, and insights that matter. Join our community of passionate creators.
                        </p>
                        <div className="flex space-x-4">
                            <a className="hover:text-blue-400 transition-colors text-gray-400">
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a className="hover:text-blue-400 transition-colors text-gray-400">
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a className="hover:text-blue-400 transition-colors text-gray-400">
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a className="hover:text-blue-400 transition-colors text-gray-400">
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="hover:text-blue-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/blogs" className="hover:text-blue-400 transition-colors">
                                    All Blogs
                                </Link>
                            </li>
                            <li>
                                <Link to="/add-blog" className="hover:text-blue-400 transition-colors">
                                    Add blogs
                                </Link>
                            </li>
                            <li>
                                <Link to="/featured" className="hover:text-blue-400 transition-colors">
                                    Featured Blogs
                                </Link>
                            </li>
                            <li>
                                <Link to="/wishlist" className="hover:text-blue-400 transition-colors">
                                    Wishlist
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Categories</h3>
                        <ul className="space-y-2">
                            <li>
                                <a className="hover:text-blue-400 transition-colors">
                                    Technology
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-blue-400 transition-colors">
                                    Design
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-blue-400 transition-colors">
                                    Business
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-blue-400 transition-colors">
                                    Lifestyle
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-blue-400 transition-colors">
                                    Travel
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Contact Info</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-blue-400" />
                                <span>hello@blogcraft.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-blue-400" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="h-5 w-5 text-blue-400" />
                                <span>123 Blog Street, Writer City, WC 12345</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">
                            © 2024 BlogCraft. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/privacy" className="hover:text-blue-400 transition-colors text-sm text-gray-400">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="hover:text-blue-400 transition-colors text-sm text-gray-400">
                                Terms of Service
                            </Link>
                            <Link to="/cookies" className="hover:text-blue-400 transition-colors text-sm text-gray-400">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;