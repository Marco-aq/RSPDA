import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Evento, Filtros, CategoriaEvento, OrdenEvento, EventoFormData } from '../types';
import { localStorageKeys } from '../config/app';
import { useAuth } from './AuthContext';

interface EventosContextType {
  eventos: Evento[];
  eventosFiltrados: Evento[];
  eventosDestacados: Evento[];
  cargando: boolean;
  error: string | null;
  filtros: Filtros;
  favoritos: string[];
  busqueda: string;
  
  // Métodos de filtrado y búsqueda
  setBusqueda: (busqueda: string) => void;
  setFiltros: (filtros: Partial<Filtros>) => void;
  limpiarFiltros: () => void;
  
  // Métodos de eventos
  obtenerEvento: (id: string) => Evento | undefined;
  crearEvento: (datos: EventoFormData) => Promise<boolean>;
  editarEvento: (id: string, datos: Partial<EventoFormData>) => Promise<boolean>;
  eliminarEvento: (id: string) => Promise<boolean>;
  
  // Métodos de favoritos
  agregarFavorito: (eventoId: string) => void;
  removerFavorito: (eventoId: string) => void;
  esFavorito: (eventoId: string) => boolean;
  
  // Métodos de categorías
  obtenerCategorias: () => CategoriaEvento[];
  obtenerEventosPorCategoria: (categoria: CategoriaEvento) => Evento[];
  
  // Métodos de estadísticas
  obtenerEstadisticas: () => {
    totalEventos: number;
    eventosPorCategoria: Record<string, number>;
    eventosProximos: number;
  };
}

const EventosContext = createContext<EventosContextType | undefined>(undefined);

interface EventosProviderProps {
  children: ReactNode;
}

