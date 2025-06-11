import {
  createBrowserRouter,
} from "react-router";
import Root from "../Root/Root";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import AllBlogs from "../Pages/AllBlogs";
import AddBlogs from "../Pages/AddBlogs";
import Featured from "../Pages/Featured";
import Wishlist from "../Pages/Wishlist";
import Profile from "../Pages/Profile";
import UpdateProfile from "../Pages/UpdateProfile";
import { ProtectedRoute } from "../Provider/ProtectedRoute";
import ErrorPage from "../Pages/ErrorPage";
import BlogDetail from "../Pages/BlogDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      { index: true, path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/blogs', element: <AllBlogs /> },
      { path: '/blogs/:id', element: <ProtectedRoute><BlogDetail /></ProtectedRoute> },
      { path: '/add-blog', element: <ProtectedRoute><AddBlogs /></ProtectedRoute> },
      { path: '/featured', element: <Featured /> },
      { path: '/wishlist', element: <ProtectedRoute><Wishlist /></ProtectedRoute> },
      { path: '/profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: '/edit-profile', element: <ProtectedRoute><UpdateProfile /></ProtectedRoute> },
    ]
  },
]);