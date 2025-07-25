import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Users, User, Menu, X } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleRecruiterClick = () => {
    navigate('/recruiter');
  };

  const handleCandidateClick = () => {
    navigate('/candidate');
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
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-3 lg:space-x-4">
              <button
                onClick={handleRecruiterClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 lg:px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 text-sm lg:text-base"
              >
                <Users className="w-4 h-4" />
                <span>For Recruiters</span>
              </button>
              <button
                onClick={handleCandidateClick}
                className="bg-white hover:bg-gray-50 text-indigo-600 border-2 border-indigo-600 px-4 lg:px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 text-sm lg:text-base"
              >
                <User className="w-4 h-4" />
                <span>For Candidates</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
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
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  handleRecruiterClick();
                  setIsMobileMenuOpen(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-base"
              >
                <Users className="w-5 h-5" />
                <span>For Recruiters</span>
              </button>
              <button
                onClick={() => {
                  handleCandidateClick();
                  setIsMobileMenuOpen(false);
                }}
                className="bg-white hover:bg-gray-50 text-indigo-600 border-2 border-indigo-600 px-4 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 text-base"
              >
                <User className="w-5 h-5" />
                <span>For Candidates</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;