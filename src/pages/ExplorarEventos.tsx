import React from 'react';
import { useEventos } from '../contexts/EventosContext';
import { useTranslation } from '../contexts/IdiomaContext';

export const ExplorarEventos: React.FC = () => {
  const { eventosFiltrados, cargando } = useEventos();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t('eventos.titulo')}
        </h1>
        
        {cargando ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando eventos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventosFiltrados.map((evento) => (
              <div key={evento.id} className="card p-6">
                <img 
                  src={evento.imagen} 
                  alt={evento.titulo}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{evento.titulo}</h3>
                <p className="text-gray-600 mb-4">{evento.descripcion.substring(0, 100)}...</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{evento.fecha}</span>
                  <span className="text-orange-600 font-semibold">{evento.precio}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorarEventos;
