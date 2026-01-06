import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/images/logo-removebg-preview.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Switches the style after 20px of scrolling
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Products', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Inspiration', path: '/home' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-700 ease-in-out ${
        isScrolled 
          ? 'bg-gray-500/25 backdrop-blur-[2px] py-10'      // Blends almost invisibly into the image
          : 'bg-white/65 backdrop-blur-md py-4 shadow-md' // Becomes a distinct "glass" bar
      }`}
    >
      <div className="w-full flex items-center justify-center px-8">
        
        <div className="hidden lg:flex items-center gap-20">
          {/* Logo - Fixed Size & Original Color */}
          <Link to="/" className="inline-block transition-transform duration-500 hover:scale-105">
            <img 
              src={logoImage} 
              alt="Logo" 
              style={{ height: '75px', width: 'auto' }}
              className="transition-all duration-500" 
            />
          </Link>

          {/* Nav Links */}
          <div className="flex gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm uppercase tracking-[0.35em] font-bold transition-all duration-500 hover:opacity-50 ${
                  isScrolled 
                    ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' // White text for the dark gradient
                    : 'text-neutral-900' // Dark text for the white background
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;