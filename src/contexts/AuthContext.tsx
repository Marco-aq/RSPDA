import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, RolUsuario } from '../types';
import { localStorageKeys } from '../config/app';

interface AuthContextType {
  usuario: Usuario | null;
  autenticado: boolean;
  cargando: boolean;
  iniciarSesion: (email: string, password: string) => Promise<boolean>;
  registrarse: (datosUsuario: DatosRegistro) => Promise<boolean>;
  cerrarSesion: () => void;
  actualizarPerfil: (datos: Partial<Usuario>) => Promise<boolean>;
  cambiarRol: (nuevoRol: RolUsuario) => void;
  esAdmin: () => boolean;
  esModerador: () => boolean;
  esOrganizador: () => boolean;
}

interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  ciudad?: string;
  rol: RolUsuario;
  intereses: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Usuarios mock para simulación
const usuariosMock: Usuario[] = [
  {
    id: '1',
    nombre: 'Carlos Quispe Onofre',
    email: 'admin@eventoscusco.com',
    rol: 'admin',
    intereses: ['Música y danza', 'Arte y exposiciones'],
    fechaRegistro: '2025-01-01',
    ciudad: 'Cusco',
    telefono: '+51987654321',
    configuracion: {
      idioma: 'es',
      notificaciones: {
        email: true,
        push: true,
        nuevosEventos: true,
        recordatorios: true
      },
      privacidad: {
        perfilPublico: true,
        mostrarEventosAsistidos: true
      }
    },
    eventosCreados: [],
    eventosFavoritos: [],
    eventosAsistidos: []
  },
  {
    id: '2',
    nombre: 'Ana García Pérez',
    email: 'moderador@eventoscusco.com',
    rol: 'moderador',
    intereses: ['Festivales y celebraciones', 'Gastronomía'],
    fechaRegistro: '2025-01-05',
    ciudad: 'Cusco',
    configuracion: {
      idioma: 'es',
      notificaciones: {
        email: true,
        push: false,
        nuevosEventos: true,
        recordatorios: true
      },
      privacidad: {
        perfilPublico: true,
        mostrarEventosAsistidos: false
      }
    },
    eventosCreados: [],
    eventosFavoritos: [],
    eventosAsistidos: []
  },
  {
    id: '3',
    nombre: 'Luis Mamani Quispe',
    email: 'organizador@eventoscusco.com',
    rol: 'organizador',
    intereses: ['Talleres y educación', 'Turismo cultural'],
    fechaRegistro: '2025-01-10',
    ciudad: 'Cusco',
    configuracion: {
      idioma: 'qu',
      notificaciones: {
        email: true,
        push: true,
        nuevosEventos: false,
        recordatorios: true
      },
      privacidad: {
        perfilPublico: true,
        mostrarEventosAsistidos: true
      }
    },
    eventosCreados: ['1', '7'],
    eventosFavoritos: ['2', '3'],
    eventosAsistidos: ['1', '2', '3']
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  // Verificar sesión existente al cargar
  useEffect(() => {
    verificarSesionExistente();
  }, []);

  const verificarSesionExistente = () => {
    try {
      const usuarioGuardado = localStorage.getItem(localStorageKeys.user);
      if (usuarioGuardado) {
        const datosUsuario = JSON.parse(usuarioGuardado);
        // Verificar que el usuario existe en nuestro mock
        const usuarioValido = usuariosMock.find(u => u.id === datosUsuario.id);
        if (usuarioValido) {
          setUsuario({...usuarioValido, ...datosUsuario});
        } else {
          localStorage.removeItem(localStorageKeys.user);
        }
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      localStorage.removeItem(localStorageKeys.user);
    } finally {
      setCargando(false);
    }
  };

  const iniciarSesion = async (email: string, password: string): Promise<boolean> => {
    try {
      setCargando(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Buscar usuario en mock
      const usuarioEncontrado = usuariosMock.find(u => u.email === email);
      
      if (usuarioEncontrado && (password === 'password' || password === '123456')) {
        setUsuario(usuarioEncontrado);
        localStorage.setItem(localStorageKeys.user, JSON.stringify(usuarioEncontrado));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    } finally {
      setCargando(false);
    }
  };

  const registrarse = async (datosUsuario: DatosRegistro): Promise<boolean> => {
    try {
      setCargando(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar si el email ya existe
      const emailExistente = usuariosMock.some(u => u.email === datosUsuario.email);
      if (emailExistente) {
        return false;
      }

      // Crear nuevo usuario
      const nuevoUsuario: Usuario = {
        id: Date.now().toString(),
        nombre: datosUsuario.nombre,
        email: datosUsuario.email,
        telefono: datosUsuario.telefono,
        ciudad: datosUsuario.ciudad || 'Cusco',
        rol: datosUsuario.rol,
        intereses: datosUsuario.intereses,
        fechaRegistro: new Date().toISOString(),
        configuracion: {
          idioma: 'es',
          notificaciones: {
            email: true,
            push: true,
            nuevosEventos: true,
            recordatorios: true
          },
          privacidad: {
            perfilPublico: true,
            mostrarEventosAsistidos: true
          }
        },
        eventosCreados: [],
        eventosFavoritos: [],
        eventosAsistidos: []
      };

      // Agregar a la lista mock
      usuariosMock.push(nuevoUsuario);
      
      // Iniciar sesión automáticamente
      setUsuario(nuevoUsuario);
      localStorage.setItem(localStorageKeys.user, JSON.stringify(nuevoUsuario));
      
      return true;
    } catch (error) {
      console.error('Error al registrarse:', error);
      return false;
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem(localStorageKeys.user);
  };

  const actualizarPerfil = async (datos: Partial<Usuario>): Promise<boolean> => {
    try {
      if (!usuario) return false;

      setCargando(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      const usuarioActualizado = { ...usuario, ...datos };
      setUsuario(usuarioActualizado);
      localStorage.setItem(localStorageKeys.user, JSON.stringify(usuarioActualizado));
      
      return true;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return false;
    } finally {
      setCargando(false);
    }
  };

  const cambiarRol = (nuevoRol: RolUsuario) => {
    if (usuario) {
      const usuarioActualizado = { ...usuario, rol: nuevoRol };
      setUsuario(usuarioActualizado);
      localStorage.setItem(localStorageKeys.user, JSON.stringify(usuarioActualizado));
    }
  };

  const esAdmin = (): boolean => usuario?.rol === 'admin';
  const esModerador = (): boolean => usuario?.rol === 'moderador' || esAdmin();
  const esOrganizador = (): boolean => usuario?.rol === 'organizador' || esModerador();

  const valor: AuthContextType = {
    usuario,
    autenticado: !!usuario,
    cargando,
    iniciarSesion,
    registrarse,
    cerrarSesion,
    actualizarPerfil,
    cambiarRol,
    esAdmin,
    esModerador,
    esOrganizador
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthProvider;
