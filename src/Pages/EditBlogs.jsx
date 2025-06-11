import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { X, Plus, ChevronDown, ChevronUp, Upload, Save } from "lucide-react";

const categories = ['Technology', 'Design', 'Backend', 'AI', 'CSS', 'Marketing', 'Lifestyle', 'Business', 'Development', 'UI/UX', 'Career', 'Tutorial'];

function EditBlog() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const categoryRef = useRef(null);

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);

    // Store the object URL for cleanup
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    // Load blog data
    useEffect(() => {
        async function fetchBlog() {
            try {
                const res = await fetch(`https://blog-craft-server.vercel.app/blogs/${id}`);
                if (!res.ok) throw new Error("Failed to fetch blog");
                const blog = await res.json();

                setTitle(blog.title || "");
                setCategory(blog.category || "");
                setTags(blog.tags || []);
                setShortDescription(blog.shortDescription || "");
                setContent(blog.content || "");
                setImage(blog.image || null); // Can be string URL or null
            } catch (err) {
                console.error("Fetch error:", err); // DEBUG
                toast.error(err.message);
            }
        }
        fetchBlog();
    }, [id]);

    // Generate image preview URL for File or use existing string URL
    useEffect(() => {
        if (!image) {
            setImagePreviewUrl(null);
            return;
        }

        if (image instanceof File) {
            // Create a blob URL for file preview
            const objectUrl = URL.createObjectURL(image);
            setImagePreviewUrl(objectUrl);

            return () => {
                // Cleanup memory when image changes or component unmounts
                URL.revokeObjectURL(objectUrl);
            };
        } else if (typeof image === "string") {
            // It's a URL string (from backend)
            setImagePreviewUrl(image);
        } else {
            setImagePreviewUrl(null);
        }
    }, [image]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (categoryRef.current && !categoryRef.current.contains(e.target)) {
                setCategoryOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const addTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags((prev) => [...prev, trimmed]);
        }
        setTagInput("");
    };
    const removeTag = (tag) => {
        setTags((prev) => prev.filter((t) => t !== tag));
    };
    const handleTagKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    };
    const removeImage = () => setImage(null);

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
        });

    const validate = () => {
        if (!title.trim()) return toast.error("Title is required"), false;
        if (!category) return toast.error("Please select a category"), false;
        if (tags.length === 0) return toast.error("Please add at least one tag"), false;
        if (!shortDescription.trim()) return toast.error("Short description is required"), false;
        if (!content.trim()) return toast.error("Content is required"), false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);

        try {
            let imageBase64 = "";
            if (image && image instanceof File) {
                imageBase64 = await fileToBase64(image);
            } else if (typeof image === "string") {
                imageBase64 = image;
            }

            const updatePayload = {
                title,
                category,
                tags,
                shortDescription,
                content,
                image: imageBase64,
            };

            const res = await fetch(`https://blog-craft-server.vercel.app/blogs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatePayload),
            });

            if (!res.ok) {
                // Try to parse error message from backend JSON
                let errMsg = "Update failed";
                try {
                    const errData = await res.json();
                    errMsg = errData.message || errMsg;
                } catch {
                    // ignore JSON parse errors
                }
                throw new Error(errMsg);
            }

            toast.success("Blog updated successfully!");

            // After update, navigate to blog detail page
            // Check if your route /blogs/:id exists and works
            navigate(`/blogs/${id}`);
        } catch (err) {
            console.error("Update error:", err); // DEBUG
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="md:container mx-auto px-4 py-12">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="flex justify-between items-center flex-wrap p-6 border-b border-gray-100 gap-y-2">
                        <h2 className="text-3xl font-bold text-blue-500">Edit Blog</h2>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2 relative" ref={categoryRef}>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <div className="relative border border-gray-300 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setCategoryOpen((o) => !o)}
                                        className="w-full flex justify-between items-center px-4 py-3 text-left"
                                    >
                                        <span>{category || "Select a category"}</span>
                                        {categoryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                    {categoryOpen && (
                                        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg h-fit overflow-auto">
                                            {categories.map((cat) => (
                                                <li
                                                    key={cat}
                                                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                                                    onClick={() => {
                                                        setCategory(cat);
                                                        setCategoryOpen(false);
                                                    }}
                                                >
                                                    {cat}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="space-y-2">
                                <label htmlFor="tagInput" className="block text-sm font-medium text-gray-700">Tags</label>
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        id="tagInput"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        placeholder="Add a tag and press Enter"
                                        className="flex-1 border border-gray-300 rounded-l-lg p-3 outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="bg-blue-500 text-white p-3.5 rounded-r-lg border border-blue-500 hover:bg-blue-600"
                                        aria-label="Add tag"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tags.map((tag) => (
                                        <div key={tag} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm group">
                                            <span>{tag}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="opacity-70 hover:opacity-100 transition-opacity"
                                                aria-label={`Remove tag ${tag}`}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Image */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Featured Image</label>
                                {imagePreviewUrl ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreviewUrl}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="image" className="mt-2 block text-sm font-medium text-blue-600 cursor-pointer">
                                            Click to upload an image
                                        </label>
                                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                )}
                            </div>

                            {/* Short Description */}
                            <div className="space-y-2">
                                <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">Short Description</label>
                                <textarea
                                    id="shortDescription"
                                    name="shortDescription"
                                    value={shortDescription}
                                    onChange={(e) => setShortDescription(e.target.value)}
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Content */}
                            <div className="space-y-2">
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={10}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 disabled:opacity-50`}
                                >
                                    <Save size={20} />
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditBlog;