import React from 'react';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="page-home">
      <h1>Bienvenido a la nueva UDA con React</h1>
      <p>Has iniciado sesión correctamente.</p>
      
      <div className="info-card">
        <h3>Credenciales de Usuario (XLNetS)</h3>
        <ul>
          <li><strong>Nombre:</strong> {user?.name}</li>
          <li><strong>Apellido:</strong> {user?.surname1}</li>
          <li><strong>Roles:</strong> {user?.roles?.join(', ')}</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
