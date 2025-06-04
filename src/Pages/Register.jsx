import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth } from '../Firebase/Firebase.init';
import { toast } from 'sonner';

const RegisterForm = ({ onLogin, isLoading = false }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasMinLength = password.length >= 6;

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const sendUserToBackend = (user) => {
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            lastSignInTime: user.metadata?.lastSignInTime || '',
        };

        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (!response.ok) {
                    console.error('Failed to save user data to backend');
                }
            })
            .catch((error) => {
                console.error('Error sending user data to backend:', error);
            });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (!hasUppercase || !hasLowercase || !hasMinLength) {
            newErrors.password = 'Password does not meet requirements';
        }

        if (profilePhoto && !/^https?:\/\//.test(profilePhoto)) {
            newErrors.profilePhoto = 'Please enter a valid URL starting with http:// or https://';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                updateProfile(user, {
                    displayName: fullName,
                    photoURL: profilePhoto || null,
                })
                    .then(() => {
                        sendUserToBackend(user);

                        setTimeout(() => {
                            setLoading(false);
                            toast.success('Account created successfully!');
                            navigate(from, { replace: true });
                        }, 500);
                    })
                    .catch((error) => {
                        alert(error.message);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                alert(error.message);
                setLoading(false);
            });
    };

    const handleGoogleLogin = () => {
        setGoogleLoading(true);
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                sendUserToBackend(user);

                localStorage.setItem('Photo URL:', user.photoURL);
                toast.success('Google login successful!');

                setTimeout(() => {
                    setGoogleLoading(false);
                    navigate(from, { replace: true });
                }, 500);
            })
            .catch((error) => {
                console.error('Google sign-in error:', error);
                toast.error('Google sign-in failed');
                setGoogleLoading(false);
            });
    };

    return (
        <div className='px-3'>
            <div className="w-full max-w-md my-12 mx-auto p-6 bg-white rounded-xl shadow-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600">Register with FrostPay to start managing your bills</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-800 font-medium mb-1">Full Name</label>
                        <input
                            type='text'
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                            required
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-800 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                            required
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-800 font-medium mb-1">Profile Photo URL (optional)</label>
                        <input
                            type='url'
                            value={profilePhoto}
                            onChange={(e) => setProfilePhoto(e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                        />
                        {errors.profilePhoto && <p className="text-red-500 text-sm mt-1">{errors.profilePhoto}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-800 font-medium mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                                    } focus:ring-2 focus:ring-opacity-50 outline-none transition duration-200 pr-12`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

                        <div className="mt-3 space-y-2">
                            <p className="text-sm text-gray-600 font-medium">Password requirements:</p>
                            <div className="flex items-center">
                                <span className={`mr-2 ${hasUppercase ? 'text-green-500' : 'text-gray-400'}`}>
                                    {hasUppercase ? <Check size={16} /> : <X size={16} />}
                                </span>
                                <span className="text-sm text-gray-600">At least one uppercase letter</span>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 ${hasLowercase ? 'text-green-500' : 'text-gray-400'}`}>
                                    {hasLowercase ? <Check size={16} /> : <X size={16} />}
                                </span>
                                <span className="text-sm text-gray-600">At least one lowercase letter</span>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 ${hasMinLength ? 'text-green-500' : 'text-gray-400'}`}>
                                    {hasMinLength ? <Check size={16} /> : <X size={16} />}
                                </span>
                                <span className="text-sm text-gray-600">At least 6 characters</span>
                            </div>
                        </div>
                    </div>

                    {errors.firebase && (
                        <p className="text-red-500 text-sm mb-4">{errors.firebase}</p>
                    )}

                    <button type="submit" className="w-full py-3 bg-[#3A63D8] text-white font-semibold rounded-lg hover:bg-[#2A48B5] transition disabled:opacity-60" disabled={loading || isLoading}>
                        {loading || isLoading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                <div className="my-6 relative flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-600">Or continue with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition disabled:opacity-60"
                    disabled={googleLoading}
                >
                    {googleLoading ? (
                        <span>Signing in...</span>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Google</span>
                        </>
                    )}
                </button>

                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            onClick={onLogin}
                            className="text-[#3A63D8] hover:text-indigo-800 font-medium transition"
                        >
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
