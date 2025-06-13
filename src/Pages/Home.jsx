import React, { useEffect } from 'react';
import Banner from '../Components/Banner';
import RecentBlogs from '../Components/HomeComponents/RecentBlogPosts';
import FeaturedCategories from '../Components/HomeComponents/FeaturedCategories';
import TipsSection from '../Components/HomeComponents/TipsSection';
import FeedBack from '../Components/HomeComponents/FeedBack';
import Newsletter from '../Components/HomeComponents/NewsLetter';
import FAQSection from '../Components/HomeComponents/FAQSection';

const Home = () => {

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);
    }, []);

    return (
        <div>
            <Banner />
            <RecentBlogs />
            <FeaturedCategories />
            <TipsSection />
            <FeedBack />
            <FAQSection />
            <Newsletter />
        </div>
    );
};

export default Home;