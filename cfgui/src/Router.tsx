import Header from "./components/Header";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import React from "react";
//import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'

export default function Router() {
  const Layout = () => {
    return (
      <>
        <Header />
        <div className='content'>
          <Outlet />
        </div>
        <Footer />
      </>
    );
  };

  const BrowserRoutes = () => {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='contact-us' element={<Contact />} />
            <Route path='about' element={<h1>Not Found</h1>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };

  return <BrowserRoutes />;
}
