import React from 'react';
import { Laptop, Heart, Plane, Camera, BookOpen, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturedCategories = () => {
  const categories = [
    {
      icon: Laptop,
      name: "Technology",
      description: "Latest trends in tech and programming",
      count: "2,450+ posts",
      color: "from-blue-500 to-cyan-500",
      darkColor: "from-blue-400 to-cyan-400"
    },
    {
      icon: Heart,
      name: "Lifestyle",
      description: "Health, wellness, and personal growth",
      count: "1,890+ posts",
      color: "from-pink-500 to-rose-500",
      darkColor: "from-pink-400 to-rose-400"
    },
    {
      icon: Plane,
      name: "Travel",
      description: "Adventures and travel experiences",
      count: "1,650+ posts",
      color: "from-green-500 to-emerald-500",
      darkColor: "from-green-400 to-emerald-400"
    },
    {
      icon: Camera,
      name: "Photography",
      description: "Visual storytelling and techniques",
      count: "1,200+ posts",
      color: "from-purple-500 to-indigo-500",
      darkColor: "from-purple-400 to-indigo-400"
    },
    {
      icon: BookOpen,
      name: "Education",
      description: "Learning resources and tutorials",
      count: "980+ posts",
      color: "from-orange-500 to-amber-500",
      darkColor: "from-orange-400 to-amber-400"
    },
    {
      icon: Lightbulb,
      name: "Innovation",
      description: "Creative ideas and entrepreneurship",
      count: "750+ posts",
      color: "from-yellow-500 to-orange-500",
      darkColor: "from-yellow-400 to-orange-400"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Explore Popular Categories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover amazing content across diverse topics and find your niche in our thriving community
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group cursor-pointer"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-gray-900 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600">
                  <div
                    className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center mb-4 
                      bg-gradient-to-r 
                      ${category.color} 
                      dark:${category.darkColor} 
                      group-hover:scale-110 
                      transition-transform duration-300
                    `}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {category.name}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {category.count}
                    </span>
                    <motion.div
                      className="text-blue-600 dark:text-blue-400 font-medium text-sm"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      Explore →
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
