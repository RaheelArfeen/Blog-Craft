import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router';
import { Calendar, Clock, User, Share2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const BlogDetails = () => {
    const { id } = useParams();

    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            setError(null);
            try {
                const blogRes = await fetch(`http://localhost:3000/blogs/${id}`);
                if (!blogRes.ok) throw new Error('Blog not found');
                const blogData = await blogRes.json();
                setBlog(blogData);

                const allBlogsRes = await fetch(`http://localhost:3000/blogs`);
                if (!allBlogsRes.ok) throw new Error('Failed to fetch blogs');
                const allBlogsData = await allBlogsRes.json();

                const related = allBlogsData
                    .filter(b => b.category === blogData.category && b._id !== blogData._id)
                    .slice(0, 2);
                setRelatedBlogs(related);
            } catch (err) {
                setError(err.message || 'Failed to load blog');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAllData();
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
                    title: 'Link Copied!',
                    description: 'Blog link has been copied to your clipboard.',
                });
            }
        } catch (error) {
            toast({
                title: 'Share Failed',
                description: 'Unable to share this blog post.',
                variant: 'destructive',
            });
            console.log(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600 text-lg">Loading blog...</p>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="md:container mx-auto px-4 py-16 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
                    <p className="text-gray-600 mb-4">
                        {error || "The blog post you're looking for doesn't exist."}
                    </p>
                    <p className="text-sm text-gray-500 mb-8">ID: {id}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center mb-6 text-blue-600 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <article className="md:container mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center mb-6 text-blue-600 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                </button>

                {blog.image && (
                    <div className="mb-8">
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                )}

                <header className="mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {blog.category}
                        </span>
                        {blog.tags?.map((tag) => (
                            <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{blog.title}</h1>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                <img src={blog.userImage} alt="" />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">{blog.author}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{format(new Date(blog.date), 'MMM dd, yyyy')}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{blog.readTime}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={handleShare}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <Share2 className="h-4 w-4" />
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                    <p className="text-lg text-gray-700 italic">{blog.shortDescription}</p>
                </div>

                <div className="prose prose-lg">
                    <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{blog.content}</div>
                </div>

                {relatedBlogs.length > 0 && (
                    <section className="mt-16 pt-8 border-t border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {relatedBlogs.map((relatedBlog) => (
                                <Link key={relatedBlog._id} to={`/blog/${relatedBlog._id}`} className="group">
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                        {relatedBlog.image && (
                                            <img
                                                src={relatedBlog.image}
                                                alt={relatedBlog.title}
                                                className="w-full h-32 object-cover"
                                            />
                                        )}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {relatedBlog.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-2">
                                                {relatedBlog.category} • {relatedBlog.readTime}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </div>
    );
};

export default BlogDetails;