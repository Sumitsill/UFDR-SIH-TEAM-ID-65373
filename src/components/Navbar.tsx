import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const menuItemsRef = useRef<HTMLUListElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Check user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP entry animation
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
    }
    if (menuItemsRef.current) {
      const items = menuItemsRef.current.children;
      gsap.fromTo(items, { y: -50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.5
      });
    }
    if (buttonsRef.current) {
      const buttons = buttonsRef.current.children;
      gsap.fromTo(buttons, { y: -30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out', delay: 0.8
      });
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${isScrolled ? 'bg-[#0a0f2c]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main navbar row */}
        <div className="flex flex-col md:flex-row items-center justify-center h-20 space-y-3 md:space-y-0">
          {/* Menu Items */}
          <ul ref={menuItemsRef} className="flex items-center space-x-8">
            <li>
              <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium">
                Services
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium">
                Contact
              </Link>
            </li>
          </ul>

          {/* Buttons */}
          <div ref={buttonsRef} className="flex items-center space-x-4 ml-auto">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/upload')}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                >
                  Upload Case
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white absolute right-6 top-6"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 mt-2 text-center">
            <ul className="flex flex-col space-y-4">
              <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-blue-400">Home</Link></li>
              <li><Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-blue-400">Services</Link></li>
              <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-blue-400">About Us</Link></li>
              <li><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-300 hover:text-blue-400">Contact</Link></li>
              {user ? (
                <>
                  <li><button onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} className="text-gray-300 hover:text-blue-400">Dashboard</button></li>
                  <li><button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-gray-300 hover:text-blue-400">Logout</button></li>
                </>
              ) : (
                <>
                  <li><button onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }} className="text-gray-300 hover:text-blue-400">Login</button></li>
                  <li><button onClick={() => { navigate('/upload'); setIsMobileMenuOpen(false); }} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/50">Upload Case</button></li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
