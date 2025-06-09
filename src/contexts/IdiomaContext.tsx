import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Idioma } from '../types';
import { localStorageKeys } from '../config/app';

interface IdiomaContextType {
  idioma: Idioma;
  traducciones: Record<string, any>;
  cambiarIdioma: (nuevoIdioma: Idioma) => void;
  t: (clave: string, params?: Record<string, string>) => string;
  cargando: boolean;
}

const IdiomaContext = createContext<IdiomaContextType | undefined>(undefined);

interface IdiomaProviderProps {
  children: ReactNode;
}

export const IdiomaProvider: React.FC<IdiomaProviderProps> = ({ children }) => {
  const [idioma, setIdioma] = useState<Idioma>('es');
  const [traducciones, setTraducciones] = useState<Record<string, any>>({});
  const [cargando, setCargando] = useState(true);

  // Cargar traducciones al inicializar
  useEffect(() => {
    cargarTraducciones();
  }, []);

  // Cargar idioma desde localStorage al inicializar
  useEffect(() => {
    const idiomaGuardado = localStorage.getItem(localStorageKeys.language) as Idioma;
    if (idiomaGuardado && ['es', 'en', 'qu'].includes(idiomaGuardado)) {
      setIdioma(idiomaGuardado);
    } else {
      // Detectar idioma del navegador como fallback
      const idiomaNavegador = navigator.language.split('-')[0];
      if (idiomaNavegador === 'en') {
        setIdioma('en');
      } else {
        setIdioma('es'); // Español por defecto
      }
    }
  }, []);

  const cargarTraducciones = async () => {
    try {
      setCargando(true);
      const response = await fetch('/data/traducciones.json');
      if (response.ok) {
        const data = await response.json();
        setTraducciones(data);
      } else {
        console.error('Error al cargar traducciones');
      }
    } catch (error) {
      console.error('Error al cargar traducciones:', error);
    } finally {
      setCargando(false);
    }
  };

  const cambiarIdioma = (nuevoIdioma: Idioma) => {
    setIdioma(nuevoIdioma);
    localStorage.setItem(localStorageKeys.language, nuevoIdioma);
  };

  // Función para obtener traducción por clave con interpolación
  const t = (clave: string, params?: Record<string, string>): string => {
    try {
      const claves = clave.split('.');
      let traduccion = traducciones[idioma];
      
      for (const key of claves) {
        if (traduccion && typeof traduccion === 'object') {
          traduccion = traduccion[key];
        } else {
          // Si no encuentra la traducción, intentar en español como fallback
          traduccion = traducciones['es'];
          for (const key of claves) {
            if (traduccion && typeof traduccion === 'object') {
              traduccion = traduccion[key];
            } else {
              return clave; // Retornar la clave si no encuentra traducción
            }
          }
          break;
        }
      }

      if (typeof traduccion === 'string') {
        // Interpolación de parámetros
        if (params) {
          return traduccion.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] || match;
          });
        }
        return traduccion;
      }

      return clave;
    } catch (error) {
      console.error('Error al obtener traducción:', error);
      return clave;
    }
  };

  const valor: IdiomaContextType = {
    idioma,
    traducciones,
    cambiarIdioma,
    t,
    cargando
  };

  return (
    <IdiomaContext.Provider value={valor}>
      {children}
    </IdiomaContext.Provider>
  );
};

export const useIdioma = (): IdiomaContextType => {
  const context = useContext(IdiomaContext);
  if (!context) {
    throw new Error('useIdioma debe usarse dentro de un IdiomaProvider');
  }
  return context;
};

// Hook para obtener traducciones de manera más simple
export const useTranslation = () => {
  const { t } = useIdioma();
  return { t };
};

export default IdiomaProvider;
