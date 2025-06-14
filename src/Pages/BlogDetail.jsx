import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Calendar, Clock, User, Share2, ArrowLeft, MessageCircle, Heart, Reply, Ban, SquarePen, EllipsisVertical } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { AuthContext } from "../Provider/AuthProvider";
import Swal from "sweetalert2";

const BlogDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingComments, setLoadingComments] = useState(false);
    const [error, setError] = useState(null);
    const [commentLoading, setCommentLoading] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                const blogRes = await fetch(`https://blog-craft-server.vercel.app/blogs/${id}`);
                if (!blogRes.ok) throw new Error("Blog not found");
                const blogData = await blogRes.json();
                setBlog(blogData);

                const allBlogsRes = await fetch(`https://blog-craft-server.vercel.app/blogs`);
                if (!allBlogsRes.ok) throw new Error("Failed to fetch blogs");

            } catch (err) {
                setError(err.message || "Failed to load blog");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAllData();
    }, [id]);

    const fetchComments = async () => {
        if (!id) return;
        setLoadingComments(true);
        try {
            const res = await fetch(`https://blog-craft-server.vercel.app/comments/${id}`);
            if (!res.ok) throw new Error("Failed to fetch comments");
            const data = await res.json();
            setComments(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load comments");
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [id]);

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
                toast({
                    title: "Link Copied!",
                    description: "Blog link has been copied to your clipboard.",
                });
            }
        } catch (error) {
            toast("Unable to share this blog post.");
            console.log(error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setCommentLoading(true)
        if (!commentText.trim()) return toast.error("Comment cannot be empty");

        const userName = user?.displayName || "Anonymous";
        const userInitial = user?.displayName?.charAt(0).toUpperCase() || "A";
        const userImage = user?.photoURL || userInitial;

        try {
            const res = await fetch(`https://blog-craft-server.vercel.app/comments/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: commentText.trim(), userName, userImage }),
            });

            if (!res.ok) throw new Error("Failed to post comment");

            await fetchComments();
            setCommentText("");
            setCommentLoading(false)
            toast.success("Comment posted!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to post comment");
            setCommentLoading(false)
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!commentId) return;

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
            try {
                const res = await fetch(`https://blog-craft-server.vercel.app/comments/${commentId}`, {
                    method: "DELETE",
                });

                if (!res.ok) throw new Error("Failed to delete comment");

                setComments((prevComments) => prevComments.filter(comment => comment._id !== commentId));
                setActiveMenuId(null);

                Swal.fire({
                    title: "Deleted!",
                    text: "Your comment has been deleted.",
                    icon: "success"
                });

            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to delete comment.",
                    icon: "error"
                });
            }
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center py-80">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg font-medium">Loading article...</p>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="py-40">
                <div className="container mx-auto px-4 py-16 text-center">
                    <div className="bg-white rounded-2xl shadow-xl p-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
                        <p className="text-gray-600 mb-6 text-lg">
                            {error || "The article you're looking for doesn't exist."}
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

    return (
        <div className="min-h-screen">
            <article className="container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center mb-8 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-xl transition-all duration-200 group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to articles</span>
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="relative">
                        <img
                            src={blog.image || blog.imageUrl || 'https://www.pngkey.com/png/detail/233-2332677_image-500580-placeholder-transparent.png'}
                            alt={blog.title}
                            className="w-full h-[16rem] md:h-[32rem] object-cover"
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
                                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                                {blog.title}
                            </h1>

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center space-x-4 mb-6 md:mb-0">
                                    <div className="relative">
                                        {blog.userImage?.startsWith("http") ? (
                                            <img
                                                src={blog.userImage}
                                                alt={blog.userName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                                                {blog.userImage}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2 text-gray-800 mb-1">
                                            <span className="font-semibold text-lg">{blog.author}</span>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{format(new Date(blog.date), "MMM dd, yyyy")}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{blog.readTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 flex-wrap flex-col md:flex-row">
                                    {user?.email === blog?.email ? (
                                        <button
                                            onClick={() => navigate(`/edit-blogs/${id}`)}
                                            className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        >
                                            <SquarePen className="h-4 w-4" />
                                            <span>Update Article</span>
                                        </button>
                                    ) : ('')}

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

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-10 rounded-r-xl max-w-none">
                            <p className="text-lg text-gray-700 italic leading-relaxed break-words whitespace-pre-wrap">{blog.shortDescription}</p>
                        </div>

                        <div className="prose prose-lg max-w-none border border-gray-100 rounded-xl p-4">
                            <div className="text-gray-800 leading-relaxed break-words whitespace-pre-wrap text-lg">
                                {blog.content}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 md:mt-12">
                    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-12">
                        <div className="flex items-center space-x-2 space-y-2 mb-6">
                            <div className="p-3 bg-blue-500 rounded-xl flex-shrink-0">
                                <MessageCircle className="h-6 w-6 text-white" />
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Discussion ({comments.length})
                            </h2>
                        </div>

                        {/* Comment Form */}
                        <div className="mb-8 md:mb-10">
                            <div className="rounded-2xl  md:p-6 border border-gray-100">
                                {user?.email === blog?.email ? (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 md:p-6">
                                        <div className="bg-slate-200 p-3 rounded-full flex-shrink-0">
                                            <MessageCircle className="h-6 w-6 text-slate-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                                Comment Not Allowed
                                            </h3>
                                            <p className="text-sm text-slate-700 max-w-md">
                                                You can't comment on your own blog post. Let the community join the discussion!
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                                        {user?.photoURL && (
                                            <img
                                                src={user.photoURL}
                                                alt={user.displayName}
                                                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md flex-shrink-0"
                                            />
                                        )}
                                        <form onSubmit={handleCommentSubmit} className="flex-1 min-w-0">
                                            <textarea
                                                rows={4}
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                maxLength={500}
                                                placeholder="Share your thoughts about this article..."
                                                className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
                                            />
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 space-y-2 sm:space-y-0">
                                                <p className="text-sm text-gray-500">
                                                    {commentText.length}/500 characters
                                                </p>
                                                <button
                                                    type="submit"
                                                    className={`px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg${commentLoading || !commentText.trim() ? 'cursor-not-allowed opacity-50 pointer-events-none' : 'hover:shadow-xl transform hover:-translate-y-0.5'}`}
                                                    disabled={commentLoading || !commentText.trim()}
                                                >
                                                    {commentLoading ? 'Posting Comment' : 'Post Comment'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comments List */}
                        {loadingComments ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading comments...</p>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-16 px-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageCircle className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No comments yet</h3>
                                <p className="text-gray-600 max-w-sm mx-auto">Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            <div className="mt-10 space-y-4">
                                {comments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className="group hover:bg-gray-50 rounded-2xl md:p-6 transition-all duration-200 border border-transparent hover:border-gray-100 border-t relative"
                                    >
                                        <div className="flex space-x-4 border-b border-gray-200 pb-4">
                                            <div className="relative flex-shrink-0">
                                                {comment.userImage?.startsWith("http") ? (
                                                    <img
                                                        src={comment.userImage}
                                                        alt={comment.userName}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold">
                                                        {comment.userImage}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex flex-col">
                                                        <h4 className="font-semibold text-gray-900">{comment.userName}</h4>
                                                        <time className="text-sm text-gray-500">
                                                            {comment.createdAt
                                                                ? format(new Date(comment.createdAt), "MMM dd, yyyy 'at' HH:mm")
                                                                : "Just now"}
                                                        </time>
                                                    </div>

                                                    {user?.email !== blog?.email && (
                                                        <div className="relative">
                                                            <button
                                                                onClick={() =>
                                                                    setActiveMenuId((prev) =>
                                                                        prev === comment._id ? null : comment._id
                                                                    )
                                                                }
                                                                className="p-2 hover:bg-gray-200 rounded-full transition"
                                                            >
                                                                <EllipsisVertical className="h-5 w-5 text-gray-500" />
                                                            </button>

                                                            {activeMenuId === comment._id && (
                                                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg overflow-hidden shadow-lg z-10">
                                                                    <button
                                                                        onClick={() => handleDeleteComment(comment._id)}
                                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <p className="text-gray-700 whitespace-pre-wrap break-words">
                                                    {comment.text}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogDetails;