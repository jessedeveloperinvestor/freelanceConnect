import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: user, error, mutate } = useSWR('/api/user', {
    onSuccess: () => setIsLoading(false),
    onError: () => setIsLoading(false),
    shouldRetryOnError: false
  });

  // Login function
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to login');
      }

      const userData = await response.json();
      await mutate(userData);
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to register');
      }

      const newUser = await response.json();
      await mutate(newUser);
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      await mutate(null);
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user information
  const updateUser = async (updatedData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to update user information');
      }

      const updatedUser = await response.json();
      await mutate(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        mutate
      }}
    >
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
