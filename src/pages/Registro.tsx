import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/IdiomaContext';
import { useNotifications } from '../components/NotificationContainer';
import { User, Mail, Lock, Phone, MapPin, ArrowLeft, UserPlus } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RolUsuario } from '../types';

export const Registro: React.FC = () => {
  const { registrarse } = useAuth();
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: '',
    telefono: '',
    ciudad: 'Cusco',
    rol: 'usuario' as RolUsuario,
    intereses: [] as string[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const interesesDisponibles = [
    'Festivales y celebraciones',
    'Música y danza',
    'Arte y exposiciones',
    'Gastronomía',
    'Talleres y educación',
    'Turismo cultural'
  ];

  const roles = [
    { value: 'usuario', label: 'Visitante/Usuario', description: 'Explorar y asistir a eventos' },
    { value: 'organizador', label: 'Organizador de Eventos', description: 'Crear y gestionar eventos culturales' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (formData.password !== formData.confirmarPassword) {
      newErrors.confirmarPassword = 'Las contraseñas no coinciden';
    }

    if (formData.intereses.length === 0) {
      newErrors.intereses = 'Selecciona al menos un interés cultural';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const success = await registrarse({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        rol: formData.rol,
        intereses: formData.intereses
      });

      if (success) {
        showSuccess(
          '¡Registro exitoso!',
          'Tu cuenta ha sido creada. Bienvenido a Eventos Culturales Cusco.'
        );
        navigate('/');
      } else {
        showError(
          'Error en el registro',
          'El correo electrónico ya está registrado o ocurrió un error.'
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

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleInteresChange = (interes: string) => {
    const nuevosIntereses = formData.intereses.includes(interes)
      ? formData.intereses.filter(i => i !== interes)
      : [...formData.intereses, interes];
    
    handleInputChange('intereses', nuevosIntereses);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al inicio</span>
          </Link>
          
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Cuenta
          </h2>
          <p className="text-gray-600">
            Únete a la comunidad cultural de Cusco
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-8">
            {/* Información personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="nombre" className="form-label">
                  Nombre completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    placeholder="Tu nombre completo"
                    className={`form-input pl-10 ${errors.nombre ? 'border-red-300' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.nombre && <p className="form-error">{errors.nombre}</p>}
              </div>

              <div>
                <label htmlFor="email" className="form-label">
                  Correo electrónico *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="tu@correo.com"
                    className={`form-input pl-10 ${errors.email ? 'border-red-300' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="password" className="form-label">
                  Contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className={`form-input pl-10 ${errors.password ? 'border-red-300' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmarPassword" className="form-label">
                  Confirmar contraseña *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmarPassword"
                    type="password"
                    value={formData.confirmarPassword}
                    onChange={(e) => handleInputChange('confirmarPassword', e.target.value)}
                    placeholder="Repite tu contraseña"
                    className={`form-input pl-10 ${errors.confirmarPassword ? 'border-red-300' : ''}`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.confirmarPassword && <p className="form-error">{errors.confirmarPassword}</p>}
              </div>
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="telefono" className="form-label">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    placeholder="+51 987 654 321"
                    className="form-input pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="ciudad" className="form-label">
                  Ciudad
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="ciudad"
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => handleInputChange('ciudad', e.target.value)}
                    placeholder="Tu ciudad"
                    className="form-input pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Tipo de usuario */}
            <div className="mb-6">
              <label className="form-label">Tipo de cuenta *</label>
              <div className="space-y-3">
                {roles.map((rol) => (
                  <label key={rol.value} className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="rol"
                      value={rol.value}
                      checked={formData.rol === rol.value}
                      onChange={(e) => handleInputChange('rol', e.target.value)}
                      className="mt-1 text-orange-500 focus:ring-orange-500"
                      disabled={isSubmitting}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rol.label}</div>
                      <div className="text-sm text-gray-500">{rol.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Intereses culturales */}
            <div className="mb-6">
              <label className="form-label">Intereses culturales *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interesesDisponibles.map((interes) => (
                  <label key={interes} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.intereses.includes(interes)}
                      onChange={() => handleInteresChange(interes)}
                      className="text-orange-500 focus:ring-orange-500 rounded"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-gray-700">{interes}</span>
                  </label>
                ))}
              </div>
              {errors.intereses && <p className="form-error">{errors.intereses}</p>}
            </div>

            {/* Términos y condiciones */}
            <div className="mb-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 text-orange-500 focus:ring-orange-500 rounded"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-gray-700">
                  Acepto los{' '}
                  <Link to="/terminos" className="text-orange-600 hover:text-orange-700 underline">
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link to="/privacidad" className="text-orange-600 hover:text-orange-700 underline">
                    política de privacidad
                  </Link>
                </span>
              </label>
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Crear Cuenta</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Enlaces adicionales */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
