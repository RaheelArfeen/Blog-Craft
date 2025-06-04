import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../Provider/AuthProvider';
import { User, Image as ImageIcon, ArrowLeft } from 'lucide-react';

const UpdateProfile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const [name, setName] = useState(user?.displayName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
    const [preview, setPreview] = useState(user?.photoURL || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        updateUser({ displayName: name, photoURL: preview })
            .then(() => navigate('/profile'))
            .catch(error => console.error('Failed to update profile:', error))
            .finally(() => setIsSubmitting(false));
    };

    const handleURLChange = (e) => {
        const url = e.target.value;
        setPhotoURL(url);
        setPreview(url);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="md:container mx-auto px-4 py-12">
            {/* Back Button */}
            <div className="mb-6">
                <Link to="/profile">
                    <div className="flex items-center gap-1 text-[#3A63D8] hover:text-[#2A48B5] transition font-medium">
                        <ArrowLeft size={16} />
                        Back to Profile
                    </div>
                </Link>
            </div>

            {/* Card */}
            <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-[#3A63D8] mb-6">Update Profile Information</h2>

                {/* Avatar Preview */}
                {/* Avatar Preview with Name */}
                <div className="flex flex-col items-center mb-6">
                    <div className="h-28 w-28 rounded-full overflow-hidden border-4 border-[#3A63D8] bg-gray-100 text-[#3A63D8] flex items-center justify-center text-3xl font-bold">
                        {preview ? (
                            <img
                                src={preview}
                                alt={name || "User"}
                                className="h-full w-full object-cover"
                                onError={(e) => (e.target.style.display = 'none')}
                            />
                        ) : (
                            name ? name.charAt(0).toUpperCase() : "U"
                        )}
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-gray-800">{name || "Unnamed User"}</p>
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <User size={16} />
                            </span>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 shadow-sm focus:ring-[#3A63D8] focus:border-[#3A63D8] outline-none"
                            />
                        </div>
                    </div>

                    {/* Photo URL */}
                    <div>
                        <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700 mb-1">
                            Profile Photo URL
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <ImageIcon size={16} />
                            </span>
                            <input
                                id="photoURL"
                                type="url"
                                value={photoURL}
                                onChange={handleURLChange}
                                placeholder="https://example.com/photo.jpg"
                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-800 shadow-sm focus:ring-[#3A63D8] focus:border-[#3A63D8] outline-none"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Enter a valid image URL</p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#3A63D8] text-white py-2 rounded-md hover:bg-[#2A48B5] transition disabled:opacity-50"
                        >
                            {isSubmitting ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
