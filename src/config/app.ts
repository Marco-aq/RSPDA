import { ConfiguracionApp } from '../types';

export const config: ConfiguracionApp = {
  nombre: 'Eventos Culturales Cusco',
  version: '1.0.0',
  autor: 'Paucar Curasco Rodrigo, Villafuerte Andrade Justo Cristobher, Cardenas Quispe Marco Antonio',
  universidad: 'Universidad Andina del Cusco',
  curso: 'PLATAFORMAS PARA EL DESARROLLO DE APLICACIONES',
  apiKey: {
    googleMaps: 'AIzaSyBWXNE96Eb23e16DCw7Zfb9rkYwxRiTUfQ'
  },
  limitesApp: {
    maxEventosPorUsuario: 50,
    maxImagenSize: 5 * 1024 * 1024, // 5MB
    maxComentarioLength: 500
  }
};

// Configuración de Google Maps
export const googleMapsConfig = {
  apiKey: config.apiKey.googleMaps,
  libraries: ['places', 'geometry'] as const,
  region: 'PE',
  language: 'es',
  center: {
    lat: -13.5164,
    lng: -71.9784
  },
  zoom: 13,
  mapOptions: {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    mapTypeControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'on' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  }
};

// Colores tema cusqueño
export const temaColores = {
  primary: {
    50: '#FEF7ED',
    100: '#FDEDD3',
    200: '#FAD7A6',
    300: '#F6BC6E',
    400: '#F1974E',
    500: '#EB7014', // Naranja terracota principal
    600: '#DC5F0B',
    700: '#B7460C',
    800: '#943912',
    900: '#792F12'
  },
  secondary: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899', // Rosa andino
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843'
  },
  accent: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B', // Oro inca
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F'
  },
  neutral: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917'
  }
};

// Patrones geométricos incas
export const patronesIncas = {
  chakana: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L14 10H22L16 14L18 22L12 18L6 22L8 14L2 10H10L12 2Z"/>
  </svg>`,
  escalon: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M2 2H8V8H14V14H20V20H2V2Z"/>
  </svg>`,
  rombo: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L22 12L12 22L2 12L12 2Z"/>
  </svg>`
};

// URLs de servicios mock
export const apiEndpoints = {
  eventos: '/data/eventos.json',
  ubicaciones: '/data/ubicaciones.json',
  traducciones: '/data/traducciones.json'
};

// Configuración de local storage
export const localStorageKeys = {
  user: 'eventos_cusco_user',
  favorites: 'eventos_cusco_favorites',
  language: 'eventos_cusco_language',
  theme: 'eventos_cusco_theme',
  filters: 'eventos_cusco_filters',
  visited: 'eventos_cusco_visited'
};

// Configuración de notificaciones
export const notificacionConfig = {
  duracion: 5000,
  posicion: 'top-right' as const,
  maxNotificaciones: 5
};

// Validaciones
export const validaciones = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefono: /^(\+51)?[0-9]{9}$/,
  password: {
    minLength: 8,
    requireNumber: true,
    requireSpecialChar: false
  },
  evento: {
    tituloMinLength: 10,
    descripcionMinLength: 50,
    maxTags: 10
  }
};

export default config;
