import { authService, AuthUser, createAuthLog } from '@/services/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithOAuth: (forceLogin?: boolean) => Promise<{ success: boolean; error?: string; user?: AuthUser | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  handleOAuthRedirect: (url: string) => Promise<{ success: boolean; error?: string; user?: AuthUser | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const authenticated = await authService.isAuthenticated();
      
      if (authenticated) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
        createAuthLog(currentUser);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithOAuth = async (forceLogin: boolean = false) => {
    try {
      setIsLoading(true);
      const result = await authService.signInWithOAuth(forceLogin);
      
      // If OAuth was successful, update the auth state
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        createAuthLog(result.user);
      }
      
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Sign in failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthRedirect = async (url: string) => {
    try {
      setIsLoading(true);
      const result = await authService.handleOAuthRedirect(url);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        createAuthLog(result.user);
      }
      
      return result;
    } catch (error: any) {
      return { success: false, error: error.message || 'Authentication failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signInWithOAuth,
    signOut,
    refreshUser,
    handleOAuthRedirect,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}