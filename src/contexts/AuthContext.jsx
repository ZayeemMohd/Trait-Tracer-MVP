import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userType, setUserType] = useState(null); // 'recruiter' or 'candidate'
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    auth.getSession().then(({ session }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      // Try to find user as recruiter first
      try {
        const { data: recruiter, error: recruiterError } = await db.getRecruiter(userId);
        
        if (recruiter && !recruiterError) {
          setUserProfile(recruiter);
          setUserType('recruiter');
          return;
        }
      } catch (recruiterError) {
        console.log('User not found in recruiters table, checking candidates...');
      }

      // Try to find user as candidate
      try {
        const { data: candidate, error: candidateError } = await db.getCandidate(userId);
        
        if (candidate && !candidateError) {
          setUserProfile(candidate);
          setUserType('candidate');
          return;
        }
      } catch (candidateError) {
        console.log('User not found in candidates table either');
      }

      // User exists in auth but not in our tables - this shouldn't happen
      console.warn('User found in auth but not in database tables');
      setUserProfile(null);
      setUserType(null);
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
      setUserType(null);
    }
  };

  const signUp = async (email, password, userData, type) => {
    setLoading(true);
    try {
      const { data, error } = await auth.signUp(email, password, {
        data: userData
      });
      
      if (error) throw error;

      if (data.user) {
        // Create profile in appropriate table
        const profileData = {
          id: data.user.id,
          email: data.user.email,
          ...userData
        };

        if (type === 'recruiter') {
          const { error: profileError } = await db.createRecruiter(profileData);
          if (profileError) throw profileError;
          
          setUserType('recruiter');
          setUserProfile(profileData);
        } else if (type === 'candidate') {
          const { error: profileError } = await db.createCandidate(profileData);
          if (profileError) throw profileError;
          
          setUserType('candidate');
          setUserProfile(profileData);
        }
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await auth.signIn(email, password);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Clear local state first
      setUser(null);
      setUserProfile(null);
      setUserType(null);
      setSession(null);
      
      const { error } = await auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user || !userType) return { error: new Error('No user logged in') };

    try {
      let data, error;
      
      if (userType === 'recruiter') {
        ({ data, error } = await db.updateRecruiter(user.id, updates));
      } else if (userType === 'candidate') {
        ({ data, error } = await db.updateCandidate(user.id, updates));
      }

      if (!error && data) {
        setUserProfile(data);
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const value = {
    user,
    userProfile,
    userType,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isRecruiter: userType === 'recruiter',
    isCandidate: userType === 'candidate',
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}