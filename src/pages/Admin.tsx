import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Admin: React.FC = () => {
  const { usuario } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>
        <div className="card p-8">
          <p className="text-gray-600 mb-4">
            Bienvenido al panel de administración, {usuario?.nombre}.
          </p>
          <p className="text-gray-600">
            Panel de administración en desarrollo...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
