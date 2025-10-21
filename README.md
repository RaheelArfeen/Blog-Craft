# BlogCraft

**BlogCraft** is a modern, full-stack blogging platform where users can read, post, like, comment on blogs, and manage their favorites. Built with React on the frontend and Express + MongoDB on the backend, it delivers a fast, user-friendly blogging experience.

---

## Live Website

[https://blogcraft-raheel.netlify.app/](https://blogcraft-raheel.netlify.app/)

---

## Features

- **User Authentication** (JWT + Cookies)  
- **Create, Edit, and Delete Blogs**  
- **Comment System** (with user profile integration)  
- **Add to Wishlist (Favorites)**  
- **View Blog Stats** (views, comments, etc.)  
- **Search and Filter Blogs by Category**  
- **Responsive and Theme-Aware UI**  
- **Admin-Ready Backend APIs**  

### New Features

- **Blog Likes ✅**  
  Add a “like” or “heart” button for each blog. Can be a simple counter in MongoDB or an array of user IDs who liked it. Shows visible engagement and is easy to implement with a single API endpoint.

- **Blog Reading Time ✅**  
  Display an estimated reading time for each blog (e.g., “5 min read”). Calculated based on word count of the blog: `Math.ceil(wordCount / 200)` assuming 200 words/min. Simple to implement on the frontend when fetching blog content.

- **Author Badge / Profile Highlight ✅**  
  Show a small badge or highlight for the blog author (e.g., “Top Author” or “New Author”). Can be based on number of blogs posted or likes received. Easy to add on the frontend using conditional rendering.

---

## Technologies Used

BlogCraft is built using a modern tech stack to ensure fast performance, beautiful UI, and a smooth user experience. Below is a list of the core technologies and their purposes:

- **Axios**  
  Handles all HTTP requests between the frontend and backend (e.g., fetching blogs, posting comments).

- **React Router**  
  Enables dynamic client-side routing for seamless navigation between pages.

- **Firebase Authentication**  
  Provides secure and easy-to-use user authentication (sign up, log in, log out).

- **MongoDB Database**  
  Stores all application data including blogs, users, comments, likes, and wishlist items.

- **TailwindCSS**  
  Utility-first CSS framework used for creating responsive, modern, and maintainable UI designs.

- **TanStack Table**  
  Used to build complex, performant tables with sorting, filtering, and responsive design features.

- **Sonner (Toast Notifications)**  
  Displays non-intrusive, elegant notifications to improve user feedback (e.g., success or error alerts).

- **Lucide Icons**  
  A sleek icon set used to enhance UI/UX with clean and modern visuals.

- **DateFNS**  
  Assists with date and time formatting (e.g., displaying “2 hours ago”).

- **JWT (JSON Web Token)**  
  Provides secure authentication and authorization by verifying users on protected routes.

- **Framer Motion**  
  Adds smooth and engaging animations to the interface for a better user experience.

- **Skeleton Loader**  
  Improves perceived performance by displaying loading placeholders during data fetches.

- **SweetAlert2**  
  Offers attractive and customizable alert dialogs for confirmations and prompts.

- **Netlify**  
  Hosts and deploys the BlogCraft frontend with support for continuous deployment and HTTPS.

- **Zod** ✅  
  Provides schema validation for backend data, ensuring that all incoming requests are type-safe and validated before processing.

---

### Backend

- **Node.js & Express**  
- **MongoDB (Native Driver)**  
- **JWT for Auth**  
- **CORS & Cookie Parser**  
- **Zod for Input Validation** ✅
