import React from 'react';
import { Users, BookOpen, Heart, Award } from 'lucide-react';
import { motion } from "motion/react"
import { useInView } from 'react-intersection-observer';

const StatsSection = () => {
    const stats = [
        {
            icon: Users,
            number: '10,000+',
            label: 'Active Writers',
            description: 'Talented creators sharing their expertise'
        },
        {
            icon: BookOpen,
            number: '50,000+',
            label: 'Published Articles',
            description: 'High-quality content across various topics'
        },
        {
            icon: Heart,
            number: '1M+',
            label: 'Monthly Readers',
            description: 'Engaged audience from around the world'
        },
        {
            icon: Award,
            number: '25+',
            label: 'Categories',
            description: 'Diverse topics to explore and learn from'
        }
    ];

    const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    };

    return (
        <section className="py-16 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white">
            <div className="md:container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Join Our Growing Community
                    </h2>
                    <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto">
                        Be part of a thriving ecosystem of writers, readers, and knowledge enthusiasts.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            whileHover={{ scale: 1.05 }}
                            className="text-center group"
                        >
                            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl p-6 transition-all duration-300 shadow-md">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-blue-500 p-3 rounded-full group-hover:bg-blue-400 transition-colors duration-300 shadow-lg">
                                        <stat.icon className="h-8 w-8 text-white" />
                                    </div>
                                </div>

                                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                                    {stat.number}
                                </div>

                                <div className="text-lg font-semibold text-blue-100 mb-2">
                                    {stat.label}
                                </div>

                                <p className="text-sm text-blue-200">
                                    {stat.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default StatsSection;