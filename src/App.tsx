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
    // Handle navigation when user state changes
    if (user && userType) {
      const currentPath = window.location.pathname;
      
      // If user is on auth page and successfully authenticated, redirect to appropriate dashboard
      if (currentPath.includes('/auth')) {
        if (userType === 'recruiter') {
          navigate('/recruiter/organizations');
        } else if (userType === 'candidate') {
          navigate('/candidate/dashboard');
        }
      }
    }
  }, [user, userType, navigate]);


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