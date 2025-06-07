import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CgMenuGridO } from 'react-icons/cg';
import { FaUser } from 'react-icons/fa';
import { logout } from '../store/authSlice';
import logo from '../assets/logo.png';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasBg, setHasBg] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle scroll for background color
  useEffect(() => {
    const handleScroll = () => {
      setHasBg(window.scrollY >= 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-menu')) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isProfileOpen]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileOpen(false); // Close profile dropdown if open
  };

  // Toggle profile dropdown
  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsMenuOpen(false); // Close mobile menu if open
  };

  // Close menus on navigation
  const handleNavClick = (path) => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    navigate(path);
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  // Menu items
  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Book Flight', path: '/search' },
    { label: 'About', path: '/about' },
    { label: 'Offers', path: '/offers' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`navBar fixed top-0 left-0 w-full max-w-[100vw] flex justify-between items-center px-4 sm:px-6 py-3 transition-all duration-300 z-50 overflow-visible ${
        hasBg ? 'navbar_With_Bg' : 'bg-transparent'
      }`}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="logoDiv flex-shrink-0">
        <img
          src={logo}
          className="h-10 sm:h-12 cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200"
          alt="Flight Explorer Logo"
          onClick={() => handleNavClick('/')}
        />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6 flex-shrink-0">
        <ul className="flex space-x-6">
          {menuItems.map((item, index) => (
            <li key={item.label}>
              <span
                onClick={() => handleNavClick(item.path)}
                className={`text-base font-medium text-gray-700 hover:text-teal-600 cursor-pointer transition-all duration-200 hover:scale-105 animate-fadeInUp animation-delay-${(index + 1) * 100}`}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleNavClick(item.path)}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
        {/* Profile Menu */}
        <div className="relative profile-menu">
          <FaUser
            className="text-2xl text-gray-700 cursor-pointer hover:text-teal-600 transition-colors duration-200"
            onClick={toggleProfileMenu}
            aria-label="Profile menu"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleProfileMenu()}
          />
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 animate-slideDown">
              {user ? (
                <>
                  <span
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 cursor-pointer transition-colors duration-200"
                    onClick={() => handleNavClick('/profile')}
                  >
                    Profile
                  </span>
                  {(user.role === 'User' || user.role === 'Admin') && (
                    <span
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 cursor-pointer transition-colors duration-200"
                      onClick={() => handleNavClick('/bookings')}
                    >
                      Bookings
                    </span>
                  )}
                  {user.role === 'Admin' && (
                    <span
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 cursor-pointer transition-colors duration-200"
                      onClick={() => handleNavClick('/dashboard')}
                    >
                      Dashboard
                    </span>
                  )}
                  <span
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors duration-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 cursor-pointer transition-colors duration-200"
                    onClick={() => handleNavClick('/login')}
                  >
                    Sign In
                  </span>
                  <span
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-600 cursor-pointer transition-colors duration-200"
                    onClick={() => handleNavClick('/signup')}
                  >
                    Sign Up
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex-shrink-0 mr-2">
        <CgMenuGridO
          className="text-3xl text-gray-700 cursor-pointer hover:text-teal-600 transition-colors duration-200"
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
        />
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="navBarMenu absolute top-16 left-0 w-full max-w-[100vw] bg-white shadow-lg md:hidden transition-transform duration-300 transform translate-y-0 animate-fadeInUp z-50">
          <ul className="flex flex-col items-center py-4 space-y-4">
            {menuItems.map((item) => (
              <li key={item.label}>
                <span
                  onClick={() => handleNavClick(item.path)}
                  className="text-base font-medium text-gray-700 hover:text-teal-600 cursor-pointer transition-colors duration-200"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleNavClick(item.path)}
                >
                  {item.label}
                </span>
              </li>
            ))}
            {user ? (
              <>
                <li>
                  <span
                    onClick={() => handleNavClick('/profile')}
                    className="text-base font-medium text-gray-700 hover:text-teal-600 cursor-pointer transition-colors duration-200"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleNavClick('/profile')}
                  >
                    Profile
                  </span>
                </li>
                {(user.role === 'User' || user.role === 'Admin') && (
                  <li>
                    <span
                      onClick={() => handleNavClick('/bookings')}
                      className="text-base font-medium text-gray-700 hover:text-teal-600 cursor-pointer transition-colors duration-200"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleNavClick('/bookings')}
                    >
                      Bookings
                    </span>
                  </li>
                )}
                {user.role === 'Admin' && (
                  <li>
                    <span
                      onClick={() => handleNavClick('/dashboard')}
                      className="text-base font-medium text-gray-700 hover:text-teal-600 cursor-pointer transition-colors duration-200"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleNavClick('/dashboard')}
                    >
                      Dashboard
                    </span>
                  </li>
                )}
                <li>
                  <span
                    onClick={handleLogout}
                    className="text-base font-medium text-red-600 hover:text-red-700 cursor-pointer transition-colors duration-200"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogout()}
                  >
                    Logout
                  </span>
                </li>
              </>
            ) : (
              <>
                <li>
                  <span
                    onClick={() => handleNavClick('/login')}
                    className="text-base font-medium text-gray-700 hover:text-teal-600 cursor-pointer transition-colors duration-200"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleNavClick('/login')}
                  >
                    Sign In
                  </span>
                </li>
                <li>
                  <span
                    onClick={() => handleNavClick('/signup')}
                    className="text-base font-medium text-gray-700 hover:text-teal-600 cursor-pointer transition-colors duration-200"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleNavClick('/signup')}
                  >
                    Sign Up
                  </span>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;