import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  Save, Upload, X, Plus, ChevronDown, ChevronUp
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { AuthContext } from '../Provider/AuthProvider';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';

function AddBlogs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [imageMode, setImageMode] = useState('upload');
  const categoryRef = useRef(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    shortDescription: '',
    content: '',
    email: user.email,
    image: null,
    imageUrl: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
      setFormData(prev => ({ ...prev, image: file, imageUrl: '' }));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleRemoveImageUrl = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
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
    if (imageMode === 'upload' && !formData.image) errors.push('Please upload an image.');
    if (imageMode === 'url' && !formData.imageUrl.trim()) errors.push('Please enter an image URL.');
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
      let imageData = '';
      if (imageMode === 'upload' && formData.image) {
        imageData = await fileToBase(formData.image);
      } else if (imageMode === 'url') {
        imageData = formData.imageUrl.trim();
      }
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const readTime = `${Math.floor(Math.random() * 30) + 1} min read`;
      const userName = user?.displayName || "Anonymous";
      const userInitial = user?.displayName?.charAt(0).toUpperCase() || "A";
      const userImage = user?.photoURL || userInitial;
      const blogData = {
        ...formData,
        tags: tagsArray,
        image: imageData,
        author: userName,
        userImage: userImage,
        date: new Date().toISOString(),
        readTime,
        blogId: uuidv4()
      };
      await axios.post('https://blog-craft-server.vercel.app/blogs', blogData);
      toast.success('Blog published successfully!');
      setFormData({
        title: '',
        category: '',
        tags: '',
        shortDescription: '',
        content: '',
        email: user.email,
        image: null,
        imageUrl: ''
      });
      setImageMode('upload');
      navigate('/blogs');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:container mx-auto px-4 py-12">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="An engaging title for your blog post"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
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
        <div className="mb-2 flex gap-4">
          <button
            type="button"
            onClick={() => setImageMode('upload')}
            className={`px-4 py-2 rounded-lg border ${imageMode === 'upload' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300'}`}
          >
            Upload Image
          </button>
          <button
            type="button"
            onClick={() => setImageMode('url')}
            className={`px-4 py-2 rounded-lg border ${imageMode === 'url' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300'}`}
          >
            Image URL
          </button>
        </div>

        <AnimatePresence mode="wait">
          {imageMode === 'upload' && (
            <motion.div
              key="upload-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {formData.image ? (
                <motion.div className="relative mt-2">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
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
            </motion.div>
          )}

          {imageMode === 'url' && (
            <motion.div
              key="url-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="Enter image URL here"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
              />
              {formData.imageUrl && (
                <motion.div className="relative mt-4">
                  <img
                    src={formData.imageUrl}
                    alt="Image URL Preview"
                    className="w-full h-96 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '';
                      toast.error('Image URL is invalid or inaccessible.');
                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImageUrl}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2">
        <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">Short Description</label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          rows={3}
          value={formData.shortDescription}
          onChange={handleInputChange}
          placeholder="Write a short summary of your blog post"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
        <textarea
          id="content"
          name="content"
          rows={10}
          value={formData.content}
          onChange={handleInputChange}
          placeholder="Write the full content of your blog here"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4 justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg px-6 py-3 font-semibold transition"
        >
          <Save size={20} />
          {isSubmitting ? 'Publishing...' : 'Publish Blog'}
        </button>
      </div>
    </form>
  );
}

export default AddBlogs;
