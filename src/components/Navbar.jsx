import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = (
    <>
      <Link
        to="/"
        className="text-gray-900 font-body text-sm lg:text-base px-4 py-2 rounded-full border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
      >
        Home
      </Link>
      <Link
        to="/about"
        className="text-gray-700 font-body text-sm lg:text-base hover:text-gray-900 transition-colors"
      >
        About Us
      </Link>
      <Link
        to="/packages"
        className="text-gray-700 font-body text-sm lg:text-base hover:text-gray-900 transition-colors"
      >
        Packages
      </Link>
      <Link
        to="/modules"
        className="text-gray-700 font-body text-sm lg:text-base hover:text-gray-900 transition-colors"
      >
        Modules
      </Link>
      <Link
        to="/proff"
        className="text-gray-700 font-body text-sm lg:text-base hover:text-gray-900 transition-colors"
      >
        Proff
      </Link>
      <Link
        to="/contact"
        className="text-gray-700 font-body text-sm lg:text-base hover:text-gray-900 transition-colors"
      >
        Contact Us
      </Link>
    </>
  );

  return (
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1">
          {navLinks}
        </div>

        <div className="flex items-center justify-center flex-shrink-0">
          <Link to="/">
            <img
              src="/logo.png"
              alt="MedEase Logo"
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto"
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/admin' : '/student'}
                className="text-gray-700 font-body hover:text-gray-900 transition-colors text-sm lg:text-base"
              >
                {user.role === 'admin' ? 'Admin' : 'Dashboard'}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-primary to-primary/90 text-white font-body font-semibold px-5 lg:px-6 py-2.5 rounded-lg hover:shadow-lg transition-all text-sm lg:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 font-body hover:text-gray-900 transition-colors text-sm lg:text-base"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-primary to-primary/90 text-white font-body font-semibold px-5 lg:px-6 py-2.5 rounded-lg hover:shadow-lg transition-all text-sm lg:text-base"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-900 p-2 ml-4"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-gray-200 pt-4">
          {[
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About Us' },
            { to: '/packages', label: 'Packages' },
            { to: '/modules', label: 'Modules' },
            { to: '/proff', label: 'Proff' },
            { to: '/contact', label: 'Contact Us' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 font-body hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-gray-50"
            >
              {label}
            </Link>
          ))}
          <div className="flex flex-col space-y-2 pt-2">
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/student'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 font-body hover:text-gray-900 py-2 px-4"
                >
                  {user.role === 'admin' ? 'Admin' : 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-primary to-primary/90 text-white font-body font-semibold px-4 py-2.5 rounded-lg text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 font-body hover:text-gray-900 py-2 px-4"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-gradient-to-r from-primary to-primary/90 text-white font-body font-semibold px-4 py-2.5 rounded-lg text-left"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
