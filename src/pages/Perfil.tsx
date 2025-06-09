import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Perfil: React.FC = () => {
  const { usuario } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>
        <div className="card p-8">
          {usuario ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">{usuario.nombre}</h2>
              <p className="text-gray-600 mb-2">Email: {usuario.email}</p>
              <p className="text-gray-600 mb-2">Rol: {usuario.rol}</p>
              <p className="text-gray-600">Ciudad: {usuario.ciudad}</p>
            </div>
          ) : (
            <p className="text-gray-600">No hay información de usuario disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
