import { Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"
import MainLayout from "@/components/layout/MainLayout"

import Home from "@/pages/Home"
import About from "@/pages/About"
import Services from "@/pages/Services"
import Contact from "@/pages/Contact"
import Quote from "@/pages/Quote"
import Careers from "@/pages/Careers"

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/careers" element={<Careers />} />
        </Route>
      </Routes>
    </>
  )
}
