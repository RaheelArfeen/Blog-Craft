import React, { useState, useEffect } from 'react';
import { Search, Heart, Eye, Calendar, User, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AllBlogs = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3000/blogs')
            .then(res => {
                setAllBlogs(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching blogs:', err);
                setLoading(false);
            });
    }, []);

    const categories = ['All', 'Technology', 'Design', 'Backend', 'AI', 'CSS', 'Marketing', 'Lifestyle', 'Business'];

    const filteredBlogs = allBlogs.filter(blog => {
        const matchesSearch =
            blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.author?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleWishlist = (id) => {
        console.log('Wishlisted:', id);
    };

    const handleDetails = (id) => {
        navigate(`/blogs/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="md:container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Blog Library</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Discover insights, tutorials, and expert opinions from our community of passionate writers and industry professionals.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 relative">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search by title, content, or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setCategoryOpen(!categoryOpen)}
                            className="flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg w-48 bg-white hover:bg-gray-100"
                        >
                            <span>{selectedCategory}</span>
                            <ChevronDown className="w-4 h-4 ml-2" />
                        </button>
                        {categoryOpen && (
                            <ul className="absolute z-10 w-48 bg-white border border-gray-200 rounded-md mt-1 shadow-lg h-fit overflow-y-auto">
                                {categories.map(cat => (
                                    <li
                                        key={cat}
                                        onClick={() => {
                                            setSelectedCategory(cat);
                                            setCategoryOpen(false);
                                        }}
                                        className={`px-4 py-2 hover:bg-blue-100 cursor-pointer ${selectedCategory === cat ? 'bg-blue-50 font-semibold' : ''
                                            }`}
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                {!loading && (
                    <div className="mb-6 text-gray-600">
                        Showing {filteredBlogs.length} of {allBlogs.length} articles
                        {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                        {searchTerm && ` matching "${searchTerm}"`}
                    </div>
                )}

                {/* Blog Cards or Skeletons */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading
                        ? Array(6).fill(0).map((_, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
                                <Skeleton height={192} className="mb-4" />
                                <Skeleton height={24} width="60%" className="mb-2" />
                                <Skeleton count={2} className="mb-2" />
                                <div className="flex items-center justify-between mt-4">
                                    <Skeleton width={100} height={20} />
                                    <Skeleton width={60} height={20} />
                                </div>
                                <Skeleton height={40} className="mt-4 rounded-lg" />
                            </div>
                        ))
                        : filteredBlogs.map(blog => (
                            <div
                                key={blog._id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="relative">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {blog.category}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleWishlist(blog._id)}
                                        className="absolute top-4 right-4 bg-gray-200 bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
                                    >
                                        <Heart className="h-5 w-5 text-gray-700 hover:text-red-500" />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                                        {blog.title}
                                    </h3>

                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {blog.shortDescription}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-1">
                                                <User className="h-4 w-4" />
                                                <span>{blog.author}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{blog.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Eye className="h-4 w-4" />
                                            <span>{blog.readTime}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleDetails(blog._id)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
                                    >
                                        Read More
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* No Blogs or No Results */}
                {!loading && filteredBlogs.length === 0 && (
                    <div className="text-center py-16">
                        <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                            <Search className="h-12 w-12 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {allBlogs.length === 0 ? 'No blogs yet' : 'No articles found'}
                        </h2>
                        <p className="text-gray-600 mb-8">
                            {allBlogs.length === 0
                                ? 'Be the first to share your knowledge with the community!'
                                : 'Try adjusting your search terms or filters to find more content.'}
                        </p>
                        {allBlogs.length === 0 ? (
                            <a
                                href="/add-blog"
                                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Create Your First Blog
                            </a>
                        ) : (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('All');
                                }}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllBlogs;
