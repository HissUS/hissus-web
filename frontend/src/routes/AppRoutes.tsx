import { Routes, Route } from "react-router-dom"
import MainLayout from "@/components/layout/MainLayout"

import Home from "@/pages/Home"
import About from "@/pages/About"
import Services from "@/pages/Services"
import Contact from "@/pages/Contact"
import Quote from "@/pages/Quote"
import Careers from "@/pages/Careers"

export default function AppRoutes() {
  return (
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
  )
}
