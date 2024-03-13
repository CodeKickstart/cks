// In Router.js

import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Contact from "./pages/Contact";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
// import DummyInterview from "./components/Interview/ui-common/DummyInterview";
import _Interview from "./components/Interview/ui-common/_Interview";
// Import the dummy interview component

export default function Router() {
  const Layout = () => {
    return (
      <div className='flex-1 overflow-y-auto pt-16 pb-16'>
        <Header />
        <div style={{ flex: 1 }}>
          {" "}
          {/* Allow the content to stretch */}
          <Outlet />
        </div>
        <Footer />
      </div>
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
            <Route
              path='interview'
              element={
                <_Interview
                  baseUrl={""}
                  path={""}
                  libAddress={""}
                  relProdPath={""}
                />
              }
            />{" "}
            {/* Route for the dummy interview component */}
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };

  return <BrowserRoutes />;
}
