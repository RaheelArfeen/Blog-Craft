import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
// IMPORTANT: Added Star for the Author Badge
import { Calendar, Clock, Share2, ArrowLeft, MessageCircle, SquarePen, EllipsisVertical, ThumbsUp, User, Star } from "lucide-react"; 
import { toast } from "sonner";
import { format } from "date-fns";
import { AuthContext } from "../Provider/AuthProvider"; 
import Swal from "sweetalert2";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- API & Query Key Constants ---
const BASE_URL = 'https://blog-craft-server.vercel.app';
const BLOG_QUERY_KEY = 'blog';
const COMMENTS_QUERY_KEY = 'comments';
const AUTHOR_QUERY_KEY = 'author';

// --- Data Fetching Functions ---

const fetchBlogDetails = async (id) => {
    if (!id) throw new Error("Blog ID is required");
    const { data } = await axios.get(`${BASE_URL}/blogs/${id}`);
    return data;
};

const fetchBlogComments = async (id) => {
    if (!id) return [];
    const { data } = await axios.get(`${BASE_URL}/comments/${id}`);
    return data;
};

const fetchAuthorDetails = async (email) => {
    if (!email) throw new Error("Author email is required");
    const { data } = await axios.get(`${BASE_URL}/users/profile/${email}`);
    return data;
}

// --- Component ---

const BlogDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext); 
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // --- Local UI State ---
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [showAuthorTooltip, setShowAuthorTooltip] = useState(false);
    
    // State to manage the like status locally for optimistic UI updates
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);


    // --- TanStack Query: Fetch Blog ---
    const {
        data: blog,
        isLoading: isBlogLoading,
        error: blogError,
    } = useQuery({
        queryKey: [BLOG_QUERY_KEY, id],
        queryFn: () => fetchBlogDetails(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5,
        onSuccess: (data) => {
            // Initialize local like state based on fetched data
            setLikeCount(data.likes || 0);
            
            // Check if the current user's email is in the likedBy array
            const isUserLiked = data.likedBy?.includes(user?.email);
            setIsLiked(!!isUserLiked);
        },
        onError: (err) => {
            console.error("Blog fetch error:", err);
        }
    });
    
    // --- TanStack Query: Fetch Author Details (for tooltip and badge) ---
    const authorEmail = blog?.email; // Assuming blog object contains author's email
    const {
        data: authorDetails,
        isLoading: isAuthorDetailsLoading,
    } = useQuery({
        queryKey: [AUTHOR_QUERY_KEY, authorEmail],
        queryFn: () => fetchAuthorDetails(authorEmail),
        // Enable fetching once we have the email, regardless of tooltip state (for persistent badge)
        enabled: !!authorEmail, 
        staleTime: 1000 * 60 * 60 * 24, 
    });

    // --- TanStack Query: Fetch Comments ---
    const {
        data: comments = [],
        isLoading: isCommentsLoading,
        isFetching: isCommentsFetching,
    } = useQuery({
        queryKey: [COMMENTS_QUERY_KEY, id],
        queryFn: () => fetchBlogComments(id),
        enabled: !!id,
        staleTime: 1000 * 10,
    });
    
    // --- Access Reading Time (from backend) ---
    const readTime = blog?.readTime || 0;


    // --- TanStack Mutation: Post Comment (No Change) ---
    const postCommentMutation = useMutation({
        mutationFn: async (payload) => {
            const res = await axios.post(`${BASE_URL}/comments/${id}`, payload);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Comment posted!");
            setCommentText("");
            queryClient.invalidateQueries({ queryKey: [COMMENTS_QUERY_KEY, id] });
        },
        onError: (err) => {
            console.error("Comment post error:", err);
            toast.error("Failed to post comment");
        },
    });

    // --- TanStack Mutation: Delete Comment (No Change) ---
    const deleteCommentMutation = useMutation({
        mutationFn: async (commentId) => {
            await axios.delete(`${BASE_URL}/comments/${commentId}`);
        },
        onSuccess: (data, commentId) => {
            queryClient.setQueryData([COMMENTS_QUERY_KEY, id], (oldComments) => 
                oldComments.filter(comment => comment._id !== commentId)
            );
            setActiveMenuId(null);
            Swal.fire({
                title: "Deleted!",
                text: "Your comment has been deleted.",
                icon: "success"
            });
        },
        onError: (err) => {
            console.error("Comment delete error:", err);
            Swal.fire({
                title: "Error!",
                text: "Failed to delete comment.",
                icon: "error"
            });
        },
    });

    // --- TanStack Mutation: Like Blog (Optimistic Update) ---
    const likeBlogMutation = useMutation({
        mutationFn: async ({ action, userEmail }) => {
            const url = `${BASE_URL}/blogs/${id}/like`;
            const payload = { action, userEmail }; 
            const res = await axios.post(url, payload);
            return res.data;
        },
        // Optimistic Update
        onMutate: async (newLike) => {
            await queryClient.cancelQueries({ queryKey: [BLOG_QUERY_KEY, id] });
            const previousBlog = queryClient.getQueryData([BLOG_QUERY_KEY, id]);

            const newIsLiked = newLike.action === 'like';
            const newLikeCount = newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
            
            setIsLiked(newIsLiked);
            setLikeCount(newLikeCount);

            return { previousBlog };
        },
        onError: (err, newLike, context) => {
            queryClient.setQueryData([BLOG_QUERY_KEY, id], context.previousBlog);
            setIsLiked(!isLiked); 
            setLikeCount(context.previousBlog?.likes || 0);
            toast.error(newLike.action === 'like' ? "Failed to like blog" : "Failed to unlike blog");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [BLOG_QUERY_KEY, id] });
        },
    });

    // --- Handlers (No Change) ---

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleShare = async () => {
        if (!blog) return;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: blog.title,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.info("Article link copied to clipboard!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            return toast.error("You must log in to comment.");
        }
        if (!commentText.trim()) {
            return toast.error("Comment cannot be empty");
        }
        
        const userName = user?.displayName || "Anonymous";
        const userEmail = user?.email || "unknown";
        const userImage = user?.photoURL || user?.displayName?.charAt(0).toUpperCase() || "A";

        const payload = { 
            text: commentText.trim(), 
            userName, 
            userEmail,
            userImage,
            createdAt: new Date().toISOString()
        };

        postCommentMutation.mutate(payload);
    };

    const handleDeleteComment = async (commentId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            deleteCommentMutation.mutate(commentId);
        }
    };
    
    const handleLikeToggle = () => {
        if (!user) {
            return toast.error("You must log in to like a blog.");
        }
        
        const action = isLiked ? 'unlike' : 'like';
        const userEmail = user.email;

        likeBlogMutation.mutate({ action, userEmail });
    };

    // --- Loading & Error States (No Change) ---

    if (isBlogLoading) {
        return (
            <div className="flex items-center justify-center py-80 bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">Loading article...</p>
                </div>
            </div>
        );
    }

    if (blogError || !blog) {
        return (
            <div className="py-40 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-16 text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                            {blogError?.message || "The article you're looking for doesn't exist."}
                        </p>
                        <button
                            onClick={() => navigate('/blogs')}
                            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    const isAuthor = user?.email === blog?.email;
    
    const isCommentPosting = postCommentMutation.isLoading;
    const isCommentDeleting = deleteCommentMutation.isLoading;


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <article className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center mb-8 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to articles</span>
                </button>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl">
                    <div className="relative">
                        <img
                            src={blog.image || blog.imageUrl || 'https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png'}
                            alt={blog.title}
                            className="w-full h-[16rem] md:h-[32rem] object-cover rounded-t-3xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent"></div>
                    </div>
                    <div className="p-8 md:p-12">
                        <header className="mb-10">
                            <div className="flex items-center space-x-3 mb-6">
                                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                                    {blog.category}
                                </span>
                                {blog.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                                {blog.title}
                            </h1>

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div 
                                    className="flex items-center space-x-4 mb-6 md:mb-0 relative"
                                    onMouseEnter={() => setShowAuthorTooltip(true)}
                                    onMouseLeave={() => setShowAuthorTooltip(false)}
                                >
                                    <div className="relative cursor-pointer">
                                        {blog.userImage?.startsWith("http") ? (
                                            <img
                                                src={blog.userImage}
                                                alt={blog.userName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                                                {blog.userImage || blog.author?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        {/* --- Author Tooltip / Hover Info (UPDATED for Badge) --- */}
                                        {showAuthorTooltip && (
                                            <div className="absolute left-1/2 -top-1 transform -translate-x-1/2 -translate-y-full mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-2xl z-20 border border-gray-200 dark:border-gray-600 transition-opacity duration-300 opacity-100 p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="relative flex-shrink-0">
                                                        {authorDetails?.photoURL?.startsWith("http") ? (
                                                            <img
                                                                src={authorDetails.photoURL}
                                                                alt={authorDetails.displayName}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
                                                                {authorDetails?.displayName?.charAt(0).toUpperCase() || 'A'}
                                                            </div>
                                                        )}
                                                        {/* Badge on Tooltip Image */}
                                                        {authorDetails?.authorBadge && (
                                                            <span className={`absolute bottom-0 right-0 p-1 rounded-full ${authorDetails.authorBadge === 'Top Contributor' ? 'bg-yellow-500' : 'bg-green-500'} border-2 border-white dark:border-gray-700`}>
                                                                <Star className="h-3 w-3 text-white fill-current" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white text-lg">{authorDetails?.displayName || blog.author}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{authorDetails?.authorBadge || 'Community Member'}</p>
                                                    </div>
                                                </div>
                                                <hr className="my-3 border-gray-100 dark:border-gray-600" />
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                                    {isAuthorDetailsLoading ? 'Loading details...' : authorDetails?.bio || "No author bio provided."}
                                                </p>
                                                {authorDetails?.blogCount !== undefined && (
                                                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                        {authorDetails.blogCount} published article{authorDetails.blogCount !== 1 ? 's' : ''}
                                                    </p>
                                                )}
                                                <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white dark:border-t-gray-700"></div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <div className="flex items-center space-x-2 text-gray-900 dark:text-white mb-1">
                                            <span className="font-semibold text-lg">{blog.author}</span>
                                            
                                            {/* --- FEATURE: Author Badge (Main Display) --- */}
                                            {authorDetails?.authorBadge === "Top Contributor" && (
                                                <span className="flex items-center space-x-1 px-3 py-1 text-xs font-bold text-yellow-800 bg-yellow-200 rounded-full dark:bg-yellow-900 dark:text-yellow-300 shadow-md">
                                                    <Star className="h-3 w-3 fill-current" />
                                                    <span>Top Author</span>
                                                </span>
                                            )}
                                            {authorDetails?.authorBadge === "New Author" && (
                                                <span className="px-3 py-1 text-xs font-bold text-green-800 bg-green-200 rounded-full dark:bg-green-900 dark:text-green-300">
                                                    New Author
                                                </span>
                                            )}
                                            {/* --- END Author Badge --- */}
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{format(new Date(blog.date), "MMM dd, yyyy")}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-4 w-4" />
                                                {/* --- DYNAMIC Reading Time Display (from backend) --- */}
                                                <span className="font-semibold">{readTime} min read</span> 
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 flex-wrap flex-col md:flex-row">
                                    {/* --- Blog Likes Feature (Optimistic UI) --- */}
                                    <button
                                        onClick={handleLikeToggle}
                                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg ${isLiked ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white' } transform hover:-translate-y-0.5`}
                                        disabled={likeBlogMutation.isLoading}
                                    >
                                        <ThumbsUp className={`h-4 w-4 ${likeBlogMutation.isLoading ? 'animate-pulse' : ''}`} fill={isLiked ? 'white' : 'none'} />
                                        <span>{likeBlogMutation.isLoading && isLiked ? 'Unliking' : likeBlogMutation.isLoading && !isLiked ? 'Liking' : isLiked ? 'Liked' : 'Like'}</span>
                                        <span className="font-bold ml-1">{likeCount}</span>
                                    </button>

                                    {isAuthor && (
                                        <button
                                            onClick={() => navigate(`/edit-blogs/${id}`)}
                                            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        >
                                            <SquarePen className="h-4 w-4" />
                                            <span>Update Article</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={handleShare}
                                        className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        <Share2 className="h-4 w-4" />
                                        <span>Share Article</span>
                                    </button>
                                </div>
                            </div>
                        </header>

                        <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-6 mb-10 rounded-r-xl max-w-none">
                            <p className="text-lg text-gray-700 dark:text-gray-200 italic leading-relaxed break-words whitespace-pre-wrap">{blog.shortDescription}</p>
                        </div>

                        <div className="prose prose-lg max-w-none border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                            <div className="text-gray-800 dark:text-gray-300 leading-relaxed break-words whitespace-pre-wrap text-lg">
                                {blog.content}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 md:mt-12">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-12">
                        <div className="flex items-center space-x-2 space-y-2 mb-6">
                            <div className="p-3 bg-blue-500 rounded-xl flex-shrink-0">
                                <MessageCircle className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Discussion ({comments.length})
                            </h2>
                        </div>

                        {/* Comment Form (No Change) */}
                        <div className="mb-8 md:mb-10">
                            <div className="rounded-2xl md:p-6 border border-gray-100 dark:border-gray-700">
                                {isAuthor ? (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 md:p-6">
                                        <div className="bg-slate-200 p-3 rounded-full flex-shrink-0">
                                            <MessageCircle className="h-6 w-6 text-slate-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">
                                                Comment Not Allowed
                                            </h3>
                                            <p className="text-sm text-slate-700 dark:text-gray-300 max-w-md">
                                                You can't comment on your own blog post. Let the community join the discussion!
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                                        {user?.photoURL ? (
                                            <img
                                                src={user.photoURL}
                                                alt={user.displayName}
                                                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                                                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <form onSubmit={handleCommentSubmit} className="flex-1 min-w-0">
                                            <textarea
                                                rows={4}
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                maxLength={500}
                                                placeholder="Share your thoughts about this article..."
                                                className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                            />
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 space-y-2 sm:space-y-0">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {commentText.length}/500 characters
                                                </p>
                                                <button
                                                    type="submit"
                                                    className={`px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg ${isCommentPosting || !commentText.trim() ? 'cursor-not-allowed opacity-50 pointer-events-none' : 'hover:shadow-xl transform hover:-translate-y-0.5'}`}
                                                    disabled={isCommentPosting || !commentText.trim()}
                                                >
                                                    {isCommentPosting ? 'Posting Comment' : 'Post Comment'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comments List (No Change) */}
                        {isCommentsLoading && !isCommentsFetching ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 dark:text-gray-300">Loading comments...</p>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-16 px-4">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="h-8 w-8 text-gray-400 dark:text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No comments yet</h3>
                                <p className="text-gray-600 dark:text-gray-300 max-w-sm mx-auto">Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            <div className="mt-10 space-y-4">
                                {comments.map((comment) => {
                                    const isCommentAuthor = user?.email === comment.userEmail;

                                    return (
                                        <div
                                            key={comment._id}
                                            className={`group rounded-2xl md:p-6 transition-all duration-200 border border-transparent border-t relative ${
                                                isCommentDeleting && deleteCommentMutation.variables === comment._id 
                                                    ? 'opacity-50 pointer-events-none'
                                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-100 dark:hover:border-gray-600'
                                            }`}
                                        >
                                            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                                                <div className="relative flex-shrink-0">
                                                    {comment.userImage?.startsWith("http") ? (
                                                        <img
                                                            src={comment.userImage}
                                                            alt={comment.userName}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                                                            {comment.userImage || comment.userName?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                                {comment.userName}
                                                                {comment.userEmail === blog.email && (
                                                                    <span className="ml-2 px-2 py-0.5 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                                                        Author
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {format(new Date(comment.createdAt), 'MMM dd, yyyy h:mm a')}
                                                            </p>
                                                        </div>
                                                        {isCommentAuthor && (
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => setActiveMenuId(activeMenuId === comment._id ? null : comment._id)}
                                                                    className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                                >
                                                                    <EllipsisVertical className="h-5 w-5" />
                                                                </button>
                                                                {activeMenuId === comment._id && (
                                                                    <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-700 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-600">
                                                                        <button
                                                                            onClick={() => handleDeleteComment(comment._id)}
                                                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="mt-2 text-gray-800 dark:text-gray-300 leading-relaxed break-words whitespace-pre-wrap">{comment.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogDetails;