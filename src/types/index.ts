export interface Evento {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  ubicacion: Ubicacion;
  categoria: CategoriaEvento;
  tipo: TipoEvento;
  precio: string;
  organizador: string;
  idiomas: string[];
  publicoObjetivo: string[];
  imagen: string;
  estado: EstadoEvento;
  fechaCreacion: string;
  valoracion: number;
  comentarios: number;
  favoritos: number;
  compartidos: number;
  tags: string[];
}

export interface Ubicacion {
  nombre: string;
  direccion: string;
  lat: number;
  lng: number;
  distrito?: string;
  categoria?: string;
  capacidad?: number;
  servicios?: string[];
  accesibilidad?: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  ciudad?: string;
  rol: RolUsuario;
  intereses: string[];
  fechaRegistro: string;
  avatar?: string;
  eventosCreados?: string[];
  eventosFavoritos?: string[];
  eventosAsistidos?: string[];
  configuracion: ConfiguracionUsuario;
}

export interface ConfiguracionUsuario {
  idioma: 'es' | 'en' | 'qu';
  notificaciones: {
    email: boolean;
    push: boolean;
    nuevosEventos: boolean;
    recordatorios: boolean;
  };
  privacidad: {
    perfilPublico: boolean;
    mostrarEventosAsistidos: boolean;
  };
}

export interface Comentario {
  id: string;
  eventoId: string;
  usuarioId: string;
  nombreUsuario: string;
  avatar?: string;
  contenido: string;
  valoracion: number;
  fecha: string;
  respuestas?: Comentario[];
  likes: number;
  reportado: boolean;
}

export interface Filtros {
  categoria?: CategoriaEvento;
  fecha?: FiltroFecha;
  precio?: FiltroPrecio;
  ubicacion?: string;
  idioma?: string;
  publicoObjetivo?: string;
  ordenarPor?: OrdenEvento;
  busqueda?: string;
}

export type CategoriaEvento = 
  | 'Festivales y celebraciones'
  | 'Música y danza'
  | 'Arte y exposiciones'
  | 'Gastronomía'
  | 'Talleres y educación'
  | 'Turismo cultural'
  | 'Eventos familiares'
  | 'Eventos gratuitos';

export type TipoEvento =
  | 'Cultural'
  | 'Musical'
  | 'Gastronómico'
  | 'Artístico'
  | 'Educativo'
  | 'Espiritual'
  | 'Deportivo';

export type EstadoEvento =
  | 'borrador'
  | 'publicado'
  | 'finalizado'
  | 'cancelado'
  | 'pendiente';

export type RolUsuario =
  | 'visitante'
  | 'usuario'
  | 'organizador'
  | 'moderador'
  | 'admin';

export type FiltroFecha =
  | 'hoy'
  | 'esta-semana'
  | 'este-mes'
  | 'personalizado';

export type FiltroPrecio =
  | 'gratuito'
  | 'pagado'
  | 'todos';

export type OrdenEvento =
  | 'fecha'
  | 'popularidad'
  | 'cercanía'
  | 'valoracion'
  | 'reciente';

export type Idioma = 'es' | 'en' | 'qu';

export interface EstadisticasAdmin {
  totalEventos: number;
  totalUsuarios: number;
  eventosPorCategoria: Record<CategoriaEvento, number>;
  usuariosPorMes: Array<{ mes: string; usuarios: number }>;
  eventosPorMes: Array<{ mes: string; eventos: number }>;
  eventosPopulares: Evento[];
  reportesRecientes: number;
}

export interface Notificacion {
  id: string;
  usuarioId: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  eventoId?: string;
  accion?: AccionNotificacion;
}

export type TipoNotificacion =
  | 'nuevo-evento'
  | 'recordatorio'
  | 'comentario'
  | 'favorito'
  | 'sistema';

export interface AccionNotificacion {
  tipo: 'ver-evento' | 'ir-perfil' | 'ir-configuracion';
  parametros?: Record<string, any>;
}

export interface EventoFormData {
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  ubicacion: {
    nombre: string;
    direccion: string;
    lat: number;
    lng: number;
  };
  categoria: CategoriaEvento;
  tipo: TipoEvento;
  precio: string;
  idiomas: string[];
  publicoObjetivo: string[];
  imagen?: File;
  tags: string[];
}

export interface MapaProps {
  eventos: Evento[];
  centro?: { lat: number; lng: number };
  zoom?: number;
  onEventoClick?: (evento: Evento) => void;
  mostrarControles?: boolean;
  altura?: string;
}

export interface CalendarioEventos {
  [fecha: string]: Evento[];
}

export interface RespuestaAPI<T> {
  success: boolean;
  data?: T;
  error?: string;
  mensaje?: string;
}

export interface ConfiguracionApp {
  nombre: string;
  version: string;
  autor: string;
  universidad: string;
  curso: string;
  apiKey: {
    googleMaps: string;
  };
  limitesApp: {
    maxEventosPorUsuario: number;
    maxImagenSize: number;
    maxComentarioLength: number;
  };
}
