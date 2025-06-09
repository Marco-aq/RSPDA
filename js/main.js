// Plataforma Móvil para la Difusión de Eventos Culturales en Cusco
// Universidad Andina del Cusco - JavaScript Interactivo

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling para navegación
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Animaciones al hacer scroll
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observar elementos para animación
        document.querySelectorAll('.card-hover, .fade-in').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    // Contador animado para estadísticas
    function initCounterAnimation() {
        const counters = [
            { element: document.querySelector('.counter-70'), target: 70, suffix: '%' },
            { element: document.querySelector('.counter-40'), target: 40, suffix: '%' },
            { element: document.querySelector('.counter-15k'), target: 15, suffix: 'K' },
            { element: document.querySelector('.counter-95'), target: 95, suffix: '%' }
        ];

        function animateCounter(counter) {
            if (!counter.element) return;
            
            let current = 0;
            const increment = counter.target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= counter.target) {
                    current = counter.target;
                    clearInterval(timer);
                }
                counter.element.textContent = Math.floor(current) + counter.suffix;
            }, 40);
        }

        // Observar cuando los contadores entran en vista
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = counters.find(c => c.element === entry.target);
                    if (counter) {
                        animateCounter(counter);
                        counterObserver.unobserve(entry.target);
                    }
                }
            });
        });

        counters.forEach(counter => {
            if (counter.element) {
                counterObserver.observe(counter.element);
            }
        });
    }

    // Efecto parallax suave para el hero
    function initParallaxEffect() {
        const hero = document.querySelector('.hero-pattern');
        if (hero) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            });
        }
    }

    // Información interactiva de tecnologías
    function initTechInfo() {
        const techCards = document.querySelectorAll('.tech-card');
        
        const techDetails = {
            flutter: {
                title: 'Flutter',
                description: 'Framework de Google para desarrollo multiplataforma con una sola base de código.',
                benefits: ['Rendimiento nativo', 'Hot reload', 'UI consistente', 'Desarrollo rápido']
            },
            nodejs: {
                title: 'Node.js',
                description: 'Entorno de ejecución JavaScript del lado del servidor, escalable y eficiente.',
                benefits: ['Alta concurrencia', 'Ecosystem NPM', 'JavaScript unificado', 'APIs REST']
            },
            firebase: {
                title: 'Firebase',
                description: 'Plataforma de Google para desarrollo de aplicaciones con servicios en la nube.',
                benefits: ['Base de datos en tiempo real', 'Autenticación', 'Hosting', 'Analytics']
            }
        };

        techCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            });
        });
    }

    // Sistema de navegación inteligente
    function initSmartNavigation() {
        const sections = document.querySelectorAll('section');
        const navItems = [];

        // Crear navegación flotante
        const nav = document.createElement('nav');
        nav.className = 'fixed right-4 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block';
        nav.innerHTML = `
            <div class="bg-white rounded-full shadow-lg p-2 space-y-2">
                <div class="nav-dot w-3 h-3 rounded-full bg-gray-300 cursor-pointer transition-all" data-section="0"></div>
                <div class="nav-dot w-3 h-3 rounded-full bg-gray-300 cursor-pointer transition-all" data-section="1"></div>
                <div class="nav-dot w-3 h-3 rounded-full bg-gray-300 cursor-pointer transition-all" data-section="2"></div>
                <div class="nav-dot w-3 h-3 rounded-full bg-gray-300 cursor-pointer transition-all" data-section="3"></div>
                <div class="nav-dot w-3 h-3 rounded-full bg-gray-300 cursor-pointer transition-all" data-section="4"></div>
            </div>
        `;
        document.body.appendChild(nav);

        const navDots = nav.querySelectorAll('.nav-dot');
        
        // Scroll to section al hacer clic
        navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                sections[index].scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Actualizar navegación activa al hacer scroll
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - 200) {
                    current = index;
                }
            });

            navDots.forEach((dot, index) => {
                dot.classList.remove('bg-blue-500');
                dot.classList.add('bg-gray-300');
                if (index === current) {
                    dot.classList.remove('bg-gray-300');
                    dot.classList.add('bg-blue-500');
                }
            });
        });
    }

    // Simulador de datos en tiempo real
    function initLiveDataSimulation() {
        const liveElements = document.querySelectorAll('.live-data');
        
        setInterval(() => {
            liveElements.forEach(element => {
                const currentValue = parseInt(element.textContent);
                const variation = Math.random() * 2 - 1; // -1 a 1
                const newValue = Math.max(0, currentValue + Math.floor(variation));
                element.textContent = newValue;
                
                // Efecto visual de actualización
                element.style.color = '#fbbf24';
                setTimeout(() => {
                    element.style.color = '';
                }, 500);
            });
        }, 5000);
    }

    // Información contextual al hover
    function initContextualInfo() {
        const infoElements = document.querySelectorAll('[data-info]');
        
        infoElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const info = this.getAttribute('data-info');
                if (info) {
                    showTooltip(this, info);
                }
            });

            element.addEventListener('mouseleave', function() {
                hideTooltip();
            });
        });
    }

    function showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'fixed bg-gray-800 text-white p-2 rounded shadow-lg text-sm z-50 max-w-xs';
        tooltip.style.pointerEvents = 'none';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        
        // Guardar referencia para poder eliminarlo
        element._tooltip = tooltip;
    }

    function hideTooltip() {
        const tooltips = document.querySelectorAll('.fixed.bg-gray-800');
        tooltips.forEach(tooltip => tooltip.remove());
    }

    // Modo oscuro toggle
    function initDarkModeToggle() {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg z-50 hover:bg-gray-700 transition-all';
        toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
        toggleButton.title = 'Alternar modo oscuro';
        
        toggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            toggleButton.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('darkMode', isDark);
        });

        // Verificar preferencia guardada
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark');
            toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
        }

        document.body.appendChild(toggleButton);
    }

    // Formulario de contacto simulado
    function initContactForm() {
        const contactButtons = document.querySelectorAll('.contact-btn');
        
        contactButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                showContactModal();
            });
        });
    }

    function showContactModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h3 class="text-2xl font-bold academic-blue mb-4">Contactar al Equipo</h3>
                <p class="text-gray-600 mb-6">Para más información sobre este proyecto de investigación:</p>
                <div class="space-y-4">
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-envelope cusco-gold"></i>
                        <span>sistemas@uandina.edu.pe</span>
                    </div>
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-phone cusco-gold"></i>
                        <span>+51 (84) 604040</span>
                    </div>
                    <div class="flex items-center space-x-3">
                        <i class="fas fa-map-marker-alt cusco-gold"></i>
                        <span>Universidad Andina del Cusco</span>
                    </div>
                </div>
                <button class="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors" onclick="this.parentElement.parentElement.remove()">
                    Cerrar
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar al hacer clic fuera del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Carga progresiva de imágenes
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.classList.remove('opacity-0');
                    img.classList.add('opacity-100');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.classList.add('opacity-0', 'transition-opacity', 'duration-300');
            imageObserver.observe(img);
        });
    }

    // Analytics simulados
    function initAnalytics() {
        const sections = document.querySelectorAll('section');
        const analytics = {
            pageViews: 1,
            timeOnSite: 0,
            sectionsViewed: new Set()
        };

        // Rastrear tiempo en sitio
        setInterval(() => {
            analytics.timeOnSite += 1;
        }, 1000);

        // Rastrear secciones vistas
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    analytics.sectionsViewed.add(entry.target.id || entry.target.className);
                }
            });
        });

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

        // Log analytics al salir
        window.addEventListener('beforeunload', () => {
            console.log('Analytics:', analytics);
        });
    }

    // Inicializar todas las funcionalidades
    function init() {
        initSmoothScrolling();
        initScrollAnimations();
        initCounterAnimation();
        initParallaxEffect();
        initTechInfo();
        initSmartNavigation();
        initLiveDataSimulation();
        initContextualInfo();
        initDarkModeToggle();
        initContactForm();
        initLazyLoading();
        initAnalytics();
        
        console.log('🎉 Plataforma Móvil para Eventos Culturales - Cusco iniciada correctamente');
        console.log('📱 Universidad Andina del Cusco - Ingeniería de Sistemas');
    }

    // Ejecutar inicialización
    init();

    // Mensaje de bienvenida
    setTimeout(() => {
        console.log(`
        🏛️ UNIVERSIDAD ANDINA DEL CUSCO
        📱 Plataforma Móvil para la Difusión de Eventos Culturales en Cusco
        
        👨‍🎓 Integrantes:
        • Baca Vivanco Sergio Sebastian
        • Socualaya Olivera Dante Joel  
        • Tresierra Zamora Diego Andres
        • Villafuerte Andrade Justo Cristobher
        
        👩‍🏫 Docente: Ing. Paula Benancia Sernaque Fernández
        📚 Curso: Metodología de la Investigación en Ingeniería
        📅 Semestre: 2025-1
        
        ✨ ¡Gracias por visitar nuestra propuesta de investigación!
        `);
    }, 2000);
});

// Utilidades globales
window.EventosCulturalesCusco = {
    version: '1.0.0',
    universidad: 'Universidad Andina del Cusco',
    facultad: 'Ingeniería y Arquitectura',
    escuela: 'Ingeniería de Sistemas',
    proyecto: 'Plataforma Móvil para la Difusión de Eventos Culturales en Cusco',
    
    showMessage: function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transform transition-all duration-300 translate-x-full ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
        }`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    
    downloadPropuesta: function() {
        this.showMessage('La propuesta completa está disponible para descarga', 'success');
        // Simular descarga
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'Propuesta_Plataforma_Movil_Eventos_Culturales_Cusco.pdf';
        link.click();
    }
};
