import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router";
import { router } from './Router/Router';
import AuthProvider from './Provider/AuthProvider';
import { Toaster } from 'sonner';
import { ThemeProvider } from './Provider/ThemeProvider';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <Toaster position='bottom-right'></Toaster>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
