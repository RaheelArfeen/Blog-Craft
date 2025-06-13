import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { X, Plus, ChevronDown, ChevronUp, Upload, Save } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const categories = [
    "Technology", "Design", "Backend", "AI", "CSS",
    "Marketing", "Lifestyle", "Business", "Development",
    "UI/UX", "Career", "Tutorial"
];

export default function EditBlog() {
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

    const [imageMode, setImageMode] = useState("upload");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        async function fetchBlog() {
            try {
                const res = await fetch(`http://localhost:3000/blogs/${id}`);
                if (!res.ok) throw new Error("Failed to fetch blog");
                const blog = await res.json();

                setTitle(blog.title || "");
                setCategory(blog.category || "");
                setTags(blog.tags || []);
                setShortDescription(blog.shortDescription || "");
                setContent(blog.content || "");

                if (blog.image?.startsWith("data:image")) {
                    setImageFile(null);
                    setImageMode("upload");
                    setImagePreview(blog.image);
                } else {
                    setImageUrl(blog.image || "");
                    setImageMode("url");
                    setImagePreview(blog.image || "");
                }
            } catch (err) {
                toast.error(err.message);
            }
        }

        fetchBlog();
    }, [id]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (categoryRef.current && !categoryRef.current.contains(e.target)) {
                setCategoryOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (imageFile) {
            const objectUrl = URL.createObjectURL(imageFile);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [imageFile]);

    const handleTagKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags((prev) => [...prev, trimmed]);
        }
        setTagInput("");
    };

    const removeTag = (tag) => setTags((prev) => prev.filter((t) => t !== tag));

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImageUrl("");
            setImageMode("upload");
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleRemoveImageUrl = () => {
        setImageUrl("");
        setImagePreview(null);
    };

    const validate = () => {
        if (!title.trim()) return toast.error("Title is required"), false;
        if (!category) return toast.error("Please select a category"), false;
        if (tags.length === 0) return toast.error("Please add at least one tag"), false;
        if (!shortDescription.trim()) return toast.error("Short description is required"), false;
        if (!content.trim()) return toast.error("Content is required"), false;
        if (imageMode === "url" && !imageUrl.trim()) return toast.error("Image URL is required"), false;
        return true;
    };

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        try {
            let imageData = "";

            if (imageMode === "upload" && imageFile) {
                imageData = await fileToBase64(imageFile);
            } else if (imageMode === "url") {
                imageData = imageUrl.trim();
            }

            const payload = {
                title,
                category,
                tags,
                shortDescription,
                content,
                image: imageData,
            };

            const res = await fetch(`http://localhost:3000/blogs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Update failed");
            }

            toast.success("Blog updated successfully!");
            navigate(`/blogs/${id}`);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 md:container mx-auto">
            <div className="bg-white shadow-md rounded-lg p-8">
                <h2 className="text-3xl font-bold text-blue-600 mb-6">Edit Blog</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-lg"
                        />
                    </div>

                    {/* Category */}
                    <div ref={categoryRef} className="relative">
                        <label className="block font-medium text-gray-700 mb-1">Category</label>
                        <button
                            type="button"
                            onClick={() => setCategoryOpen((p) => !p)}
                            className="w-full flex justify-between items-center border border-gray-300 p-3 rounded-lg"
                        >
                            <span>{category || "Select a category"}</span>
                            {categoryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {categoryOpen && (
                            <ul className="absolute z-10 bg-white border mt-1 w-full shadow-md rounded-lg max-h-48 overflow-auto">
                                {categories.map((cat) => (
                                    <li
                                        key={cat}
                                        onClick={() => {
                                            setCategory(cat);
                                            setCategoryOpen(false);
                                        }}
                                        className="p-2 hover:bg-blue-100 cursor-pointer"
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Tags</label>
                        <div className="flex items-center">
                            <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                className="flex-1 border border-gray-300 p-3 rounded-l-lg"
                                placeholder="Type a tag and press Enter"
                            />
                            <button
                                type="button"
                                onClick={addTag}
                                className="bg-blue-600 text-white p-4 rounded-r-lg"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                    {tag}
                                    <button onClick={() => removeTag(tag)}>
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Image Upload / URL */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Image</label>
                        <div className="flex gap-4 mb-4">
                            <button
                                type="button"
                                onClick={() => setImageMode("upload")}
                                className={`px-4 py-2 rounded-lg border ${imageMode === "upload" ? "bg-blue-600 text-white" : "bg-white border-gray-300"
                                    }`}
                            >
                                Upload
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageMode("url")}
                                className={`px-4 py-2 rounded-lg border ${imageMode === "url" ? "bg-blue-600 text-white" : "bg-white border-gray-300"
                                    }`}
                            >
                                URL
                            </button>
                        </div>

                        <AnimatePresence>
                            {imageMode === "upload" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {!imagePreview ? (
                                        <label className="block border-dashed border-2 border-gray-300 p-6 text-center rounded-lg cursor-pointer">
                                            <Upload className="mx-auto text-gray-400" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                            <p className="mt-2 text-blue-600">Click to upload</p>
                                        </label>
                                    ) : (
                                        <div className="relative mt-4">
                                            <img src={imagePreview} alt="Preview" className="w-full h-80 object-cover rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {imageMode === "url" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <input
                                        type="text"
                                        placeholder="Paste image URL"
                                        value={imageUrl}
                                        onChange={(e) => {
                                            setImageUrl(e.target.value);
                                            setImagePreview(e.target.value);
                                        }}
                                        className="w-full border border-gray-300 p-3 rounded-lg"
                                    />
                                    {imagePreview && (
                                        <div className="relative mt-4">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-80 object-cover rounded-lg"
                                                onError={() => {
                                                    setImagePreview(null);
                                                    toast.error("Invalid image URL.");
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImageUrl}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Short Description</label>
                        <textarea
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            rows={3}
                            className="w-full border border-gray-300 p-3 rounded-lg"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={10}
                            className="w-full border border-gray-300 p-3 rounded-lg"
                        />
                    </div>

                    {/* Submit & Cancel */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                        >
                            <Save size={20} />
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/blogs/${id}`)}
                            className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg flex items-center gap-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
