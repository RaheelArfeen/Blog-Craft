import React, { useState, useEffect, useContext, useRef } from 'react';
import { Search, Eye, Calendar, User, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Lottie from 'lottie-react';
import notFound from '../assets/notFound.json';
import { FaHeart } from 'react-icons/fa';
import { AuthContext } from '../Provider/AuthProvider';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const AllBlogs = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [wishlistLoadingIds, setWishlistLoadingIds] = useState(new Set());

    const categoryRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        axios.get('https://blog-craft-server.vercel.app/blogs')
            .then(res => {
                setBlogs(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!user?.email) {
            setWishlistIds(new Set());
            return;
        }

        axios.get('https://blog-craft-server.vercel.app/wishlist', {
            params: { email: user.email }
        })
            .then(res => {
                const ids = new Set(res.data.map(item => String(item.blogId)));
                setWishlistIds(ids);
            })
            .catch(() => setWishlistIds(new Set()));
    }, [user, loading]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm.trim().toLowerCase());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const handleClick = (e) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target)) {
                setCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const categories = ['All' ,'Technology', 'Design', 'Backend', 'AI', 'CSS', 'Marketing', 'Lifestyle', 'Business', 'Development', 'UI/UX', 'Career', 'Tutorial'];

    const filteredBlogs = blogs.filter(blog => {
        const searchMatch =
            blog.title.toLowerCase().includes(debouncedSearchTerm) ||
            blog.shortDescription.toLowerCase().includes(debouncedSearchTerm) ||
            blog.author.toLowerCase().includes(debouncedSearchTerm);
        const categoryMatch = selectedCategory === 'All' || blog.category === selectedCategory;
        return searchMatch && categoryMatch;
    });

    const isWishlisted = (blogId) => wishlistIds.has(String(blogId));

    const handleWishlist = async (blog) => {
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

        try {
            setWishlistLoadingIds(prev => new Set(prev).add(blog._id));
            await axios.post('https://blog-craft-server.vercel.app/wishlist', payload);
            setWishlistIds(prev => new Set(prev).add(String(blog._id)));
            toast.success("Wishlisted Successfully");
        } catch (err) {
            if (err.response?.status === 409) {
                toast.info("Already wishlisted");
            } else {
                toast.error("Failed to add to wishlist");
            }
            console.error(err);
        } finally {
            setWishlistLoadingIds(prev => {
                const copy = new Set(prev);
                copy.delete(blog._id);
                return copy;
            });
        }
    };

    const handleDetails = (id) => navigate(`/blogs/${id}`);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Explore Our Blog Library</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mx-auto max-w-3xl">
                        Discover insights, tutorials, and expert opinions.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 relative" ref={categoryRef}>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 h-5 w-5" />
                        <input
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 placeholder-gray-600 dark:placeholder-gray-400 bg-white dark:bg-gray-800 transition-colors"
                            placeholder="Search title, author, content..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setCategoryOpen(open => !open)}
                            className="flex items-center justify-between px-4 py-3 border text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-lg w-48 bg-white dark:bg-gray-800 transition-colors"
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
                                    className="absolute z-10 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-md mt-1 shadow-md"
                                    role="listbox"
                                >
                                    {categories.map(cat => (
                                        <li
                                            key={cat}
                                            className={`px-4 py-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 ${selectedCategory === cat ? 'bg-blue-50 dark:bg-gray-700 font-semibold' : ''
                                                }`}
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
                {!loading && (
                    <p className="mb-6 text-gray-600 dark:text-gray-400">
                        Showing {filteredBlogs.length} of {blogs.length} articles
                        {selectedCategory !== "All" && ` in ${selectedCategory}`}
                        {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
                    </p>
                )}

                {/* Blog Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
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
                                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition flex flex-col"
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
                                            disabled={wishlistLoadingIds.has(blog._id)}
                                            className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full"
                                            aria-label={isWishlisted(blog._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                                        >
                                            {wishlistLoadingIds.has(blog._id) ? (
                                                <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <FaHeart
                                                    className={`h-5 w-5 ${isWishlisted(blog._id) ? 'text-red-500' : 'text-gray-400'}`}
                                                />
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex flex-col flex-1 p-6">
                                        <h3
                                            onClick={() => handleDetails(blog._id)}
                                            className="hover:text-blue-600 dark:hover:text-blue-400 mb-4 line-clamp-2 text-xl font-bold cursor-pointer text-gray-900 dark:text-white"
                                        >
                                            {blog.title.length > 40
                                                ? blog.title.slice(0, 40) + '...'
                                                : blog.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                            {blog.shortDescription.length > 50
                                                ? blog.shortDescription.slice(0, 50) + '...'
                                                : blog.shortDescription}
                                        </p>
                                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
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
                                            className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold"
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
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{blogs.length === 0 ? 'No blogs yet' : 'No articles found'}</h2>
                        <p className="mb-8 text-gray-600 dark:text-gray-400">{blogs.length === 0 ? 'Be the first to post!' : 'Adjust your search or category.'}</p>
                        <button onClick={() => navigate('/add-blog')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                            Write a Blog
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllBlogs;