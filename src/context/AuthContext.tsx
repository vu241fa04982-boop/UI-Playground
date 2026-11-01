
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt?: string;
  username?: string;
  pronouns?: string;
  location?: string;
  website?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  updateProfile: (updated: Partial<UserProfile>) => boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getProfile = (session: Session): UserProfile => {
  const metadata = session.user.user_metadata;

  return {
    name: metadata?.name || session.user.email?.split('@')[0] || 'User',
    email: session.user.email || '',
    createdAt: session.user.created_at,
    avatar: metadata?.avatar,
    bio: metadata?.bio,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error('Session error:', error.message);
        }

        setUser(data.session ? getProfile(data.session) : null);
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session ? getProfile(session) : null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password?: string
  ): Promise<boolean> => {
    if (!email.trim() || !password) return false;

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      console.error('Login failed:', error.message);
      return false;
    }

    return true;
  };

  const signup = async (
    name: string,
    email: string,
    password?: string
  ): Promise<boolean> => {
    if (!name.trim() || !email.trim() || !password) return false;

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
        },
        emailRedirectTo: `${window.location.origin}/playground`,
      },
    });
    console.log('Signup response:', data);
    if (error) {
      console.error('Signup failed:', error.message);
      return false;
    }

    return true;
  };

  const updateProfile = (updated: Partial<UserProfile>): boolean => {
    if (!user) return false;

    const newProfile = {
      ...user,
      ...updated,
      name: updated.name?.trim() ?? user.name,
      email: updated.email?.trim() ?? user.email,
    };

    setUser(newProfile);
    return true;
  };

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        login,
        signup,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
