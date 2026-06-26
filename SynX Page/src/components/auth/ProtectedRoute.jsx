import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('synx_token');
  const userStr = localStorage.getItem('synx_user');

  if (!token || !userStr) {
    
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    
    if (user.role === 'member') return <Navigate to="/member/home" replace />;
    if (user.role === 'owner' || user.role === 'manager') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;
