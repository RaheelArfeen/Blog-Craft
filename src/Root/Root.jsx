import React from 'react';
import Header from '../Components/Header';
import { Outlet } from 'react-router';
import Footer from '../Components/Footer';

const Root = () => {
    return (
        <div className='flex flex-col justify-between min-h-screen'>
            <Header></Header>
            <div className='min-h-screen'>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default Root;