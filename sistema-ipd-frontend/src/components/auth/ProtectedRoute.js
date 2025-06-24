import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ role }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Guarda la ubicación a la que se intentaba acceder
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const requiredAuthority = `ROLE_${role}`;
  const hasRequiredRole = user.authorities && user.authorities.includes(requiredAuthority);

  if (role && !hasRequiredRole) {
    // Si no tiene el rol, también lo mandamos al login
    // Podríamos también limpiar la sesión aquí si quisiéramos ser más estrictos
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si todo está correcto, renderiza la página solicitada
  return <Outlet />;
};

export default ProtectedRoute;