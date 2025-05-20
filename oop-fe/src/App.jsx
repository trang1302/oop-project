import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BookList from './components/BookList';
import BookUpload from './components/BookUpload';
import BookReader from './components/BookReader';
import AdminPanel from './components/AdminPanel';
import Navigation from './components/Navigation';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/books" element={
              <ProtectedRoute>
                <BookList />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <BookUpload />
              </ProtectedRoute>
            } />
            <Route path="/books/:id" element={
              <ProtectedRoute>
                <BookReader />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/books" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;