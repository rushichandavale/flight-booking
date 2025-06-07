import { Link } from 'react-router-dom';
import { BsFacebook } from 'react-icons/bs';
import { AiFillTwitterCircle, AiFillYoutube } from 'react-icons/ai';
import { FaTiktok, FaPinterest } from 'react-icons/fa';
import { Button } from './Common';
import logo from '../assets/logo.png';

function Footer() {
  const socialLinks = [
    { Icon: BsFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { Icon: AiFillTwitterCircle, href: 'https://twitter.com', label: 'Twitter' },
    { Icon: FaTiktok, href: 'https://tiktok.com', label: 'TikTok' },
    { Icon: AiFillYoutube, href: 'https://youtube.com', label: 'YouTube' },
    { Icon: FaPinterest, href: 'https://pinterest.com', label: 'Pinterest' },
  ];

  const footerLinks = {
    Information: [
      { label: 'Manage Booking', to: '#' },
      { label: 'Flight Status', to: '#' },
      { label: 'Check-In', to: '#' },
      { label: 'Explore', to: '#' },
      { label: 'Contact Us', to: '/contact' },
    ],
    Company: [
      { label: 'Chauffeur', to: '#' },
      { label: 'Our Partners', to: '#' },
      { label: 'Destinations', to: '/destinations' },
      { label: 'Careers', to: '#' },
      { label: 'Rules', to: '#' },
    ],
    QuickGuide: [
      { label: 'FAQs', to: '#' },
      { label: 'Features', to: '#' },
      { label: 'Baggage', to: '#' },
      { label: 'Route Map', to: '#' },
      { label: 'Our Communities', to: '#' },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-teal-400 to-blue-400 text-white py-12 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4" data-aos="fade-up" data-aos-duration="1000">
            <img src={logo} className="h-10 sm:h-12" alt="FlightBook logo" />
            <p className="text-white text-sm">Discover the world with our seamless travel experience.</p>
            <div className="flex space-x-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white text-lg hover:text-white hover:scale-110 transition-all duration-300 rounded-full p-1"
                >
                  <Icon />
                </a>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="text-2xl font-bold text-white mb-3">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  id="newsletter-email"
                  placeholder="Enter your email"
                  className="px-3 py-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full max-w-xs disabled:opacity-50"
                  aria-describedby="newsletter-info" readOnly
                />
                <Button
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:from-blue-700 hover:to-teal-600 disabled:opacity-50 transition-all duration-300"
                >
                  Subscribe
                </Button>
              </div>
              <p id="newsletter-info" className="sr-only">
                Enter your email to subscribe to our newsletter (currently disabled).
              </p>
            </div>
          </div>

          {/* Information Section */}
          <div className="space-y-3" data-aos="fade-up" data-aos-duration="1200">
            <h3 className="text-2xl font-bold text-white mb-3">Information</h3>
            <ul className="space-y-3 text-white text-sm">
              {footerLinks.Information.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="hover:text-white inline-block"
                    aria-label={label}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div className="space-y-3" data-aos="fade-up" data-aos-duration="1400">
            <h3 className="text-2xl font-bold text-white mb-3">Company</h3>
            <ul className="space-y-3 text-white text-sm">
              {footerLinks.Company.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="hover:text-white inline-block"
                    aria-label={label}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Guide Section */}
          <div className="space-y-3" data-aos="fade-up" data-aos-duration="1400">
            <h3 className="text-2xl font-bold text-white mb-3">Quick Guide</h3>
            <ul className="space-y-3 text-white text-sm">
              {footerLinks.QuickGuide.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="hover:text-white inline-block"
                    aria-label={label}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-400 text-center text-gray-300 text-sm">
          <p className='text-white'>© {new Date().getFullYear()} FlightBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;