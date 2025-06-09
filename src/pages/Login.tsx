import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/IdiomaContext';
import { useNotifications } from '../components/NotificationContainer';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Login: React.FC = () => {
  const { iniciarSesion, autenticado, cargando } = useAuth();
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (autenticado && !cargando) {
      const from = (location.state as any)?.from || '/';
      navigate(from, { replace: true });
    }
  }, [autenticado, cargando, navigate, location]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await iniciarSesion(formData.email, formData.password);
      
      if (success) {
        showSuccess('¡Bienvenido!', 'Has iniciado sesión correctamente');
        const from = (location.state as any)?.from || '/';
        navigate(from, { replace: true });
      } else {
        showError(
          'Error de autenticación',
          'Correo electrónico o contraseña incorrectos'
        );
      }
    } catch (error) {
      showError(
        'Error del sistema',
        'Ocurrió un error inesperado. Por favor, intenta nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Datos de usuario de prueba para mostrar al usuario
  const cuentasPrueba = [
    { email: 'admin@eventoscusco.com', password: 'password', rol: 'Administrador' },
    { email: 'moderador@eventoscusco.com', password: 'password', rol: 'Moderador' },
    { email: 'organizador@eventoscusco.com', password: 'password', rol: 'Organizador' },
  ];

  const loginConCuentaPrueba = (email: string, password: string) => {
    setFormData({ email, password });
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" text="Verificando sesión..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al inicio</span>
          </Link>
          
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L14 10H22L16 14L18 22L12 18L6 22L8 14L2 10H10L12 2Z"/>
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('auth.iniciarSesion')}
          </h2>
          <p className="text-gray-600">
            Accede a tu cuenta para gestionar eventos culturales
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="card p-8">
            {/* Campo de email */}
            <div className="mb-6">
              <label htmlFor="email" className="form-label">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="tu@correo.com"
                  className={`form-input pl-10 ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            {/* Campo de contraseña */}
            <div className="mb-6">
              <label htmlFor="password" className="form-label">
                {t('auth.contrasena')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Tu contraseña"
                  className={`form-input pl-10 pr-10 ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="form-error">{errors.password}</p>
              )}
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>{t('auth.iniciarSesion')}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Enlaces adicionales */}
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link
              to="/registro"
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
          
          <Link
            to="/recuperar-password"
            className="text-sm text-gray-500 hover:text-orange-600 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Cuentas de prueba */}
        <div className="card p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 text-center">
            Cuentas de Prueba
          </h3>
          <div className="space-y-3">
            {cuentasPrueba.map((cuenta, index) => (
              <button
                key={index}
                onClick={() => loginConCuentaPrueba(cuenta.email, cuenta.password)}
                className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                disabled={isSubmitting}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{cuenta.rol}</p>
                    <p className="text-xs text-gray-500">{cuenta.email}</p>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">
                    Usar cuenta
                  </span>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-blue-700 mt-3 text-center">
            Contraseña para todas: <code className="bg-blue-100 px-1 rounded">password</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
