import React from 'react';
import { ArrowRight, BookOpen, Sparkles, Users, TrendingUp } from 'lucide-react';
import { motion } from "framer-motion";
import { Link } from 'react-router';

const Banner = () => {
    return (
        <section className="relative bg-gradient-to-br from-purple-950 via-indigo-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white dark:text-gray-200 overflow-hidden">
            {/* Constant animated background dots */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                animate={{ backgroundPosition: ["0% 0%", "0% 100%"] }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{
                    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                    backgroundSize: "48px 48px"
                }}
            />

            {/* Floating blobs */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-20 left-10 w-32 h-32 rounded-full opacity-20 bg-gradient-to-tr from-blue-700 to-indigo-700 dark:opacity-40"
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute top-40 right-20 w-24 h-24 rounded-full opacity-20 bg-gradient-to-br from-purple-700 to-indigo-800 dark:opacity-40"
                    animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full opacity-25 bg-gradient-to-r from-indigo-600 to-blue-700 dark:opacity-40"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="container relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-32">
                <div className="text-center">
                    {/* Animated Icon */}
                    <motion.div
                        className="flex justify-center mb-8"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="relative">
                            <motion.div
                                className="bg-gradient-to-r from-blue-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 p-6 rounded-2xl shadow-xl dark:shadow-[0_0_25px_#6B46C1]"
                                whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(107,70,193,0.7)" }}
                                transition={{ duration: 0.3 }}
                            >
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <BookOpen className="h-16 w-16 text-white dark:text-indigo-300" />
                                </motion.div>
                            </motion.div>
                            <motion.div
                                className="absolute -top-2 -right-2 bg-yellow-400 dark:bg-yellow-500 p-2 rounded-full shadow-md"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Sparkles className="h-4 w-4 text-yellow-900 dark:text-yellow-300" />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Animated Title */}
                    <motion.h1
                        className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Welcome to{' '}
                        <motion.span
                            className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 dark:from-indigo-400 dark:via-purple-500 dark:to-pink-600 bg-clip-text text-transparent"
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                textShadow: [
                                    "0 0 15px rgba(139,92,246,0.8)",
                                    "0 0 30px rgba(255,255,255,0.8)",
                                    "0 0 15px rgba(139,92,246,0.8)"
                                ]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            BlogCraft
                        </motion.span>
                    </motion.h1>

                    {/* Animated Subtitle */}
                    <motion.p
                        className="text-xl md:text-2xl mb-12 text-blue-200 dark:text-gray-300 max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Discover amazing stories, share your thoughts, and connect with passionate writers from around the world in our vibrant community.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <Link to="/blogs">
                            <motion.button
                                className="relative bg-gradient-to-r from-blue-700 to-purple-700 dark:from-indigo-700 dark:to-purple-800 hover:from-indigo-800 hover:to-purple-900 text-white dark:text-gray-100 px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 shadow-lg dark:shadow-[0_0_25px_#7C3AED] overflow-hidden"
                                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 25px rgba(124,58,237,0.9)" }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <motion.div className="absolute inset-0 rounded-xl border-white/30 animate-pulse z-0" />
                                <span className="z-10">Start Reading</span>
                                <motion.div
                                    animate={{ x: [0, 6, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="z-10"
                                >
                                    <ArrowRight className="h-5 w-5" />
                                </motion.div>
                            </motion.button>
                        </Link>

                        <motion.button
                            className="border-2 border-white/40 backdrop-blur-sm text-white dark:text-gray-200 px-8 py-4 rounded-xl font-semibold hover:bg-white/20 dark:hover:bg-gray-700 transition-all duration-300"
                            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 0 15px rgba(255,255,255,0.25)" }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            Share Your Story
                        </motion.button>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        {/* Writers */}
                        <motion.div
                            className="text-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 dark:bg-gray-800">
                                <motion.div>
                                    <Users className="h-8 w-8 text-blue-500 dark:text-blue-400 mx-auto mb-3" />
                                </motion.div>
                                <motion.h3
                                    className="text-3xl font-bold mb-2"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    20k+
                                </motion.h3>
                                <p className="text-blue-300 dark:text-blue-400">Active Writers</p>
                            </div>
                        </motion.div>

                        {/* Stories */}
                        <motion.div
                            className="text-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 dark:bg-gray-800">
                                <motion.div>
                                    <BookOpen className="h-8 w-8 text-purple-500 dark:text-purple-400 mx-auto mb-3" />
                                </motion.div>
                                <motion.h3
                                    className="text-3xl font-bold mb-2"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                >
                                    250K+
                                </motion.h3>
                                <p className="text-purple-300 dark:text-purple-400">Stories Published</p>
                            </div>
                        </motion.div>

                        {/* Readers */}
                        <motion.div
                            className="text-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 dark:bg-gray-800">
                                <motion.div>
                                    <TrendingUp className="h-8 w-8 text-pink-500 dark:text-pink-400 mx-auto mb-3" />
                                </motion.div>
                                <motion.h3
                                    className="text-3xl font-bold mb-2"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                >
                                    1M+
                                </motion.h3>
                                <p className="text-pink-300 dark:text-pink-400">Monthly Readers</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
