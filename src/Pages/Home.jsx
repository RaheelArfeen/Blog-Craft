import React from 'react';
import Banner from '../Components/Banner';
import RecentBlogs from '../Components/HomeComponents/RecentBlogPosts';
import FeaturedCategories from '../Components/HomeComponents/FeaturedCategories';
import TipsSection from '../Components/HomeComponents/TipsSection';
import StatsSection from '../Components/HomeComponents/StatsSection';

const Home = () => {
    return (
        <div>
            <Banner/>
            <RecentBlogs/>
            <FeaturedCategories/>
            <TipsSection/>
            <StatsSection/>
        </div>
    );
};

export default Home;