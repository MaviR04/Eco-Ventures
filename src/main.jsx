import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import DefLayout from './components/layout/DefLayout.jsx';
import Tours from './pages/Tours.jsx';
import { loadTours, loadTour } from './loaders.js'; 
import { motion, AnimatePresence } from 'motion/react';
import Tour from './pages/Tour.jsx'
import { param } from 'motion/react-client';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefLayout />,
    children:[
      {index:true, element:<motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration:0.3}} ><App /></motion.div>},
      {path:"tours", element:<Tours />, loader: loadTours},
      {path:"tours/:id", element:<motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration:0.3}} ><Tour /></motion.div>, loader: async({params})=>loadTour(params.id)},
      {path:"admin", element:<AdminPanel />}
    ]
  },
  {
    path:"login",
    element:<Login />
  },
  {
    path:"register",
    element:<Register />
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
     <AnimatePresence ><RouterProvider router={router} /></AnimatePresence>
     </AuthProvider>
  </StrictMode>
)
