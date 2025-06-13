import React from 'react';
import { Lightbulb, BookOpen, Users, TrendingUp } from 'lucide-react';
import { motion } from "framer-motion"
import { useInView } from 'react-intersection-observer';

const TipsSection = () => {
    const tips = [
        {
            icon: Lightbulb,
            title: 'Write Engaging Headlines',
            description: 'Craft compelling headlines that grab attention and accurately represent your content. Use numbers, questions, or power words to increase click-through rates.',
            color: 'bg-yellow-500'
        },
        {
            icon: BookOpen,
            title: 'Tell Stories',
            description: 'People connect with stories. Share personal experiences, case studies, or examples that make your content relatable and memorable.',
            color: 'bg-green-500'
        },
        {
            icon: Users,
            title: 'Know Your Audience',
            description: 'Understand who you\'re writing for. Research their interests, pain points, and preferred content formats to create targeted, valuable content.',
            color: 'bg-purple-500'
        },
        {
            icon: TrendingUp,
            title: 'Optimize for SEO',
            description: 'Use relevant keywords naturally, create compelling meta descriptions, and structure your content with proper headings for better search visibility.',
            color: 'bg-blue-500'
        }
    ];

    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section className="py-16">
            <div className="md:container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Pro Tips for Better Blogging
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Elevate your writing with these expert tips and best practices from successful bloggers.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={inView ? 'visible' : 'hidden'}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {tips.map((tip, index) => (
                        <motion.div
                            key={index}
                            variants={cardVariants}
                            className="group"
                        >
                            <div className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 h-full">
                                <div className={`${tip.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <tip.icon className="h-6 w-6 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {tip.title}
                                </h3>

                                <p className="text-gray-600 leading-relaxed">
                                    {tip.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TipsSection;
