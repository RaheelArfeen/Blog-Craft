import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
    CalendarDays,
    Mail,
    User,
    PenSquare,
    BookOpen,
    Heart
} from 'lucide-react';
import { AuthContext } from '../Provider/AuthProvider';
import { useNavigate } from 'react-router';
import { getAuth } from 'firebase/auth';
import { format } from 'date-fns';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userMeta, setUserMeta] = useState(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (user) {
                const auth = getAuth();
                auth.currentUser?.reload().then(() => {
                    setUserMeta(auth.currentUser.metadata);
                });
            }
            setLoading(false);
        }, 100);
        return () => clearTimeout(timeout);
    }, [user]);

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    if (!user && !loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-md text-center">
                    <p className="text-gray-700">Please log in to view your profile.</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="md:container mx-auto px-4 py-12">
            {/* Header */}
            <div className="bg-[#3A63D8] text-white p-8 rounded-t-xl flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white text-[#3A63D8] flex items-center justify-center text-3xl font-bold overflow-hidden">
                        {loading ? (
                            <Skeleton circle width={80} height={80} />
                        ) : user.photoURL ? (
                            <img src={user.photoURL} alt="User" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            getInitials(user.displayName)
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">
                            {loading ? <Skeleton width={180} /> : user.displayName || 'No Name'}
                        </h2>
                        <p className="text-blue-100">
                            {loading ? <Skeleton width={120} /> : 'BlogCraft User'}
                        </p>
                    </div>
                </div>
                <div>
                    {loading ? (
                        <Skeleton width={140} height={40} borderRadius={8} />
                    ) : (
                        <button onClick={() => navigate('/edit-profile')} className="mt-6 md:mt-0 bg-white text-[#3A63D8] px-5 py-2 rounded-lg shadow hover:bg-gray-100 transition-all flex items-center gap-2 font-medium">
                            <PenSquare size={18} /> Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-b-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    {/* Personal Info */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">Personal Information</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="text-gray-400 mt-1">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-gray-500">Full Name</p>
                                    <p className="text-gray-900 font-medium">
                                        {loading ? <Skeleton width={180} /> : user.displayName || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="text-gray-400 mt-1">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-gray-500">Email Address</p>
                                    <p className="text-gray-900 font-medium">
                                        {loading ? <Skeleton width={180} /> : user.email || 'N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="text-gray-400 mt-1">
                                    <CalendarDays size={20} />
                                </div>
                                <div>
                                    <p className="text-gray-500">Member Since</p>
                                    <p className="text-gray-900 font-medium">
                                        {loading ? (
                                            <Skeleton width={180} />
                                        ) : userMeta?.creationTime ? (
                                            format(new Date(userMeta.creationTime), 'MMMM cc yyyy')
                                        ) : (
                                            'N/A'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200">Activity Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {loading ? (
                                <>
                                    <Skeleton height={120} />
                                    <Skeleton height={120} />
                                </>
                            ) : (
                                <>
                                    <div className="rounded-xl p-6 text-center hover:shadow-md" style={{ backgroundColor: '#E6ECFD' }}>
                                        <BookOpen className="mx-auto mb-2" size={28} color="#3A63D8" />
                                        <p className="text-4xl font-bold" style={{ color: '#3A63D8' }}>0</p>
                                        <p className="font-medium" style={{ color: '#3A63D8' }}>Blogs Published</p>
                                    </div>
                                    <div className="rounded-xl p-6 text-center hover:shadow-md" style={{ backgroundColor: '#FDE8E8' }}>
                                        <Heart className="mx-auto mb-2" size={28} color="#EF4444" />
                                        <p className="text-4xl font-bold" style={{ color: '#EF4444' }}>0</p>
                                        <p className="font-medium" style={{ color: '#EF4444' }}>Wishlist Items</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="p-6 border-t border-gray-200">
                    <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        {loading ? (
                            <>
                                <Skeleton width={140} height={48} borderRadius={8} />
                                <Skeleton width={140} height={48} borderRadius={8} />
                                <Skeleton width={160} height={48} borderRadius={8} />
                            </>
                        ) : (
                            <>
                                <button onClick={() => navigate('/add-blog')} className="px-5 py-3 bg-[#3A63D8] text-white rounded-lg hover:bg-[#2A48B5] transition-all">
                                    Create New Blog
                                </button>
                                <button onClick={() => navigate('/wishlist')} className="px-5 py-3 border border-gray-500 rounded-lg hover:bg-gray-50 transition-all">
                                    View Wishlist
                                </button>
                                <button onClick={() => navigate('/blogs')} className="px-5 py-3 border border-gray-500 rounded-lg hover:bg-gray-50 transition-all">
                                    Browse All Blogs
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
