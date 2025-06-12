import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  Save, Upload, X, Plus, Eye, Edit2,
  Clock, Calendar, User, ChevronDown, ChevronUp
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { AuthContext } from '../Provider/AuthProvider';
import { v4 as uuidv4 } from 'uuid'; // 👈 Added

function AddBlogs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    shortDescription: '',
    content: '',
    email: user.email,
    image: null
  });

  const categories = ['Technology', 'Design', 'Backend', 'AI', 'CSS', 'Marketing', 'Lifestyle', 'Business', 'Development', 'UI/UX', 'Career', 'Tutorial'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    const currentTags = formData.tags
      ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      : [];

    if (!currentTags.includes(tagInput.trim())) {
      const newTags = [...currentTags, tagInput.trim()].join(', ');
      setFormData(prev => ({ ...prev, tags: newTags }));
    }

    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    const newTags = currentTags.filter(tag => tag !== tagToRemove).join(', ');
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.title.trim()) errors.push('Title is required.');
    if (!formData.category) errors.push('Please select a category.');
    if (!formData.shortDescription.trim()) errors.push('Short description is required.');
    if (!formData.content.trim()) errors.push('Content is required.');

    if (errors.length > 0) {
      toast.error(errors.join('\n'));
      return false;
    }

    return true;
  };

  const fileToBase = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      let imageBase64 = '';
      if (formData.image) {
        imageBase64 = await fileToBase(formData.image);
      }

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

      const readTime = `${Math.floor(Math.random() * 30) + 1} min read`;

      const userName = user?.displayName || "Anonymous";
      const userInitial = user?.displayName?.charAt(0).toUpperCase() || "A";
      const userImage = user?.photoURL || userInitial;

      const blogData = {
        ...formData,
        tags: tagsArray,
        image: imageBase64,
        author: userName,
        userImage: userImage,
        date: new Date().toISOString(),
        readTime,
        blogId: uuidv4()
      };

      await axios.post('http://localhost:3000/blogs', blogData);

      toast.success('Blog published successfully!');
      setFormData({
        title: '',
        category: '',
        tags: '',
        shortDescription: '',
        content: '',
        email: user.email,
        userImage: user.photoURL,
        image: null
      });
    } catch (error) {
      console.error('Error submitting blog:', error);
      toast.error('Failed to publish blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTags = () => {
    if (!formData.tags) return null;

    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <div key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm group">
            <span>{tag}</span>
            <button type="button" onClick={() => handleRemoveTag(tag)} className="opacity-70 hover:opacity-100 transition-opacity">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const togglePreview = () => {
    setPreview(prev => !prev);
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="An engaging title for your blog post"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2" ref={categoryRef}>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <div className="relative border border-gray-300 rounded-lg">
          <button
            type="button"
            onClick={() => setCategoryOpen(prev => !prev)}
            className="w-full flex justify-between items-center px-4 py-3 text-left"
          >
            <span>{formData.category || 'Select a category'}</span>
            {categoryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {categoryOpen && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg">
              {categories.map(cat => (
                <li
                  key={cat}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category: cat }));
                    setCategoryOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="flex items-center">
          <input
            type="text"
            id="tagInput"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Add a tag and press Enter"
            className="flex-1 border border-gray-300 rounded-l-lg p-3 outline-none focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-blue-500 text-white p-3.5 rounded-r-lg hover:bg-blue-600 border border-blue-500"
          >
            <Plus size={20} />
          </button>
        </div>
        {renderTags()}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Featured Image</label>
        {formData.image ? (
          <div className="relative">
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
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

      <div className="space-y-2">
        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">Short Description</label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleInputChange}
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          rows={12}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Publishing...</span>
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            <span>Publish Blog Post</span>
          </>
        )}
      </button>
    </form>
  );

  const renderPreview = () => {
    const readTime = `${Math.floor(Math.random() * 30) + 1} min read`;
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
      <article className="space-y-6">
        <h1 className="text-4xl font-bold">{formData.title || 'Your Blog Title Will Appear Here'}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {formData.category && (
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">{formData.category}</span>
          )}
          <div className="flex items-center gap-1"><User size={16} /><span>Current User</span></div>
          <div className="flex items-center gap-1"><Calendar size={16} /><span>{formattedDate}</span></div>
          <div className="flex items-center gap-1"><Clock size={16} /><span>{readTime}</span></div>
        </div>
        {formData.image && (
          <img src={URL.createObjectURL(formData.image)} alt={formData.title} className="w-full h-96 object-cover" />
        )}
        <div className="text-xl text-gray-700 italic border-l-4 border-blue-500 pl-4">{formData.shortDescription || 'Your short description...'}</div>
        <div className="prose prose-lg whitespace-pre-wrap">{formData.content || 'Your content goes here.'}</div>
        {renderTags()}
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="md:container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex justify-between flex-wrap items-center p-6 border-b border-gray-100 gap-y-2">
            <h1 className="text-3xl font-bold text-blue-500">
              {preview ? 'Preview Your Post' : 'Create New Blog Post'}
            </h1>
            <button
              onClick={togglePreview}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer transition"
            >
              {preview ? <><Edit2 className="h-4 w-4" /><span>Edit Post</span></> : <><Eye className="h-4 w-4" /><span>Preview Post</span></>}
            </button>
          </div>
          <div className="p-6">{preview ? renderPreview() : renderForm()}</div>
        </div>
      </div>
    </div>
  );
}

export default AddBlogs;
