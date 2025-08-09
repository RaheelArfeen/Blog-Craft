import React, { useEffect, useState, useContext, useMemo } from 'react';
import axios from 'axios';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender
} from '@tanstack/react-table';
import {
    Bookmark,
    Clock,
    Eye,
    Sparkles,
    Tag,
    TrendingUp,
    User,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import { toast } from 'sonner';
import { FaHeart } from 'react-icons/fa';

const Featured = () => {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [wishlistLoadingIds, setWishlistLoadingIds] = useState(new Set());
    const [sorting, setSorting] = useState([]);

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchFeatured = async () => {
            setLoading(true);
            try {
                const res = await axios.get('https://blog-craft-server.vercel.app/blogs', {
                    withCredentials: true
                });
                const sortedTop10 = res.data
                    .filter(blog => blog?.content)
                    .sort((a, b) => b.content.length - a.content.length)
                    .slice(0, 10);
                setFeatured(sortedTop10);
            } catch (error) {
                console.error("Error fetching featured blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, [user]);

    useEffect(() => {
        if (!user?.email) {
            setWishlistIds(new Set());
            return;
        }

        axios
            .get('https://blog-craft-server.vercel.app/wishlist', {
                params: { email: user.email }
            })
            .then((res) => {
                const ids = new Set(res.data.map((item) => String(item.blogId)));
                setWishlistIds(ids);
            })
            .catch(() => setWishlistIds(new Set()));
    }, [user]);

    const isWishlisted = (blogId) => wishlistIds.has(String(blogId));

    const handleWishlist = async (blog) => {
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
            readTime: blog.readTime
        };

        try {
            setWishlistLoadingIds((prev) => new Set(prev).add(blog._id));
            await axios.post('https://blog-craft-server.vercel.app/wishlist', payload);
            setWishlistIds((prev) => new Set(prev).add(String(blog._id)));
            toast.success('Wishlisted Successfully');
        } catch (err) {
            if (err.response?.status === 409) {
                toast.info('Already wishlisted');
            } else {
                toast.error('Failed to add to wishlist');
            }
        } finally {
            setWishlistLoadingIds((prev) => {
                const copy = new Set(prev);
                copy.delete(blog._id);
                return copy;
            });
        }
    };

    const columns = useMemo(
        () => [
            {
                header: 'Image',
                accessorKey: 'image',
                enableSorting: false,
                cell: ({ row }) => (
                    <div className="h-20 w-24 overflow-hidden rounded-md shadow-sm bg-gray-100 dark:bg-gray-700">
                        <img
                            src={row.original.image}
                            alt="blog"
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
                        />
                    </div>
                )
            },
            {
                header: 'Title',
                accessorKey: 'title',
                cell: ({ row }) => (
                    <button
                        onClick={() => navigate(`/blogs/${row.original._id}`)}
                        className="text-blue-600 font-medium hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        {row.original.title}
                    </button>
                )
            },
            {
                header: 'Author',
                accessorKey: 'author',
                cell: ({ row }) => (
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <User size={16} className="text-gray-500 dark:text-gray-400 mr-1.5" />
                        {row.original.author}
                    </div>
                )
            },
            {
                header: 'Category',
                accessorKey: 'category',
                cell: ({ row }) => (
                    <div className="flex items-center">
                        <Tag size={16} className="text-gray-500 dark:text-gray-400 mr-1.5" />
                        <span className="text-sm bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 dark:bg-blue-900 dark:text-blue-300">
                            {row.original.category}
                        </span>
                    </div>
                )
            },
            {
                header: 'Date',
                accessorKey: 'date',
                cell: ({ row }) => (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {format(new Date(row.original.date), 'MMM dd, yyyy')}
                    </span>
                )
            },
            {
                header: 'Read Time',
                accessorKey: 'readTime',
                cell: ({ row }) => (
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <Clock size={16} className="text-gray-500 dark:text-gray-400 mr-1.5" />
                        {row.original.readTime}
                    </div>
                )
            },
            {
                header: '',
                id: 'view',
                enableSorting: false,
                cell: ({ row }) => (
                    <button
                        onClick={() => navigate(`/blogs/${row.original._id}`)}
                        className="group flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-500 dark:bg-blue-900 dark:hover:bg-blue-700"
                    >
                        <Eye size={16} className="text-blue-500 group-hover:text-white dark:text-blue-300 dark:group-hover:text-white" />
                    </button>
                )
            },
            {
                header: '',
                id: 'wishlist',
                enableSorting: false,
                cell: ({ row }) => (
                    <button
                        onClick={() => handleWishlist(row.original)}
                        disabled={wishlistLoadingIds.has(row.original._id)}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        {wishlistLoadingIds.has(row.original._id) ? (
                            <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <FaHeart
                                className={`h-5 w-5 ${isWishlisted(row.original._id)
                                    ? 'text-red-500'
                                    : 'text-gray-400 dark:text-gray-500'
                                    }`}
                            />
                        )}
                    </button>
                )
            }
        ],
        [navigate, wishlistLoadingIds, wishlistIds]
    );

    const table = useReactTable({
        data: featured,
        columns,
        state: {
            sorting
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
    });

    return (
        <div className="container min-h-screen mx-auto px-4 py-8 dark:bg-gray-900 dark:text-gray-200">
            <div className="text-center mb-12 w-full">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-12 rounded-xl inline-block shadow w-full
                                dark:from-gray-800 dark:to-purple-900 dark:shadow-none">
                    <div className="inline-flex items-center gap-2 border border-blue-200 rounded-full px-4 py-2 mb-4 text-sm font-medium text-blue-700
                                    dark:border-purple-700 dark:text-purple-400">
                        <TrendingUp className="w-4 h-4" />
                        Featured Blogs
                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">
                        Explore Our Top Picks
                    </h2>
                    <p className="text-gray-600 mt-4 max-w-xl mx-auto dark:text-gray-300">
                        Discover trending blogs carefully selected for you. Stay inspired and informed!
                    </p>
                </div>
            </div>

            {loading ? (
                <Skeleton count={6} height={100} className="mb-4" />
            ) : featured.length === 0 ? (
                <div className="text-center py-20 text-gray-400 bg-gray-100 rounded-lg
                                dark:bg-gray-800 dark:text-gray-400">
                    <h2 className="text-2xl font-semibold mb-2">No Featured Blogs</h2>
                    <p className="text-gray-500 dark:text-gray-400">You haven’t featured any blogs yet.</p>
                    <button
                        onClick={() => navigate('/blogs')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
                                   dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        Explore Blogs
                    </button>
                </div>
            ) : (
                <div className="rounded-lg md:border border-gray-200 overflow-hidden
                                dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 whitespace-nowrap
                                          dark:divide-gray-700">
                            <thead className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white
                                             dark:from-gray-700 dark:to-gray-900">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none"
                                            >
                                                <div className="flex items-center gap-1">
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: <ChevronUp className="w-4 h-4" />,
                                                        desc: <ChevronDown className="w-4 h-4" />
                                                    }[header.column.getIsSorted()] ?? null}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200
                                              dark:bg-gray-800 dark:divide-gray-700">
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td
                                                key={cell.id}
                                                className="p-4"
                                                data-label={cell.column.columnDef.header || ''}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Featured;
