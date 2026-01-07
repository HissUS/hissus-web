import { Link } from 'react-router-dom';
import logoImage from '@/assets/images/logo.png';

export default function Footer() {
  return (
    <footer className="footer-main">
      <div className="footer-container">
        
        <div className="footer-content-row">
          
          {/* Brand Info */}
          <div className="footer-brand-section">
            <Link to="/" className="footer-logo-link">
              <img src={logoImage} alt="Logo" className="footer-logo-img" />
            </Link>
            <p className="footer-brand-text">
              Precision retractable screens <br />
              designed for modern living <br />
              since 1992.
            </p>
          </div>

          {/* Products */}
          <nav className="footer-nav-section">
            <h6 className="footer-nav-title">Products</h6>
            <Link to="/services" className="footer-nav-link">Door Screens</Link>
            <Link to="/services" className="footer-nav-link">Window Screens</Link>
            <Link to="/home" className="footer-nav-link">Inspiration</Link>
            <Link to="/quote" className="footer-nav-link">Get a Quote</Link>
          </nav>

          {/* Company */}
          <nav className="footer-nav-section">
            <h6 className="footer-nav-title">Company</h6>
            <Link to="/about" className="footer-nav-link">About Us</Link>
            <Link to="/contact" className="footer-nav-link">Contact</Link>
            <Link to="/careers" className="footer-nav-link">Careers</Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="footer-copyright-section">
          <p className="footer-copyright-text">
            © {new Date().getFullYear()} All rights reserved. Precision Craftsmanship.
          </p>
        </div>
      </div>
    </footer>
  );
}