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
    const [hasBlogId, setHasBlogId] = useState([]);

    const categoryRef = useRef(null);

    // Fetch blogs
    useEffect(() => {
        axios.get('http://localhost:3000/blogs')
            .then(res => {
                setBlogs(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Fetch wishlist after blogs are loaded
    useEffect(() => {
        if (!loading && user) {
            axios.get(`http://localhost:3000/wishlist`)
                .then(res => {
                    const ids = new Set(res.data?.map(item => item._id));
                    setWishlistIds(ids);
                })
                .catch(() => { });
        }
    }, [loading, user]);

    // Fetch wishlist blogIds for active heart icon
    useEffect(() => {
        fetch('http://localhost:3000/wishlist')
            .then(res => res.json())
            .then(data => {
                // Extract blogId from wishlist entries
                const ids = data.map(item => item.blogId);
                setHasBlogId(ids);
            })
            .catch(err => console.error('Fetch error:', err));
    }, []);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm.trim().toLowerCase());
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Close category dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target)) {
                setCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const categories = ['All', 'Technology', 'Design', 'Backend', 'AI', 'CSS', 'Marketing', 'Lifestyle', 'Business'];

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch =
            blog.title?.toLowerCase().includes(debouncedSearchTerm) ||
            blog.shortDescription?.toLowerCase().includes(debouncedSearchTerm) ||
            blog.author?.toLowerCase().includes(debouncedSearchTerm);

        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const isWishlisted = (id) => wishlistIds.has(id);
    const hasBlogIdentifier = (blogId) => hasBlogId.includes(blogId);

    const handleWishlist = async (blog) => {
        if (!user) return toast.error("You must be logged in to add to wishlist");

        if (isWishlisted(blog._id)) return toast.info("Already in your wishlist");

        const blogToSave = { ...blog, userEmail: user.email };

        try {
            setWishlistLoadingIds(prev => new Set(prev).add(blog._id));
            await axios.post(`http://localhost:3000/wishlist`, blogToSave);
            toast.success('Blog added to wishlist!');
            setWishlistIds(prev => new Set(prev).add(blog._id));
            setHasBlogId(prev => [...prev, blog._id]);
        } catch (error) {
            toast.error('Already in your wishlist.');
            console.log(error);
        } finally {
            setWishlistLoadingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(blog._id);
                return newSet;
            });
        }
    };

    const handleDetails = (id) => navigate(`/blogs/${id}`);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="md:container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Blog Library</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover insights, tutorials, and expert opinions from our community of passionate writers and professionals.
                    </p>
                </div>

                {/* Search & Category Filter */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 relative" ref={categoryRef}>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search by title, content, or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setCategoryOpen(!categoryOpen)}
                            className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg w-48"
                            aria-haspopup="listbox"
                        >
                            <span>{selectedCategory}</span>
                            <ChevronDown className="w-4 h-4 ml-2" />
                        </button>
                        {categoryOpen && (
                            <ul
                                className="absolute z-10 w-48 border bg-white border-gray-200 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
                                role="listbox"
                            >
                                {categories.map(cat => (
                                    <li
                                        key={cat}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setCategoryOpen(false);
                                        }}
                                        className={`px-4 py-2 hover:bg-blue-100 cursor-pointer ${selectedCategory === cat ? 'bg-blue-50 font-semibold' : ''}`}
                                        role="option"
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Blog Count */}
                {!loading && (
                    <div className="mb-6 text-gray-600">
                        Showing {filteredBlogs.length} of {blogs.length} articles
                        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                        {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
                    </div>
                )}

                {/* Blog Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading
                        ? Array(6).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                                <Skeleton height={192} className="mb-4" />
                                <Skeleton height={24} width="60%" className="mb-2" />
                                <Skeleton count={2} />
                                <div className="flex justify-between mt-4">
                                    <Skeleton width={100} />
                                    <Skeleton width={60} />
                                </div>
                                <Skeleton height={40} className="mt-4 rounded-lg" />
                            </div>
                        ))
                        : filteredBlogs.map(blog => (
                            <div
                                key={blog._id}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                            >
                                <div className="relative">
                                    <img
                                        src={blog.image || 'https://via.placeholder.com/400x200'}
                                        alt={blog.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {blog.category}
                                    </span>
                                    <button
                                        onClick={() => handleWishlist(blog)}
                                        disabled={wishlistLoadingIds.has(blog._id)}
                                        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 bg-opacity-80 hover:bg-opacity-100 transition transform hover:scale-110"
                                        aria-label="Add to wishlist"
                                    >
                                        {wishlistLoadingIds.has(blog._id) ? (
                                            <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <FaHeart
                                                className={`h-5 w-5 ${isWishlisted(blog._id) || hasBlogIdentifier(blog._id)
                                                        ? 'text-red-500'
                                                        : 'text-gray-400'
                                                    }`}
                                            />
                                        )}
                                    </button>
                                </div>
                                <div className="p-6">
                                    <h3
                                        className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer"
                                        onClick={() => handleDetails(blog._id)}
                                    >
                                        {blog.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3">{blog.shortDescription}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
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
                                            <span>{blog.readTime} min read</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDetails(blog._id)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                                    >
                                        Read More
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Empty State */}
                {!loading && filteredBlogs.length === 0 && (
                    <div className="text-center py-16">
                        <div className="mx-auto w-64 mb-6">
                            <Lottie animationData={notFound} loop />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {blogs.length === 0 ? 'No blogs yet' : 'No articles found'}
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {blogs.length === 0
                                ? 'Be the first to share your knowledge!'
                                : 'Try adjusting your search or filter.'}
                        </p>
                        <a
                            href={blogs.length === 0 ? "/add-blog" : "/"}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            {blogs.length === 0 ? "Add Your Blog" : "Back to Home"}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllBlogs;
