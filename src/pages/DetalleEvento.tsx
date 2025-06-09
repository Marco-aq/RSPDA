import React from 'react';
import { useParams } from 'react-router-dom';
import { useEventos } from '../contexts/EventosContext';

export const DetalleEvento: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { obtenerEvento } = useEventos();
  
  const evento = id ? obtenerEvento(id) : null;

  if (!evento) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Evento no encontrado</h1>
          <p className="text-gray-600">El evento que buscas no existe o ha sido eliminado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <img 
            src={evento.imagen} 
            alt={evento.titulo}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{evento.titulo}</h1>
          <p className="text-lg text-gray-600 mb-6">{evento.descripcion}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Detalles del evento</h3>
              <p><strong>Fecha:</strong> {evento.fecha}</p>
              <p><strong>Hora:</strong> {evento.hora}</p>
              <p><strong>Ubicación:</strong> {evento.ubicacion.nombre}</p>
              <p><strong>Precio:</strong> {evento.precio}</p>
              <p><strong>Organizador:</strong> {evento.organizador}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Información adicional</h3>
              <p><strong>Categoría:</strong> {evento.categoria}</p>
              <p><strong>Tipo:</strong> {evento.tipo}</p>
              <p><strong>Idiomas:</strong> {evento.idiomas.join(', ')}</p>
              <p><strong>Valoración:</strong> {evento.valoracion}/5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleEvento;
