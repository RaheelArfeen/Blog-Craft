import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from "framer-motion"
import { useInView } from 'react-intersection-observer';

const FeedBack = () => {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Content Creator",
            content: "BlogCraft has transformed how I share my stories. The community here is incredibly supportive and engaging.",
            rating: 5,
            avatar: "https://i.pravatar.cc/150?img=5"
        },
        {
            name: "Michael Chen",
            role: "Tech Blogger",
            content: "The platform's intuitive design makes writing and publishing a breeze. I've grown my audience significantly here.",
            rating: 5,
            avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
            name: "Emily Rodriguez",
            role: "Travel Writer",
            content: "I love how easy it is to connect with fellow writers and readers. The feedback I get here is invaluable.",
            rating: 5,
            avatar: "https://i.pravatar.cc/150?img=8"
        }
    ];

    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

    const cardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.3,
                duration: 0.6,
                ease: 'easeOut'
            }
        })
    };

    return (
        <section ref={ref} className="py-16 bg-gray-800 transition-colors duration-500">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                        What Our Writers Say
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Join thousands of writers who have found their voice and built their audience on Blog.
                    </p>
                </motion.div>

                <div className="flex flex-wrap gap-8 justify-center">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            custom={index}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            variants={cardVariants}
                            className="bg-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex-1 flex flex-col justify-between min-w-60"
                        >
                            <div>
                                <div className="flex items-center mb-3">
                                    <div className="flex text-yellow-400">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-current mb-2" />
                                        ))}
                                    </div>
                                </div>

                                <div className="relative mb-6">
                                    <Quote className="absolute -top-2 -left-2 h-7 w-7 text-blue-300" />
                                    <p className="text-gray-200 leading-relaxed pl-7">
                                        {testimonial.content}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4 text-lg shadow-inner overflow-hidden">
                                    <img src={testimonial.avatar} alt={`${testimonial.name} avatar`} />
                                </div>
                                <div>
                                    <h4 className="text-md font-semibold text-gray-100">{testimonial.name}</h4>
                                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeedBack;
