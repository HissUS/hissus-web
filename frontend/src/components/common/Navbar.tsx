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
    { name: 'Quote', path: '/quote' },
    { name: 'Careers', path: '/careers' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-700 ease-in-out ${
        isScrolled 
          ? 'bg-gray-500/25 backdrop-blur-[2px] py-6' // Slightly smaller when scrolled
          : 'bg-white/65 backdrop-blur-md py-4 shadow-md'
      }`}
    >
      <div className="w-full flex items-center justify-center px-8">
        <div className="hidden lg:flex items-center gap-20">
          <Link to="/" className="inline-block transition-transform duration-500 hover:scale-105">
            <img 
              src={logoImage} 
              alt="Logo" 
              style={{ height: '75px', width: 'auto' }}
              className="transition-all duration-500" 
            />
          </Link>

          <div className="flex gap-12 items-center justify-center">
            {navLinks.map((link) => {
              // Check if this link is the 'Quote' button
              const isSpcBtn = link.name === 'Quote' || link.name === 'Careers';
              
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  style={isSpcBtn ? { padding: '12px 20px' } : {}}
                  className={`text-sm uppercase tracking-[0.35em] font-bold transition-all duration-500 hover:opacity-50 
                  ${isSpcBtn ? 'border-2 rounded-md inline-flex items-center justify-center' : ''} 
                  ${
                    isScrolled 
                      ? `text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] ${isSpcBtn ? 'border-white' : ''}`
                      : `text-neutral-900 ${isSpcBtn ? 'border-neutral-900' : ''}`
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;