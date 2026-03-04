import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/x21a-api/sessionInfo/login';
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <div className="loading-screen">Cargando aplicación...</div>;
  }

  if (!isAuthenticated) {
    return <div className="redirecting-screen">Redirigiendo a XLNetS...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
