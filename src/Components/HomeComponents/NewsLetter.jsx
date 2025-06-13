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
            toast.success("Thank you for subscribing to our newsletter!");
            setEmail('');
            setIsSubmitting(false);
        }, 1000);
    };

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    return (
        <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 md:p-16 mx-auto shadow-2xl"
                >
                    <div className="flex justify-center mb-8">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={inView ? { scale: 1, rotate: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
                            className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl border border-white/30"
                        >
                            <Mail className="h-10 w-10 text-white" />
                        </motion.div>
                    </div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
                    >
                        Stay in the Loop
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Get exclusive insights, latest updates, and premium content delivered directly to your inbox. Join our community of forward-thinkers.
                    </motion.p>

                    <motion.form
                        onSubmit={handleSubmit}
                        className="max-w-lg mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full px-6 py-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/25 transition-all duration-300 text-lg"
                                    disabled={isSubmitting}
                                />
                            </div>
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-lg min-w-[140px]"
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-600 border-t-transparent"></div>
                                ) : (
                                    <>
                                        <span>Subscribe</span>
                                        <Send className="h-5 w-5" />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="mt-8 flex items-center justify-center space-x-6 text-sm text-white/80"
                    >
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>No spam, ever</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Unsubscribe anytime</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span>12,000+ subscribers</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Newsletter;