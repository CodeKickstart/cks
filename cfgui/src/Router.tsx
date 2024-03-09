// In Router.js

import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Contact from "./pages/Contact";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import DummyInterview from "./pages/DummyInterview";
// Import the dummy interview component

export default function Router() {
  const Layout = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}>
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
            <Route path='interview' element={<DummyInterview />} />{" "}
            {/* Route for the dummy interview component */}
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };

  return <BrowserRoutes />;
}
