import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Users, User, Menu, X, LogOut, Building } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userType, signOut, userProfile } = useAuth();
  const isHome = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleRecruiterClick = () => {
    if (user && userType === 'recruiter') {
      navigate('/recruiter/organizations');
    } else {
      navigate('/auth?type=recruiter');
    }
  };

  const handleCandidateClick = () => {
    if (user && userType === 'candidate') {
      navigate('/candidate/dashboard');
    } else {
      navigate('/auth?type=candidate');
    }
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
            {user ? (
              // Authenticated user navigation
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {userProfile?.full_name || user.email}
                </span>
                
                {userType === 'recruiter' && (
                  <Link
                    to="/recruiter/organizations"
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
                  >
                    <Building className="w-4 h-4" />
                    <span>My Organizations</span>
                  </Link>
                )}
                
                {userType === 'candidate' && (
                  <Link
                    to="/candidate/dashboard"
                    className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-800 font-medium flex items-center space-x-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              // Home page navigation for non-authenticated users
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
            )}
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
              {user ? (
                // Authenticated user mobile menu
                <>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Welcome, {userProfile?.full_name || user.email}
                  </div>
                  
                  {userType === 'recruiter' && (
                    <Link
                      to="/recruiter/organizations"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 flex items-center space-x-2"
                    >
                      <Building className="w-5 h-5" />
                      <span>My Organizations</span>
                    </Link>
                  )}
                  
                  {userType === 'candidate' && (
                    <Link
                      to="/candidate/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 flex items-center space-x-2"
                    >
                      <User className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2 flex items-center space-x-2 text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                // Home page mobile menu for non-authenticated users
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;