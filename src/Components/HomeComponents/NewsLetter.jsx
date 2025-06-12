import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address to subscribe.");
            return;
        }

        if (!isValidEmail(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            toast.success("Thank you for subscribing to our newsletter.");
            setEmail('');
            setIsSubmitting(false);
        }, 1000);
    };

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    return (
        <section className="py-16 bg-gradient-to-br from-[#2762EB] to-[#9134EA]">
            <div className="md:container mx-auto px-4 text-center">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-white/20 backdrop-blur-2xl border border-white/30 shadow-xl rounded-2xl p-12 md:p-16"
                >
                    <div className="flex justify-center mb-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={inView ? { scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-blue-100 p-4 rounded-full"
                        >
                            <Mail className="h-8 w-8 text-blue-600" />
                        </motion.div>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
                        Stay Updated with Our Newsletter
                    </h2>

                    <p className="text-lg text-blue-700 mb-8 max-w-2xl mx-auto">
                        Get the latest blog posts, exclusive content, and industry insights delivered straight to your inbox.
                    </p>

                    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-3 rounded-lg border border-blue-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                ) : (
                                    <>
                                        <span>Subscribe</span>
                                        <Send className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="text-sm text-blue-600 mt-4">
                        No spam, unsubscribe anytime. Join 10,000+ readers who trust our content.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default Newsletter;