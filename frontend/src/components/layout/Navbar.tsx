import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '@/assets/images/logo.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          ? 'bg-gray-500/25 backdrop-blur-[2px] py-6'
          : 'bg-white/65 backdrop-blur-md py-4 shadow-md'
      }`}
    >
      <div className="w-full flex items-center justify-center lg:justify-center px-8 relative">
        {/* Mobile Logo*/}
        <Link to="/" className="lg:hidden inline-block">
          <img 
            src={logoImage} 
            alt="Logo" 
            style={{ height: '50px', width: 'auto' }}
            className="transition-all duration-500" 
          />
        </Link>

        {/* Desktop Menu */}
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

        {/* Mobile Menu Button */}
        <div className="lg:hidden absolute right-8">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`btn btn-ghost btn-sm ${isScrolled ? 'text-white' : 'text-neutral-900'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
          
          {/* Side menu */}
          <div 
            className={`fixed top-0 right-0 h-screen w-[80%] max-w-md z-50 border-l-2 shadow-2xl transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } ${
              isScrolled 
                ? 'bg-gray-600 border-white/40' 
                : 'bg-white border-gray-300'
            }`}
          >
            {/* Close button */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`absolute top-6 right-6 ${isScrolled ? 'text-white' : 'text-neutral-900'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col justify-center items-center h-full gap-10 px-8">
              <Link to="/" className="lg:hidden inline-block" onClick={() => setIsMobileMenuOpen(false)}>
                <img 
                  src={logoImage} 
                  alt="Logo" 
                  style={{ height: '50px', width: 'auto' }}
                  className="transition-all duration-500" 
                />
              </Link>
              
              {navLinks.map((link) => {
                const isSpcBtn = link.name === 'Quote' || link.name === 'Careers';
                
                return (
                  <Link 
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${isSpcBtn ? 'w-48' : 'w-full'} text-center uppercase text-sm tracking-[0.3em] font-bold py-4 transition-all hover:opacity-50 ${
                      isSpcBtn ? 'border rounded-md' : ''
                    } ${
                      isScrolled 
                        ? `text-white ${isSpcBtn ? 'border-white' : ''}` 
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
      </div>
    </nav>
  );
};

export default Navbar;