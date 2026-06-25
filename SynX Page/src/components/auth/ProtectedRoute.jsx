import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('synx_token');
  const userStr = localStorage.getItem('synx_user');

  if (!token || !userStr) {
    // No está autenticado, lo mandamos al login
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  // Si se definieron roles permitidos y el usuario no los tiene
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirigir según el rol que tenga
    if (user.role === 'member') return <Navigate to="/member/home" replace />;
    if (user.role === 'owner' || user.role === 'manager') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // Todo en orden, renderizar el contenido protegido
  return <Outlet />;
};

export default ProtectedRoute;
