import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
      api.defaults.auth = {
        username: user.username,
        password: user.password
      };
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      await api.post('/api/auth/login', {}, {
        auth: { username, password }
      });
      
      const user = { username, password, roles: [] };
      
      // Test if user has ADMIN role
      try {
        await api.get('/api/admin/users', {
          auth: { username, password }
        });
        user.roles.push('ADMIN');
      } catch (error) {
        // Not an admin, normal operation
      }
      
      user.roles.push('USER');
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.auth = { username, password };
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    delete api.defaults.auth;
  };

  const register = async (username, password) => {
    try {
      await api.post('/api/auth/register', { username, password });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    hasRole: (role) => currentUser?.roles.includes(role)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};