import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './context/AppContext';
import { useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import AuthPage from './components/auth/AuthPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import OrganizationSelector from './components/recruiter/OrganizationSelector';
import CreateOrganization from './components/recruiter/CreateOrganization';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import PsychometricTest from './pages/PsychometricTest';
import JobApplication from './pages/JobApplication';

function AppContent() {
  const { user, userType, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only handle navigation after auth state is fully resolved
    if (!loading && user) {
      const currentPath = window.location.pathname;
      
      // If user is on auth page and successfully authenticated, redirect to appropriate dashboard
      if (currentPath.includes('/auth')) {
        // Add a small delay to ensure state is fully updated
        setTimeout(() => {
          if (userType === 'recruiter') {
            navigate('/recruiter/organizations');
          } else if (userType === 'candidate') {
            navigate('/candidate/dashboard');
          }
        }, 100);
      }
    }
    
    // Handle case where user is authenticated but profile loading failed
    if (!loading && user && !userType) {
      const currentPath = window.location.pathname;
      if (currentPath.includes('/auth')) {
        console.error('Unable to load user profile. Please try again.');
      }
    }
  }, [user, userType, loading, navigate]);

  // Show loading screen while auth is being resolved
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Recruiter Routes */}
        <Route 
          path="/recruiter/organizations" 
          element={
            <ProtectedRoute requiredUserType="recruiter">
              <OrganizationSelector />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recruiter/create-organization" 
          element={
            <ProtectedRoute requiredUserType="recruiter">
              <CreateOrganization />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recruiter/organization/:organizationId" 
          element={
            <ProtectedRoute requiredUserType="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Candidate Routes */}
        <Route 
          path="/candidate/dashboard" 
          element={
            <ProtectedRoute requiredUserType="candidate">
              <CandidateDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/apply/:jobId" 
          element={
            <ProtectedRoute requiredUserType="candidate">
              <JobApplication />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/test/:jobId" 
          element={
            <ProtectedRoute requiredUserType="candidate">
              <PsychometricTest />
            </ProtectedRoute>
          } 
        />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/recruiter" element={<LandingPage />} />
        <Route path="/candidate" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;