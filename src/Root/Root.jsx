import React from 'react';
import Header from '../Components/Header';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer';
import ScrollToTop from '../Components/ScrollToTop';

const Root = () => {
    return (
        <div className='flex flex-col justify-between min-h-screen bg-[#F9FBFB]'>
            <Header></Header>
            <Outlet></Outlet>
            <Footer></Footer>
            <ScrollToTop></ScrollToTop>
        </div>
    );
};

export default Root;