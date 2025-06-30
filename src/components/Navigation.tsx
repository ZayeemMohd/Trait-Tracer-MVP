import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Users, User, Menu, X } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" />
            <span className="text-lg sm:text-xl font-bold text-gray-900">Trait-Tracer</span>
          </Link>
          
          {/* Desktop Navigation */}
          {isHome && (
            <div className="hidden md:flex space-x-3 lg:space-x-4">
              <Link
                to="/recruiter"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 lg:px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 text-sm lg:text-base"
              >
                <Users className="w-4 h-4" />
                <span>For Recruiters</span>
              </Link>
              <Link
                to="/candidate"
                className="bg-white hover:bg-gray-50 text-indigo-600 border-2 border-indigo-600 px-4 lg:px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 text-sm lg:text-base"
              >
                <User className="w-4 h-4" />
                <span>For Candidates</span>
              </Link>
            </div>
          )}
          
          {/* Mobile Menu Button (Home page only) */}
          {isHome && (
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}
          
          {/* Back to Home (Non-home pages) */}
          {!isHome && (
            <Link
              to="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
            >
              Back to Home
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        {isHome && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/recruiter"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-base"
              >
                <Users className="w-5 h-5" />
                <span>For Recruiters</span>
              </Link>
              <Link
                to="/candidate"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-white hover:bg-gray-50 text-indigo-600 border-2 border-indigo-600 px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-base"
              >
                <User className="w-5 h-5" />
                <span>For Candidates</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;