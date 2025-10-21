import React, { useState, useEffect, useContext, useRef } from 'react';
import { Search, Eye, Calendar, User, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Lottie from 'lottie-react';
import notFound from '../assets/notFound.json'; // Make sure path is correct
import { FaHeart } from 'react-icons/fa';
import { AuthContext } from '../Provider/AuthProvider'; // Make sure path is correct
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// --- API & Query Key Constants ---
const BASE_URL = 'http://localhost:3000';
const ALL_BLOGS_QUERY_KEY = 'allBlogs';
const WISHLIST_QUERY_KEY = 'wishlist';

// --- Data Fetching Hooks/Functions ---

// 1. Fetch All Blog Posts
const fetchAllBlogPosts = async () => {
    const { data } = await axios.get(`${BASE_URL}/blogs`);
    return data;
};

// 2. Fetch User Wishlist IDs
const fetchWishlistIds = async (email) => {
    if (!email) return new Set();
    const { data } = await axios.get(`${BASE_URL}/wishlist`, {
        params: { email }
    });
    return new Set(data.map((item) => String(item.blogId)));
};

// Custom hook for debouncing a value
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


const AllBlogs = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // --- Local State for UI/Filtering ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const categoryRef = useRef(null);
    
    // Debounce the search term to reduce re-filtering
    const debouncedSearchTerm = useDebounce(searchTerm.trim().toLowerCase(), 300);

    // Categories list (kept locally as it's static)
    const categories = ['All', 'Technology', 'Design', 'Backend', 'AI', 'CSS', 'Marketing', 'Lifestyle', 'Business', 'Development', 'UI/UX', 'Career', 'Tutorial'];

    // --- TanStack Query for Blogs ---
    const {
        data: blogs = [],
        isLoading: isBlogsLoading,
        isError: isBlogsError,
    } = useQuery({
        queryKey: [ALL_BLOGS_QUERY_KEY],
        queryFn: fetchAllBlogPosts,
        staleTime: 1000 * 60 * 5, // Blog list is relatively stable
    });
    
    // --- TanStack Query for Wishlist ---
    const { 
        data: wishlistIds = new Set(), 
        isLoading: isWishlistLoading, 
        isFetching: isWishlistFetching 
    } = useQuery({
        queryKey: [WISHLIST_QUERY_KEY, user?.email],
        queryFn: () => fetchWishlistIds(user?.email),
        enabled: !!user?.email, // Only run this query if the user is logged in
        staleTime: 1000 * 60,
    });
    
    // --- TanStack Mutation for Wishlist ---
    const { mutate: addToWishlist, isLoading: isMutatingWishlist } = useMutation({
        mutationFn: async (payload) => {
            const response = await axios.post(`${BASE_URL}/wishlist`, payload);
            return response.data;
        },
        onSuccess: (data, variables) => {
            toast.success("Wishlisted Successfully");
            // Optimistically update the client state for a snappier feel
            // Invalidate the query to ensure eventual consistency
            queryClient.invalidateQueries({ queryKey: [WISHLIST_QUERY_KEY, user.email] });
            
            // NOTE: The original component used a local state (wishlistIds) which is now replaced
            // by the useQuery data. The onSuccess will trigger the useQuery to refetch,
            // updating the UI automatically.
        },
        onError: (error, variables) => {
            if (error.response?.status === 409) {
                toast.info("Already wishlisted");
            } else {
                toast.error("Failed to add to wishlist");
            }
            console.error('Wishlist error:', error);
        },
    });

    // --- Handlers & Effects ---
    
    // Auto-scroll to top on component mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Close category dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target)) {
                setCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const isWishlisted = (blogId) => wishlistIds.has(String(blogId));

    const handleWishlist = (blog) => {
        if (!user) return toast.error("You must log in to add to wishlist");
        if (isWishlisted(blog._id)) return toast.info("Already wishlisted");

        const payload = {
            blogId: blog._id,
            title: blog.title,
            category: blog.category,
            tags: blog.tags,
            shortDescription: blog.shortDescription,
            content: blog.content,
            email: user.email,
            image: blog.image,
            author: blog.author,
            date: blog.date,
            readTime: blog.readTime,
        };
        
        // Pass the blog ID to the mutation to help manage the loading state per button
        addToWishlist(payload, {
            // This is how we'll track the specific button's loading state
            meta: { blogId: blog._id } 
        });
    };
    
    // Determine if a specific blog button is currently loading
    const isBlogWishlistLoading = (blogId) => 
        isMutatingWishlist && addToWishlist.variables?.blogId === blogId;


    const handleDetails = (id) => navigate(`/blogs/${id}`);

    // --- Filtering Logic (now using TanStack Query data) ---
    const filteredBlogs = blogs.filter(blog => {
        const searchMatch =
            blog.title.toLowerCase().includes(debouncedSearchTerm) ||
            blog.shortDescription.toLowerCase().includes(debouncedSearchTerm) ||
            blog.author.toLowerCase().includes(debouncedSearchTerm);
            
        const categoryMatch = selectedCategory === 'All' || blog.category === selectedCategory;
        
        return searchMatch && categoryMatch;
    });

    // --- Render Logic ---
    const overallLoading = isBlogsLoading;

    if (isBlogsError) {
        return (
            <div className="container mx-auto px-4 py-16 text-center text-red-600 dark:text-red-400">
                <h2 className="text-2xl font-bold">Error loading blog posts! 😔</h2>
                <p>Could not fetch articles. Please try refreshing the page.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Explore Our Blog Library</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mx-auto max-w-3xl transition-colors duration-300">
                        Discover insights, tutorials, and expert opinions.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 relative" ref={categoryRef}>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 h-5 w-5 transition-colors duration-300" />
                        <input
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 placeholder-gray-600 dark:placeholder-gray-400 bg-white dark:bg-gray-800 transition-colors duration-300"
                            placeholder="Search title, author, content..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setCategoryOpen(open => !open)}
                            className="flex items-center justify-between px-4 py-3 border text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-lg w-48 bg-white dark:bg-gray-800 transition-colors duration-300"
                            aria-haspopup="listbox"
                            aria-expanded={categoryOpen}
                        >
                            <span>{selectedCategory}</span>
                            <ChevronDown className="h-4 w-4 ml-2" />
                        </button>
                        <AnimatePresence>
                            {categoryOpen && (
                                <motion.ul
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute z-10 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-md mt-1 shadow-md transition-colors duration-300"
                                    role="listbox"
                                >
                                    {categories.map(cat => (
                                        <li
                                            key={cat}
                                            className={`px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 ${selectedCategory === cat
                                                    ? 'bg-blue-50 dark:bg-gray-700 font-semibold'
                                                    : ''
                                                } transition-colors duration-300`}
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                setCategoryOpen(false);
                                            }}
                                            role="option"
                                            aria-selected={selectedCategory === cat}
                                        >
                                            {cat}
                                        </li>
                                    ))}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Count */}
                {!overallLoading && (
                    <p className="mb-6 text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        Showing **{filteredBlogs.length}** of **{blogs.length}** articles
                        {selectedCategory !== "All" && ` in ${selectedCategory}`}
                        {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
                    </p>
                )}

                {/* Blog Grid */}
                {overallLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
                                {/* Use TanStack Query's loading state (isBlogsLoading) to control Skeleton */}
                                <Skeleton height={192} className="mb-4" />
                                <Skeleton height={24} width="60%" className="mb-2" />
                                <Skeleton count={2} />
                                <div className="flex justify-between mt-4">
                                    <Skeleton width={100} />
                                    <Skeleton width={60} />
                                </div>
                                <Skeleton height={40} className="mt-4 rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : filteredBlogs.length > 0 ? (
                    <PhotoProvider>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            {filteredBlogs.map(blog => (
                                <motion.div
                                    key={blog._id}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-colors duration-300 flex flex-col"
                                >
                                    <div className="relative cursor-pointer">
                                        <PhotoView src={blog.image || blog.imageUrl || 'https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png'}>
                                            <img
                                                src={blog.image || blog.imageUrl || 'https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png'}
                                                alt={blog.title}
                                                className="w-full h-72 object-cover"
                                            />
                                        </PhotoView>
                                        <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                                            {blog.category}
                                        </span>
                                        <button
                                            onClick={() => handleWishlist(blog)}
                                            disabled={isBlogWishlistLoading(blog._id)}
                                            className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors duration-300"
                                            aria-label={isWishlisted(blog._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                                        >
                                            {isBlogWishlistLoading(blog._id) ? (
                                                <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <FaHeart
                                                    className={`h-5 w-5 ${isWishlisted(blog._id) ? 'text-red-500' : 'text-gray-400 dark:text-gray-400'}`}
                                                />
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex flex-col flex-1 p-6">
                                        <h3
                                            onClick={() => handleDetails(blog._id)}
                                            className="hover:text-blue-600 dark:hover:text-blue-400 mb-4 line-clamp-2 text-xl font-bold cursor-pointer text-gray-900 dark:text-white transition-colors duration-300"
                                        >
                                            {blog.title.length > 40
                                                ? blog.title.slice(0, 40) + '...'
                                                : blog.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 transition-colors duration-300">
                                            {blog.shortDescription.length > 50
                                                ? blog.shortDescription.slice(0, 50) + '...'
                                                : blog.shortDescription}
                                        </p>
                                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 transition-colors duration-300">
                                            <div className="flex items-center space-x-1">
                                                <User className="h-4 w-4" />
                                                <span>{blog.author}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{format(new Date(blog.date), 'MMM dd, yyyy')}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Eye className="h-4 w-4" />
                                                <span>{blog.readTime}</span>
                                            </div>
                                        </div>

                                        <div className="flex-grow" />

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDetails(blog._id)}
                                            className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold transition-colors duration-300"
                                        >
                                            Read More
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </PhotoProvider>
                ) : (
                    <div className="text-center py-16">
                        <div className="mx-auto w-64 mb-6">
                            <Lottie animationData={notFound} loop />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
                            {blogs.length === 0 ? 'No blogs yet' : 'No articles found'}
                        </h2>
                        <p className="mb-8 text-gray-600 dark:text-gray-400 transition-colors duration-300">
                            {blogs.length === 0 ? 'Be the first to post!' : 'Adjust your search or category.'}
                        </p>
                        <button
                            onClick={() => navigate('/add-blog')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors duration-300"
                        >
                            Write a Blog
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllBlogs;