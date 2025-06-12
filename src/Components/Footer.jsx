import React from "react";
import { NavLink } from "react-router";
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Instagram,
    BookOpen,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="md:container w-full mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand Description */}
                    <div>
                        <div className="flex items-center mb-4">
                            <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
                            <span className="text-xl font-bold text-gray-900">
                                BlogCraft
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Your digital assistant for managing all your Blog Craft needs. Create, organize, and publish your blog posts with ease. Track drafts, schedule publications, and engage your readers effortlessly.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">
                            Quick Links
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <NavLink to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/blogs" className="text-gray-600 hover:text-blue-600 transition-colors">All blogs</NavLink>
                            </li>
                            <li>
                                <NavLink to="/add-blogs" className="text-gray-600 hover:text-blue-600 transition-colors">Add blogs</NavLink>
                            </li>
                            <li>
                                <NavLink to="/featured" className="text-gray-600 hover:text-blue-600 transition-colors">Featured</NavLink>
                            </li>
                            <li>
                                <NavLink to="/wishlist" className="text-gray-600 hover:text-blue-600 transition-colors">Wishlist</NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">
                            Contact Us
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center text-gray-600">
                                <Mail className="h-4 w-4 mr-2 text-blue-600" />
                                <span>support@blogcraft.com</span>
                            </li>
                            <li className="flex items-center text-gray-600">
                                <Phone className="h-4 w-4 mr-2 text-blue-600" />
                                <span>(123) 456-7890</span>
                            </li>
                            <li className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                                <span>123 Green St, Blog City</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter & Social */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">
                            Follow Us
                        </h3>
                        <div className="flex space-x-4 mb-4">
                            {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <Icon className="h-6 w-6" />
                                    <span className="sr-only">{Icon.name}</span>
                                </a>
                            ))}
                        </div>

                        <p className="text-sm text-gray-600">
                            Subscribe to our newsletter for Blog Craft tips and updates.
                        </p>
                        <form
                            className="mt-3 flex flex-col sm:flex-row gap-y-2"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-blue-700 transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
                    <p>&copy; {new Date().getFullYear()} BlogCraft. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
