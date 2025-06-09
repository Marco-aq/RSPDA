import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../contexts/IdiomaContext';
import { useEventos } from '../contexts/EventosContext';
import { Search, Calendar, MapPin, Star, Heart, ArrowRight, TrendingUp, Users, Clock } from 'lucide-react';
import { EventListSkeleton } from '../components/LoadingSpinner';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const { eventosDestacados, eventos, setBusqueda, setFiltros, cargando } = useEventos();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const categorias = [
    {
      name: 'Festivales',
      icon: '🎭',
      count: eventos.filter(e => e.categoria === 'Festivales y celebraciones').length,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Música y Danza',
      icon: '🎵',
      count: eventos.filter(e => e.categoria === 'Música y danza').length,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      name: 'Arte',
      icon: '🎨',
      count: eventos.filter(e => e.categoria === 'Arte y exposiciones').length,
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'Gastronomía',
      icon: '🍽️',
      count: eventos.filter(e => e.categoria === 'Gastronomía').length,
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Talleres',
      icon: '📚',
      count: eventos.filter(e => e.categoria === 'Talleres y educación').length,
      color: 'from-amber-500 to-yellow-500'
    },
    {
      name: 'Turismo',
      icon: '🏛️',
      count: eventos.filter(e => e.categoria === 'Turismo cultural').length,
      color: 'from-emerald-500 to-green-500'
    }
  ];

  const estadisticas = [
    {
      titulo: 'Eventos Activos',
      valor: eventos.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      titulo: 'Ubicaciones',
      valor: new Set(eventos.map(e => e.ubicacion.nombre)).size,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      titulo: 'Organizadores',
      valor: new Set(eventos.map(e => e.organizador)).size,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      titulo: 'Este Mes',
      valor: eventos.filter(e => {
        const eventDate = new Date(e.fecha);
        const now = new Date();
        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
      }).length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setBusqueda(searchTerm);
      navigate('/explorar');
    }
  };

  const handleCategoryClick = (categoria: string) => {
    setFiltros({ categoria: categoria as any });
    navigate('/explorar');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-pink-600 text-white overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 pattern-inca opacity-20"></div>
        
        {/* Contenido principal */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto principal */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="block">{t('home.titulo')}</span>
                <span className="block text-amber-200 font-display">
                  Cultural
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-orange-100 leading-relaxed">
                {t('home.heroText')}
              </p>

              {/* Barra de búsqueda principal */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('home.buscarEventos')}
                      className="w-full pl-10 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>Buscar</span>
                  </button>
                </div>
              </form>

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/explorar"
                  className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{t('home.verTodos')}</span>
                </Link>
                <Link
                  to="/mapa"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Ver en Mapa</span>
                </Link>
              </div>
            </div>

            {/* Imagen destacada */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/images/plaza-armas-cusco.jpg"
                  alt="Plaza de Armas del Cusco"
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
              </div>
              {/* Elementos decorativos */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-400/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Estadísticas rápidas */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {estadisticas.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.titulo} className="text-center">
                  <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.valor}</div>
                  <div className="text-sm text-gray-600">{stat.titulo}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categorías de eventos */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.categorias')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explora eventos por categoría y descubre la diversidad cultural de Cusco
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categorias.map((categoria) => (
              <button
                key={categoria.name}
                onClick={() => handleCategoryClick(categoria.name)}
                className="group card p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${categoria.color} rounded-full flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {categoria.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {categoria.name}
                </h3>
                <span className="text-sm text-gray-500">
                  {categoria.count} eventos
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Eventos destacados */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('home.eventosDestacados')}
              </h2>
              <p className="text-xl text-gray-600">
                Los eventos más populares y mejor valorados
              </p>
            </div>
            <Link
              to="/explorar"
              className="hidden sm:flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors"
            >
              <span>{t('home.verTodos')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {cargando ? (
            <EventListSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventosDestacados.slice(0, 6).map((evento) => (
                <Link
                  key={evento.id}
                  to={`/evento/${evento.id}`}
                  className="group card overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={evento.imagen}
                      alt={evento.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {evento.categoria.split(' ')[0]}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {evento.titulo}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {evento.descripcion}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{new Date(evento.fecha).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{evento.ubicacion.nombre}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">
                          {evento.valoracion}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({evento.comentarios})
                        </span>
                      </div>
                      <span className={`text-sm font-semibold ${
                        evento.precio.toLowerCase().includes('gratuito') 
                          ? 'text-green-600' 
                          : 'text-orange-600'
                      }`}>
                        {evento.precio}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/explorar"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Ver Todos los Eventos</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Organizas eventos culturales?
          </h2>
          <p className="text-xl mb-8 text-orange-100 max-w-2xl mx-auto">
            Únete a nuestra plataforma y comparte la riqueza cultural de Cusco con el mundo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/registro"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors duration-300"
            >
              Registrarse como Organizador
            </Link>
            <Link
              to="/publicar"
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-300"
            >
              Publicar Evento
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
