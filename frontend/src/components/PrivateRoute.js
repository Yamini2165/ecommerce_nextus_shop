/**
 * components/PrivateRoute.js - Protects authenticated routes
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  // Redirect to login if not authenticated, preserving intended destination
  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
