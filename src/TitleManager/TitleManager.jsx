import { useEffect } from "react";
import { useLocation } from "react-router";

const routeTitles = {
    "/": "Home | BlogCraft",
    "/blogs": "All Blogs | BlogCraft",
    "/profile": "Profile | BlogCraft",
    "/wishlist": "Wishlist | BlogCraft",
    "/featured": "Featured Blogs | BlogCraft",
    "/add-blogs": "Add Plants | BlogCraft",
    "/update-profile": "Updata Profile | BlogCraft",
    "/login": "Login | BlogCraft",
    "/register": "Register | BlogCraft",

};

const TitleManager = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.startsWith("/bills/:id")
            ? "/bills/:id"
            : location.pathname;

        const title = routeTitles[path] || "BlogCraft";
        document.title = title;
    }, [location]);

    return null;
};

export default TitleManager;