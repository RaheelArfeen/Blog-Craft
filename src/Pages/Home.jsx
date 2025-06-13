import React, { useEffect } from 'react';
import Banner from '../Components/Banner';
import RecentBlogs from '../Components/HomeComponents/RecentBlogPosts';
import FeaturedCategories from '../Components/HomeComponents/FeaturedCategories';
import TipsSection from '../Components/HomeComponents/TipsSection';
import StatsSection from '../Components/HomeComponents/StatsSection';
import FeedBack from '../Components/HomeComponents/FeedBack';
import Newsletter from '../Components/HomeComponents/NewsLetter';

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
            <StatsSection />
            <FeedBack />
            <Newsletter />
        </div>
    );
};

export default Home;