export const EventosProvider: React.FC<EventosProviderProps> = ({ children }) => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [eventosFiltrados, setEventosFiltrados] = useState<Evento[]>([]);
  const [eventosDestacados, setEventosDestacados] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltrosState] = useState<Filtros>({});
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [busqueda, setBusquedaState] = useState('');
  
  const { usuario } = useAuth();

  // Cargar eventos al inicializar
  useEffect(() => {
    cargarEventos();
    cargarFavoritos();
  }, []);

  // Aplicar filtros cuando cambien los criterios
  useEffect(() => {
    aplicarFiltros();
  }, [eventos, filtros, busqueda]);

  const cargarEventos = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const response = await fetch('/data/eventos.json');
      if (!response.ok) {
        throw new Error('Error al cargar eventos');
      }
      
      const eventosData: Evento[] = await response.json();
      setEventos(eventosData);
      
      // Seleccionar eventos destacados (con mejor valoración y más favoritos)
      const destacados = eventosData
        .sort((a, b) => (b.valoracion * b.favoritos) - (a.valoracion * a.favoritos))
        .slice(0, 6);
      setEventosDestacados(destacados);
      
    } catch (err) {
      console.error('Error al cargar eventos:', err);
      setError('Error al cargar los eventos. Por favor, intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const cargarFavoritos = () => {
    try {
      const favoritosGuardados = localStorage.getItem(localStorageKeys.favorites);
      if (favoritosGuardados) {
        setFavoritos(JSON.parse(favoritosGuardados));
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  };

  const guardarFavoritos = (nuevosFavoritos: string[]) => {
    setFavoritos(nuevosFavoritos);
    localStorage.setItem(localStorageKeys.favorites, JSON.stringify(nuevosFavoritos));
  };

  const aplicarFiltros = () => {
    let resultado = [...eventos];

    // Filtro por búsqueda
    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(evento =>
        evento.titulo.toLowerCase().includes(termino) ||
        evento.descripcion.toLowerCase().includes(termino) ||
        evento.organizador.toLowerCase().includes(termino) ||
        evento.ubicacion.nombre.toLowerCase().includes(termino) ||
        evento.tags.some(tag => tag.toLowerCase().includes(termino))
      );
    }

    // Filtro por categoría
    if (filtros.categoria) {
      resultado = resultado.filter(evento => evento.categoria === filtros.categoria);
    }

    // Filtro por fecha
    if (filtros.fecha) {
      const hoy = new Date();
      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(hoy.getDate() - hoy.getDay());
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6);
      
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

      resultado = resultado.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        
        switch (filtros.fecha) {
          case 'hoy':
            return fechaEvento.toDateString() === hoy.toDateString();
          case 'esta-semana':
            return fechaEvento >= inicioSemana && fechaEvento <= finSemana;
          case 'este-mes':
            return fechaEvento >= inicioMes && fechaEvento <= finMes;
          default:
            return true;
        }
      });
    }

    // Filtro por precio
    if (filtros.precio) {
      resultado = resultado.filter(evento => {
        const esGratuito = evento.precio.toLowerCase().includes('gratuito');
        return filtros.precio === 'gratuito' ? esGratuito : !esGratuito;
      });
    }

    // Filtro por ubicación
    if (filtros.ubicacion) {
      resultado = resultado.filter(evento =>
        evento.ubicacion.nombre.toLowerCase().includes(filtros.ubicacion!.toLowerCase()) ||
        evento.ubicacion.direccion.toLowerCase().includes(filtros.ubicacion!.toLowerCase())
      );
    }

    // Filtro por idioma
    if (filtros.idioma) {
      resultado = resultado.filter(evento =>
        evento.idiomas.includes(filtros.idioma!)
      );
    }

    // Filtro por público objetivo
    if (filtros.publicoObjetivo) {
      resultado = resultado.filter(evento =>
        evento.publicoObjetivo.includes(filtros.publicoObjetivo!)
      );
    }

    // Ordenamiento
    if (filtros.ordenarPor) {
      resultado.sort((a, b) => {
        switch (filtros.ordenarPor) {
          case 'fecha':
            return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
          case 'popularidad':
            return (b.favoritos + b.comentarios) - (a.favoritos + a.comentarios);
          case 'valoracion':
            return b.valoracion - a.valoracion;
          case 'reciente':
            return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
          default:
            return 0;
        }
      });
    }

    setEventosFiltrados(resultado);
  };

  const setBusqueda = (nuevaBusqueda: string) => {
    setBusquedaState(nuevaBusqueda);
  };

  const setFiltros = (nuevosFiltros: Partial<Filtros>) => {
    const filtrosActualizados = { ...filtros, ...nuevosFiltros };
    setFiltrosState(filtrosActualizados);
    localStorage.setItem(localStorageKeys.filters, JSON.stringify(filtrosActualizados));
  };

  const limpiarFiltros = () => {
    setFiltrosState({});
    setBusquedaState('');
    localStorage.removeItem(localStorageKeys.filters);
  };

  const obtenerEvento = (id: string): Evento | undefined => {
    return eventos.find(evento => evento.id === id);
  };

  const crearEvento = async (datos: EventoFormData): Promise<boolean> => {
    try {
      if (!usuario) return false;

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));

      const nuevoEvento: Evento = {
        id: Date.now().toString(),
        titulo: datos.titulo,
        descripcion: datos.descripcion,
        fecha: datos.fecha,
        hora: datos.hora,
        ubicacion: datos.ubicacion,
        categoria: datos.categoria,
        tipo: datos.tipo,
        precio: datos.precio,
        organizador: usuario.nombre,
        idiomas: datos.idiomas,
        publicoObjetivo: datos.publicoObjetivo,
        imagen: datos.imagen ? URL.createObjectURL(datos.imagen) : '/images/placeholder-evento.jpg',
        estado: usuario.rol === 'admin' || usuario.rol === 'moderador' ? 'publicado' : 'pendiente',
        fechaCreacion: new Date().toISOString(),
        valoracion: 0,
        comentarios: 0,
        favoritos: 0,
        compartidos: 0,
        tags: datos.tags
      };

      setEventos(prev => [...prev, nuevoEvento]);
      return true;
    } catch (error) {
      console.error('Error al crear evento:', error);
      return false;
    }
  };

  const editarEvento = async (id: string, datos: Partial<EventoFormData>): Promise<boolean> => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      setEventos(prev => prev.map(evento => {
        if (evento.id === id) {
          return { ...evento, ...datos };
        }
        return evento;
      }));

      return true;
    } catch (error) {
      console.error('Error al editar evento:', error);
      return false;
    }
  };

  const eliminarEvento = async (id: string): Promise<boolean> => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300));

      setEventos(prev => prev.filter(evento => evento.id !== id));
      return true;
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      return false;
    }
  };

  const agregarFavorito = (eventoId: string) => {
    if (!favoritos.includes(eventoId)) {
      const nuevosFavoritos = [...favoritos, eventoId];
      guardarFavoritos(nuevosFavoritos);
      
      // Actualizar contador de favoritos del evento
      setEventos(prev => prev.map(evento => {
        if (evento.id === eventoId) {
          return { ...evento, favoritos: evento.favoritos + 1 };
        }
        return evento;
      }));
    }
  };

  const removerFavorito = (eventoId: string) => {
    const nuevosFavoritos = favoritos.filter(id => id !== eventoId);
    guardarFavoritos(nuevosFavoritos);
    
    // Actualizar contador de favoritos del evento
    setEventos(prev => prev.map(evento => {
      if (evento.id === eventoId) {
        return { ...evento, favoritos: Math.max(0, evento.favoritos - 1) };
      }
      return evento;
    }));
  };

  const esFavorito = (eventoId: string): boolean => {
    return favoritos.includes(eventoId);
  };

  const obtenerCategorias = (): CategoriaEvento[] => {
    return [
      'Festivales y celebraciones',
      'Música y danza',
      'Arte y exposiciones',
      'Gastronomía',
      'Talleres y educación',
      'Turismo cultural',
      'Eventos familiares',
      'Eventos gratuitos'
    ];
  };

  const obtenerEventosPorCategoria = (categoria: CategoriaEvento): Evento[] => {
    return eventos.filter(evento => evento.categoria === categoria);
  };

  const obtenerEstadisticas = () => {
    const hoy = new Date();
    const eventosProximos = eventos.filter(evento => new Date(evento.fecha) >= hoy).length;
    
    const eventosPorCategoria = eventos.reduce((acc, evento) => {
      acc[evento.categoria] = (acc[evento.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEventos: eventos.length,
      eventosPorCategoria,
      eventosProximos
    };
  };

  const valor: EventosContextType = {
    eventos,
    eventosFiltrados,
    eventosDestacados,
    cargando,
    error,
    filtros,
    favoritos,
    busqueda,
    setBusqueda,
    setFiltros,
    limpiarFiltros,
    obtenerEvento,
    crearEvento,
    editarEvento,
    eliminarEvento,
    agregarFavorito,
    removerFavorito,
    esFavorito,
    obtenerCategorias,
    obtenerEventosPorCategoria,
    obtenerEstadisticas
  };

  return (
    <EventosContext.Provider value={valor}>
      {children}
    </EventosContext.Provider>
  );
};

export const useEventos = (): EventosContextType => {
  const context = useContext(EventosContext);
  if (!context) {
    throw new Error('useEventos debe usarse dentro de un EventosProvider');
  }
  return context;
};

export default EventosProvider;
