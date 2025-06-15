import React, { useState, useEffect, useContext } from 'react';
import { Eye, Calendar, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Lottie from 'lottie-react';
import notFound from '../../assets/notFound.json';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { AuthContext } from '../../Provider/AuthProvider';
import { motion } from 'framer-motion';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

const RecentBlogPosts = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [wishlistLoadingIds, setWishlistLoadingIds] = useState(new Set());

    useEffect(() => {
        axios.get('https://blog-craft-server.vercel.app/blogs')
            .then(res => {
                setBlogs(res.data.slice(0, 6));
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

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Recent Blog Posts</h1>
                    <p className="text-xl text-gray-600 mx-auto max-w-3xl">
                        Discover the latest insights, tutorials, and stories from our community of passionate writers.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
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
                ) : (
                    <>
                        {blogs.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                initial="hidden"
                                animate="visible"
                                variants={containerVariants}
                            >
                                {blogs.map(blog => (
                                    <PhotoProvider key={blog._id}>
                                        <motion.div
                                            variants={cardVariants}
                                            className="bg-white rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition flex flex-col"
                                        >
                                            <div className="relative">
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
                                                    className="hover:text-blue-600 mb-4 line-clamp-2 text-xl font-bold cursor-pointer"
                                                >
                                                    {blog.title.length > 40 ? blog.title.slice(0, 40) + '...' : blog.title}
                                                </h3>
                                                <p className="text-gray-600 mb-4 line-clamp-3">
                                                    {blog.shortDescription.length > 50 ? blog.shortDescription.slice(0, 50) + '...' : blog.shortDescription}
                                                </p>
                                                <div className="flex justify-between text-sm text-gray-500 mb-4">
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

                                                <button
                                                    onClick={() => handleDetails(blog._id)}
                                                    className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-semibold"
                                                >
                                                    Read More
                                                </button>
                                            </div>
                                        </motion.div>
                                    </PhotoProvider>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-center py-16"
                            >
                                <div className="mx-auto w-64 mb-6">
                                    <Lottie animationData={notFound} loop />
                                </div>
                                <h2 className="text-2xl font-bold mb-4">{blogs.length === 0 ? 'No blogs yet' : 'No articles found'}</h2>
                                <p className="mb-8 text-gray-600">{blogs.length === 0 ? 'Be the first to post!' : 'Adjust your search or category.'}</p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate('/add-blog')}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                                >
                                    Write a Blog
                                </motion.button>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default RecentBlogPosts;