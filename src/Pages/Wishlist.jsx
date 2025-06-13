import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { toast } from 'sonner';
import { RefreshCcw, BookmarkX, Clock, Tag, User, Trash2, Heart, LoaderCircle, Eye, } from 'lucide-react';
import { format } from 'date-fns';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import Swal from 'sweetalert2';

const Wishlists = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`https://blog-craft-server.vercel.app/wishlist?email=${user.email}`, {
                withCredentials: 'include'
            });
            setWishlist(res.data);
        } catch (err) {
            console.error('Failed to fetch wishlist', err);
            setError('Unable to load your wishlist. Please try again later.');
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        setDeleteLoading(true)
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(result => {
            if (result.isConfirmed) {
                fetch(`https://blog-craft-server.vercel.app/wishlist/${id}`, {
                    method: 'DELETE',
                })
                    .then(response => {
                        const contentType = response.headers.get("content-type");
                        if (contentType && contentType.includes("application/json")) {
                            return response.json().then(data => ({ response, data }));
                        }
                        setDeleteLoading(false)
                        return { response, data: null };
                    })
                    .then(({ response, data }) => {
                        if (!response.ok) {
                            throw new Error(data?.message || `Failed with status ${response.status}`);
                        }
                        setDeleteLoading(false)
                        setWishlist(prev => prev.filter(wishlist => wishlist._id !== id));
                        Swal.fire("Deleted!", "Your wishlist has been deleted.", "success");
                    })
                    .catch(error => {
                        console.error('Error deleting wishlist:', error);
                        setDeleteLoading(false)
                        Swal.fire("Error!", error.message || "Something went wrong while deleting.", "error");
                    });
            }
        });
    };

    useEffect(() => {
        if (user?.email) {
            fetchWishlist();
        }
    }, [user]);

    const columns = useMemo(() => [
        {
            header: 'Image',
            accessorKey: 'image',
            cell: ({ row }) => (
                <div className="h-20 w-24 overflow-hidden rounded-md shadow-sm bg-gray-100">
                    <img
                        src={row.original.image || 'https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png'}
                        alt={row.original.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                            e.target.src =
                                'https://brandhub.co.nz/wp-content/uploads/2018/03/blog-page-placeholder-image-300x300.jpg';
                        }}
                    />
                </div>
            ),
        },
        {
            header: 'Title',
            accessorKey: 'title',
            cell: ({ row }) => (
                <button
                    onClick={() => navigate(`/blogs/${row.original.blogId}`)}
                    className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200 hover:underline"
                >
                    {row.original.title}
                </button>
            ),
        },
        {
            header: 'Author',
            accessorKey: 'author',
            cell: ({ row }) => (
                <div className="flex items-center">
                    <User size={16} className="text-gray-500 mr-1.5" />
                    <span>{row.original.author}</span>
                </div>
            ),
        },
        {
            header: 'Category',
            accessorKey: 'category',
            cell: ({ row }) => (
                <div className="flex items-center">
                    <Tag size={16} className="text-gray-500 mr-1.5" />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {row.original.category}
                    </span>
                </div>
            ),
            meta: { className: 'hidden md:table-cell' },
        },
        {
            header: 'Date',
            accessorKey: 'date',
            cell: ({ row }) => (
                <div className="text-gray-600 text-sm">
                    {format(new Date(row.original.date), 'MMM dd, yyyy')}
                </div>
            ),
            meta: { className: 'hidden md:table-cell' },
        },
        {
            header: 'Read Time',
            accessorKey: 'readTime',
            cell: ({ row }) => (
                <div className="flex items-center">
                    <Clock size={16} className="text-gray-500 mr-1.5" />
                    <span>{row.original.readTime}</span>
                </div>
            ),
            meta: { className: 'hidden lg:table-cell' },
        },
        {
            header: '',
            id: 'details',
            cell: ({ row }) => (
                <button
                    onClick={() => navigate(`/blogs/${row.original.blogId}`)}
                    className="group flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 hover:bg-blue-500 transition-colors"
                    aria-label="View details"
                >
                    <Eye
                        size={16}
                        className="text-blue-500 group-hover:text-white transition-colors duration-200"
                    />
                </button>
            ),
        },
        {
            header: '',
            id: 'delete',
            cell: ({ row }) => (
                <button
                    onClick={() => handleDelete(row.original._id)}
                    className="group flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-500 transition-colors outline-none border-none"
                    aria-label="Delete from wishlist"
                >
                    {deleteLoading ? <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /> : <Trash2 size={16} className="text-red-500 group-hover:text-white transition-colors duration-200" />}
                </button>
            ),
        },
    ], [navigate]);

    const table = useReactTable({
        data: wishlist,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 5 },
        },
    });

    return (
        <div className="md:container min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div className="flex flex-col items-center gap-y-2 justify-start w-full">
                        <Heart className="py-2 px-2 bg-gray-100 h-16 w-16 rounded-full text-red-400" />
                        <h1 className="text-3xl font-bold text-gray-900">Your Wishlist</h1>
                        <p className="text-gray-600">
                            {!loading && wishlist.length > 0
                                ? `${wishlist.length} saved ${wishlist.length === 1 ? 'item' : 'items'}`
                                : 'Saved blogs for later reading'}
                        </p>
                    </div>
                    {!loading && wishlist.length > 0 && (
                        <button
                            onClick={fetchWishlist}
                            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <RefreshCcw size={16} className="mr-2" />
                            Refresh
                        </button>
                    )}
                </div>
                {error && !loading && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-cyan-500 to-blue-600 w-full">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Image</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Author</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden md:table-cell">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider hidden lg:table-cell">Read Time</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"></th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="hover:bg-blue-50 transition-colors duration-200">
                                        <td className="px-4 py-4"><Skeleton height={80} width={96} /></td>
                                        <td className="px-4 py-4"><Skeleton width={120} height={20} /></td>
                                        <td className="px-4 py-4"><Skeleton width={100} height={16} /></td>
                                        <td className="px-4 py-4 hidden md:table-cell"><Skeleton width={80} height={16} /></td>
                                        <td className="px-4 py-4 hidden md:table-cell"><Skeleton width={80} height={16} /></td>
                                        <td className="px-4 py-4 hidden lg:table-cell"><Skeleton width={60} height={16} /></td>
                                        <td className="px-4 py-4"><Skeleton circle width={32} height={32} /></td>
                                        <td className="px-4 py-4"><Skeleton circle width={32} height={32} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-100 rounded-lg">
                    <BookmarkX size={60} className="mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No Blogs Found</h2>
                    <p className="max-w-md text-center text-gray-500">
                        You don't have any blogs saved in your wishlist yet. Start exploring and save your favorites for later!
                    </p>
                    <button onClick={() => navigate('/blogs')} className='mt-2 py-2 px-4 bg-red-400 text-white rounded-lg cursor-pointer'>Add your first blog to your wishlist</button>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-cyan-500 to-blue-600">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className={`px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ${header.column.columnDef.meta?.className || ''}`}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id} className="hover:bg-blue-50 transition-colors">
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-4 py-4 whitespace-nowrap">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <p className="text-sm text-gray-700">Showing <span className="font-medium">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to <span className="font-medium">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, wishlist.length)}</span>of <span className="font-medium">{wishlist.length}</span> results</p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className={`px-4 py-2 rounded-md border text-sm ${table.getCanPreviousPage()
                                    ? 'bg-white hover:bg-gray-50 text-gray-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className={`px-4 py-2 rounded-md border text-sm ${table.getCanNextPage()
                                    ? 'bg-white hover:bg-gray-50 text-gray-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wishlists;