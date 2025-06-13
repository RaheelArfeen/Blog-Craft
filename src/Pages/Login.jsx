import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import {
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';
import { auth } from '../Firebase/Firebase.init';
import { toast } from 'sonner';
import axios from 'axios';

const Login = ({ onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const sendUserToBackend = (user) => {
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            lastSignInTime: user.metadata?.lastSignInTime || '',
        };

        axios.post('http://localhost:3000/users', userData)
            .then(() => {})
            .catch(() => {});
    };

    const handleGoogleLogin = () => {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                sendUserToBackend(user);

                toast.success('Successfully logged in with Google');
                navigate(from, { replace: true });
            })
            .catch((error) => {
                console.error('Google sign-in error:', error);
                toast.error('Google sign-in failed. Please try again.');
            });
    };
    const handleResetPassword = async () => {
        if (!email) {
            setErrors({ email: 'Please enter your email to reset password' });
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset email sent. Check your inbox.');
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                setErrors({ email: 'No user found with this email' });
            } else {
                toast.error('Failed to send reset email. Please try again.');
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setErrors({});
        setLoading(true);

        signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const user = result.user;
                sendUserToBackend(user);

                const signInInfo = {
                    email,
                    lastSignInTime: user.metadata?.lastSignInTime,
                };
                fetch('http://localhost:3000', {
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify(signInInfo)
                })
                    .then(res => res.json())
                    .then(data => console.log('after update patch', data))

                setTimeout(() => {
                    navigate(from, { replace: true });
                    toast.success('Successfully logged in.');
                    setLoading(false);
                }, 300);
            })
            .catch((error) => {
                setLoading(false);
                if (error.code === 'auth/user-not-found') {
                    const message = 'No user found with this email';
                    setErrors({ email: message });
                    toast.error(message);
                } else if (error.code === 'auth/wrong-password') {
                    const message = 'Incorrect password';
                    setErrors({ password: message });
                    toast.error(message);
                } else {
                    const message = 'Failed to sign in. Please try again.';
                    setErrors({ general: message });
                    toast.error(message);
                }
            });
    };

    return (
        <div className='px-3'>
            <div className="w-full max-w-md mx-auto my-12 p-6 bg-white rounded-xl shadow-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your FrostPay account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-gray-800 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            required
                            className={`w-full px-4 py-3 rounded-lg border ${errors.email
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                                } focus:ring-2 focus:ring-opacity-50 outline-none transition duration-200`}
                            disabled={loading}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-gray-800 font-medium">Password</label>
                            <button
                                type="button"
                                onClick={() => handleResetPassword()}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition"
                                disabled={loading}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className={`w-full px-4 py-3 rounded-lg border ${errors.password
                                    ? 'border-red-500 focus:ring-red-200'
                                    : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
                                    } focus:ring-2 focus:ring-opacity-50 outline-none transition duration-200 pr-12`}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} className="transition duration-200" />
                                ) : (
                                    <Eye size={20} className="transition duration-200" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#3A63D8] text-white py-3 rounded-lg font-medium hover:bg-[#2A48B5] transition duration-200 my-4 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                {/* General Error */}
                {errors.general && (
                    <p className="text-red-500 text-sm text-center mt-4">{errors.general}</p>
                )}

                {/* Or Divider */}
                <div className="my-6 relative flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-600">Or continue with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Google Button */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
                    disabled={loading}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Google
                </button>

                {/* Register Link */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">
                        Don&apos;t have an account?
                        <Link
                            to="/register"
                            onClick={onRegister}
                            className="text-[#3A63D8] hover:text-[#2A48B5] hover:underline font-medium transition"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
