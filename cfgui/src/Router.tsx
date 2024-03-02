import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Contact from "./pages/Contact";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

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
            <Route path='about-us' element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };

  return <BrowserRoutes />;
}
