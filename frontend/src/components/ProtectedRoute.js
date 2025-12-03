import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;

  const userRaw = localStorage.getItem('user');
  let user = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch (e) {
      // malformed user in storage, clear it
      localStorage.removeItem('user');
      user = null;
    }
  }

  if (requireAdmin && !user?.is_staff) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
