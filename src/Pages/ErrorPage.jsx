import React, { useEffect } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Link } from 'react-router';
import Lottie from 'lottie-react';
import Icon404 from '../assets/404.json';

const ErrorPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col justify-between w-full bg-white dark:bg-gray-900 transition-colors duration-300">
            <Header />
            <div className="py-16">
                <div className="flex flex-col items-center justify-center text-center px-4">
                    <Lottie animationData={Icon404} />
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6">
                        Oops! The page you're looking for seems to have wandered off.
                    </p>
                    <Link to="/">
                        <button className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium px-6 py-2 rounded-md transition-colors cursor-pointer">
                            Return to Home
                        </button>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ErrorPage;
