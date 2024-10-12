import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, allow access to the route
  return children;
};

export default ProtectedRoute;
