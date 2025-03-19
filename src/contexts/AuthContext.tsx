import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { auth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current auth status
    auth.getCurrentUser().then(user => {
      setUser(user);
      setLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = auth.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await auth.signIn(email, password);
      setUser(user);
      toast.success('Signed in successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign in', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { user } = await auth.signUp(email, password);
      setUser(user);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create account', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Failed to sign out', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext }