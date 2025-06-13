import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Users, DollarSign, Heart, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            icon: <Zap className="h-5 w-5" />,
            question: "How do I get started with BlogCraft?",
            answer: "Getting started with BlogCraft is simple and fast. Just sign up for a free account, complete your profile, and you’re ready to publish your first blog post. Our beginner-friendly editor, helpful templates, and built-in SEO tools make the process effortless—even if you’re new to blogging."
        },
        {
            icon: <Heart className="h-5 w-5" />,
            question: "Is BlogCraft free to use?",
            answer: "Absolutely! BlogCraft offers a generous free plan that covers everything you need to start blogging—unlimited posts, essential themes, community access, and up to 10GB storage. You can upgrade anytime to unlock premium features like analytics, custom domains, and priority support."
        },
        {
            icon: <Users className="h-5 w-5" />,
            question: "How do I grow my audience on BlogCraft?",
            answer: "BlogCraft helps you grow with powerful tools like built-in SEO, social sharing, detailed analytics, and a community-driven discovery system. You can connect with other writers, get featured in our Discover section, and engage readers through comments, follows, and collaborations."
        },
        {
            icon: <DollarSign className="h-5 w-5" />,
            question: "Can I monetize my blog on BlogCraft?",
            answer: "Yes! BlogCraft supports various monetization options including affiliate marketing, sponsored posts, our partner revenue program, and reader tips. Premium users get access to advanced tools, earnings dashboards, and extra exposure through our featured creator initiatives."
        },
        {
            icon: <MessageCircle className="h-5 w-5" />,
            question: "What kind of support does BlogCraft offer?",
            answer: "We offer 24/7 support through detailed guides, video tutorials, live webinars, and community forums. Need more? Premium users enjoy priority email responses, expert consultations, and dedicated help from our support team within just 2 hours."
        }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>

            <div className="relative w-full md:container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        className="flex justify-center mb-8"
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                    >
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl shadow-2xl">
                            <HelpCircle className="h-10 w-10 text-white" />
                        </div>
                    </motion.div>
                    <motion.h2
                        className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <motion.p
                        className="text-xl md:text-2xl text-gray-600 mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Get answers to common questions about BlogCraft and start your blogging journey with confidence
                    </motion.p>
                </motion.div>

                <div className="grid gap-6 mx-auto">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group"
                        >
                            <motion.div
                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/20"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                                >
                                    <div className="flex items-center space-x-4">
                                        <motion.div
                                            className="flex-shrink-0 p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {faq.icon}
                                        </motion.div>
                                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                                        className="flex-shrink-0 p-2 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300"
                                    >
                                        <ChevronDown className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <motion.div
                                                initial={{ y: -10 }}
                                                animate={{ y: 0 }}
                                                exit={{ y: -10 }}
                                                transition={{ duration: 0.3 }}
                                                className="px-8 pb-6 pt-2"
                                            >
                                                <div className="pl-16">
                                                    <div className="h-px bg-gradient-to-r from-blue-200 to-purple-200 mb-4"></div>
                                                    <p className="text-gray-700 leading-relaxed text-lg">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mx-auto shadow-xl border border-white/20">
                        <motion.div
                            className="flex justify-center mb-6"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 200 }}
                        >
                            <div className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full">
                                <MessageCircle className="h-6 w-6 text-white" />
                            </div>
                        </motion.div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Still have questions?
                        </h3>
                        <p className="text-gray-600 mb-6 text-lg">
                            Our friendly support team is here to help you succeed. Get personalized assistance from our blogging experts.
                        </p>
                        <motion.button
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-100"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Contact Support
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQSection;