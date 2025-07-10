import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader } from 'lucide-react';

function ProtectedRoute({ children, requiredUserType = null }) {
  const { user, userType, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page with return URL
    const authUrl = requiredUserType 
      ? `/auth?type=${requiredUserType}&redirect=${encodeURIComponent(location.pathname)}`
      : '/';
    return <Navigate to={authUrl} replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    // User is authenticated but wrong type
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;