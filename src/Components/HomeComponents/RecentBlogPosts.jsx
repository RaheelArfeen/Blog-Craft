import React, { useContext } from 'react';
import { Eye, Calendar, User } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Lottie from 'lottie-react';
// Make sure this path is correct based on your project structure
import notFound from '../../assets/notFound.json';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'sonner';
import { format } from 'date-fns';
// Make sure this path is correct based on your project structure
import { AuthContext } from '../../Provider/AuthProvider';
import { motion } from 'framer-motion';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// --- API Constants ---
const BASE_URL = 'http://localhost:3000';
const RECENT_BLOGS_QUERY_KEY = 'recentBlogs';
const WISHLIST_QUERY_KEY = 'wishlist';

// --- Fetch Functions ---

// 1. Fetch Recent Blog Posts (Limit 6)
const fetchRecentBlogPosts = async () => {
  const { data } = await axios.get(`${BASE_URL}/blogs`);
  // Simulate original logic of slicing the first 6
  return data.slice(0, 6);
};

// 2. Fetch User Wishlist IDs
const fetchWishlistIds = async (email) => {
  if (!email) return new Set();
  const { data } = await axios.get(`${BASE_URL}/wishlist`, {
    params: { email },
  });
  return new Set(data.map((item) => String(item.blogId)));
};

// --- Component ---

const RecentBlogPosts = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // 1. TanStack Query for Recent Blog Posts
  const {
    data: blogs = [],
    isLoading: isBlogsLoading,
    isError: isBlogsError,
  } = useQuery({
    queryKey: [RECENT_BLOGS_QUERY_KEY],
    queryFn: fetchRecentBlogPosts,
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
  });

  // 2. TanStack Query for User Wishlist
  const { data: wishlistIds = new Set(), isLoading: isWishlistLoading } = useQuery({
    queryKey: [WISHLIST_QUERY_KEY, user?.email],
    queryFn: () => fetchWishlistIds(user?.email),
    enabled: !!user?.email, // Only run this query if the user is logged in
    staleTime: 1000 * 60,
  });

  const isWishlisted = (blogId) => wishlistIds.has(String(blogId));

  // 3. TanStack Mutation for Adding to Wishlist
  const { mutate: addToWishlist, isLoading: isAddingToWishlist } = useMutation({
    mutationFn: async (payload) => {
      const response = await axios.post(`${BASE_URL}/wishlist`, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Wishlisted Successfully');
      // Invalidate the wishlist query to refetch and update the UI automatically
      queryClient.invalidateQueries({ queryKey: [WISHLIST_QUERY_KEY, user.email] });
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.info('Already wishlisted');
      } else {
        toast.error('Failed to add to wishlist');
      }
      console.error('Wishlist error:', error);
    },
  });

  const handleWishlist = (blog) => {
    if (!user) return toast.error('You must log in to add to wishlist');
    if (isWishlisted(blog._id)) return toast.info('Already wishlisted');

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

    addToWishlist(payload);
  };

  const handleDetails = (id) => navigate(`/blogs/${id}`);

  // --- Animation Variants (Unchanged) ---
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
  // ------------------------------------

  // Consolidated loading state for the main content
  const overallLoading = isBlogsLoading;

  if (isBlogsError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600 dark:text-red-400">
        <h2 className="text-2xl font-bold">Error loading recent posts! 😔</h2>
        <p>Please check your network connection or try again later.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">Recent Blog Posts</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mx-auto max-w-3xl">
            Discover the latest insights, tutorials, and stories from our community of passionate writers.
          </p>
        </div>

        {overallLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg dark:shadow-gray-900"
              >
                <Skeleton
                  baseColor="#e0e0e0"
                  highlightColor="#f5f5f5"
                  darkColor="#2c2c2c"
                  height={192}
                  className="mb-4 rounded-md"
                />
                <Skeleton height={24} width="60%" className="mb-2 rounded" />
                <Skeleton count={2} />
                <div className="flex justify-between mt-4">
                  <Skeleton width={100} />
                  <Skeleton width={60} />
                </div>
                <Skeleton height={40} className="mt-4 rounded-lg" />
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {blogs.map((blog) => (
              <PhotoProvider key={blog._id}>
                <motion.div
                  variants={cardVariants}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg dark:shadow-gray-900 hover:-translate-y-1 transition flex flex-col"
                >
                  <div className="relative">
                    <PhotoView
                      src={
                        blog.image ||
                        blog.imageUrl ||
                        'https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png'
                      }
                    >
                      <img
                        src={
                          blog.image ||
                          blog.imageUrl ||
                          'https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png'
                        }
                        alt={blog.title}
                        className="w-full h-72 object-cover"
                      />
                    </PhotoView>
                    <span className="absolute top-4 left-4 bg-blue-600 dark:bg-blue-700 text-white px-3 py-1 rounded-full text-sm select-none">
                      {blog.category}
                    </span>
                    <button
                      // Check if the current blog ID is actively being added/mutated
                      onClick={() => handleWishlist(blog)}
                      disabled={isAddingToWishlist && mutation.variables?.blogId === blog._id}
                      className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
                    >
                      {/* Check if the current blog ID is actively being added/mutated */}
                      {isAddingToWishlist && mutation.variables?.blogId === blog._id ? (
                        <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FaHeart
                          className={`h-5 w-5 ${
                            isWishlisted(blog._id) ? 'text-red-500' : 'text-gray-400 dark:text-gray-400'
                          }`}
                        />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <h3
                      onClick={() => handleDetails(blog._id)}
                      className="hover:text-blue-600 dark:hover:text-blue-400 mb-4 line-clamp-2 text-xl font-bold cursor-pointer text-gray-900 dark:text-gray-100"
                    >
                      {blog.title.length > 40 ? blog.title.slice(0, 40) + '...' : blog.title}
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
                      onClick={() => handleDetails(blog._id)}
                      className="w-full py-3 text-white bg-blue-600 dark:bg-blue-700 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      Read More
                    </motion.button>
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
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {blogs.length === 0 ? 'No blogs yet' : 'No articles found'}
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              {blogs.length === 0 ? 'Be the first to post!' : 'Adjust your search or category.'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/add-blog')}
              className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-semibold"
            >
              Write a Blog
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentBlogPosts;