import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { apiClient } from '@/lib/api';

interface AuthUser extends User {
  role?: string;
  profile?: any;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (userData: any) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  updateUser: (userData: any) => void;
  fetchCurrentUser: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  setSession: (session: Session | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user from backend API
  const fetchCurrentUser = async () => {
    try {
      const response = await apiClient.getCurrentUser();
      if (response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      // If token is invalid, clear it
      apiClient.clearToken();
    }
  };

  useEffect(() => {
    // Check for existing JWT token first (check both 'token' and 'jwt_token' keys)
    const token = localStorage.getItem('jwt_token') || localStorage.getItem('token');
    if (token) {
      apiClient.setToken(token);
      fetchCurrentUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Set up auth state listener for Supabase (for fallback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session?.user) {
          // Only set user if we don't have a backend user
          if (!user) {
            setUser(session.user);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Use backend API for login to get JWT token and user role
      const response = await apiClient.login(email, password);
      
      if (response.token) {
        // Store the JWT token
        localStorage.setItem('jwt_token', response.token);
        apiClient.setToken(response.token);
        
        // Set the user with the role from backend
        setUser(response.user);
        
        // Fetch additional user data to ensure we have complete profile
        try {
          const userData = await apiClient.getCurrentUser();
          if (userData.user) {
            setUser(userData.user);
          }
        } catch (fetchError) {
          console.warn('Could not fetch additional user data:', fetchError);
        }
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      return { error: error.message || 'Login failed' };
    }
  };

  const register = async (userData: any) => {
    try {
      // Use backend API for registration
      const response = await apiClient.register({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: userData.role?.toUpperCase() || 'STUDENT',
        ...(userData.studentId && { studentId: userData.studentId }),
        ...(userData.collegeCode && { collegeCode: userData.collegeCode }),
        ...(userData.universityCode && { universityCode: userData.universityCode }),
        ...(userData.companyName && { companyName: userData.companyName }),
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Registration failed:', error);
      return { error };
    }
  };

  const logout = async () => {
    // Clear JWT token from API client
    apiClient.clearToken();
    
    // Sign out from Supabase as well
    await supabase.auth.signOut();
    
    // Clear user state
    setUser(null);
    setSession(null);
  };

  const updateUser = (userData: any) => {
    setUser(prevUser => prevUser ? { ...prevUser, ...userData } : null);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    updateUser,
    fetchCurrentUser,
    setUser,
    setSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
