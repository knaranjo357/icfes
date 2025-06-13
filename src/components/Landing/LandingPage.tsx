import React from 'react';
import { BookOpen, Star, TrendingUp, Users, Award, CheckCircle, ArrowRight, Play, Target, Zap, Shield } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Target className="h-8 w-8 text-blue-600" />,
      title: "Exámenes Personalizados",
      description: "Pruebas adaptadas a tu nivel con retroalimentación instantánea y explicaciones detalladas."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Seguimiento Inteligente",
      description: "Análisis avanzado de tu progreso con insights para mejorar tu rendimiento."
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: "Resultados Rápidos",
      description: "Obtén calificaciones inmediatas y identifica áreas de mejora al instante."
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Contenido Validado",
      description: "Material desarrollado por expertos siguiendo los estándares oficiales del ICFES."
    }
  ];

  const subjects = [
    { name: "Matemáticas", color: "bg-blue-500", students: "15,420" },
    { name: "Ciencias Naturales", color: "bg-green-500", students: "12,380" },
    { name: "Sociales y Ciudadanas", color: "bg-orange-500", students: "11,250" },
    { name: "Lectura Crítica", color: "bg-purple-500", students: "14,680" },
    { name: "Inglés", color: "bg-indigo-500", students: "9,340" }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Estudiante de 11°",
      content: "Gracias a ALLIASOFT mejorè mi puntaje en 40 puntos. La plataforma es increíble.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    {
      name: "Carlos Rodríguez",
      role: "Egresado 2024",
      content: "La mejor herramienta de preparación. Conseguí el puntaje que necesitaba para mi carrera.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    {
      name: "Ana Martínez",
      role: "Estudiante de 10°",
      content: "Me encanta cómo explican cada respuesta. Ahora entiendo mejor los temas.",
      rating: 5,
      avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-2 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent font-display">
                  ICFES ALLIASOFT
                </h1>
              </div>
            </div>
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Comenzar Ahora
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="h-4 w-4" />
                  <span>Plataforma #1 en Preparación ICFES</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight font-display">
                  Prepárate para el
                  <span className="bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent block">
                    ICFES
                  </span>
                  como un profesional
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed font-body">
                  La plataforma de preparación más avanzada de Colombia. Mejora tu puntaje con 
                  exámenes personalizados, análisis inteligente y contenido validado por expertos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onGetStarted}
                  className="group bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2"
                >
                  <span>Comenzar Gratis</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group flex items-center space-x-2 px-8 py-4 border-2 border-gray-200 hover:border-purple-300 text-gray-700 hover:text-purple-700 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-purple-50">
                  <Play className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Ver Demo</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600 font-body">Estudiantes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600 font-body">Satisfacción</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">+40pts</div>
                  <div className="text-sm text-gray-600 font-body">Mejora Promedio</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl blur-3xl opacity-20 transform rotate-6"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 font-display">Panel de Resultados</h3>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Excelente
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {subjects.map((subject, index) => (
                      <div key={subject.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 ${subject.color} rounded-full`}></div>
                          <span className="font-medium text-gray-900 font-body">{subject.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{85 + index * 3}%</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-gray-900 font-display">Puntaje Global</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">387 / 500</div>
                    <p className="text-sm text-gray-600 font-body">¡Superaste el promedio nacional!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
              Todo lo que necesitas para
              <span className="bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent"> triunfar</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body">
              Herramientas inteligentes diseñadas para maximizar tu potencial y garantizar el mejor resultado en tu examen ICFES.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="mb-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-purple-50 group-hover:to-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-body">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Stats */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">Materias Más Populares</h2>
            <p className="text-xl text-gray-600 font-body">Miles de estudiantes ya están mejorando sus puntajes</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {subjects.map((subject, index) => (
              <div
                key={subject.name}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 ${subject.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 font-display">{subject.name}</h3>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 font-body">{subject.students} estudiantes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">Lo que dicen nuestros estudiantes</h2>
            <p className="text-xl text-gray-600 font-body">Historias reales de éxito que te inspirarán</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic font-body">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 font-display">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 font-body">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight font-display">
              ¿Listo para alcanzar tu
              <span className="block">mejor puntaje ICFES?</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-body">
              Únete a miles de estudiantes que ya están transformando su futuro académico con nuestra plataforma.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="group bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2"
              >
                <span>Comenzar Ahora - Es Gratis</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="flex items-center justify-center space-x-8 pt-8">
              <div className="flex items-center space-x-2 text-blue-100">
                <CheckCircle className="h-5 w-5" />
                <span className="font-body">Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <CheckCircle className="h-5 w-5" />
                <span className="font-body">Acceso inmediato</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <CheckCircle className="h-5 w-5" />
                <span className="font-body">Resultados garantizados</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-2 rounded-xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold font-display">ICFES ALLIASOFT</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4 font-body">
                La plataforma de preparación ICFES más avanzada de Colombia. 
                Ayudamos a estudiantes a alcanzar su máximo potencial académico.
              </p>
              <div className="text-sm text-gray-500 font-body">
                © 2024 ICFES ALLIASOFT. Todos los derechos reservados.
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 font-display">Plataforma</h4>
              <div className="space-y-2 text-gray-400 font-body">
                <div>Exámenes de Práctica</div>
                <div>Análisis de Resultados</div>
                <div>Seguimiento de Progreso</div>
                <div>Material de Estudio</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 font-display">Soporte</h4>
              <div className="space-y-2 text-gray-400 font-body">
                <div>Centro de Ayuda</div>
                <div>Contacto</div>
                <div>Términos de Uso</div>
                <div>Privacidad</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;