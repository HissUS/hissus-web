import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/client/Home'
import About from '@/pages/client/About'
import Services from '@/pages/client/Services'
import Contact from '@/pages/client/Contact'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}