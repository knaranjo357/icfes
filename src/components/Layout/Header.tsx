import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, BookOpen, Settings, ChevronDown, Zap, Target, BarChart3, Calculator, FlaskConical, Users, Languages, BookText } from 'lucide-react';

interface HeaderProps {
  onStartFullExam?: () => void;
  onStartQuickExam?: (subject: string) => void;
  onViewResults?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStartFullExam, onStartQuickExam, onViewResults }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickExamMenu, setShowQuickExamMenu] = useState(false);

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const subjects = [
    { id: 'matematicas', name: 'Matemáticas', icon: Calculator, color: 'text-blue-600' },
    { id: 'ciencias naturales', name: 'Ciencias Naturales', icon: FlaskConical, color: 'text-green-600' },
    { id: 'sociales y ciudadanas', name: 'Sociales y Ciudadanas', icon: Users, color: 'text-orange-600' },
    { id: 'lectura', name: 'Lectura Crítica', icon: BookText, color: 'text-purple-600' },
    { id: 'ingles', name: 'Inglés', icon: Languages, color: 'text-indigo-600' }
  ];

  // Navigate to dashboard when logo is clicked
  const handleLogoClick = () => {
    window.location.href = '/'; // This will trigger a full page reload to dashboard
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo - Clickeable */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 md:space-x-4 hover:opacity-80 transition-opacity"
          >
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg">
              <BookOpen className="h-5 w-5 md:h-8 md:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent font-display">
                ICFÉS ALLIASOFT
              </h1>
              <p className="text-xs text-gray-500 font-medium font-body hidden md:block">Plataforma de Preparación ICFES</p>
            </div>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Full Exam Button */}
            {onStartFullExam && (
              <button
                onClick={onStartFullExam}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Zap className="h-4 w-4" />
                <span className="text-sm">Examen Completo</span>
              </button>
            )}

            {/* Quick Exam Dropdown */}
            {onStartQuickExam && (
              <div className="relative">
                <button
                  onClick={() => setShowQuickExamMenu(!showQuickExamMenu)}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Target className="h-4 w-4" />
                  <span className="text-sm">Examen Rápido</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {showQuickExamMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowQuickExamMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <span className="text-sm font-semibold text-gray-700 font-display">Selecciona una materia</span>
                      </div>
                      {subjects.map((subject) => {
                        const IconComponent = subject.icon;
                        return (
                          <button
                            key={subject.id}
                            onClick={() => {
                              onStartQuickExam(subject.id);
                              setShowQuickExamMenu(false);
                            }}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors font-body"
                          >
                            <IconComponent className={`h-4 w-4 ${subject.color}`} />
                            <span>{subject.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Results Button */}
            {onViewResults && (
              <button
                onClick={onViewResults}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">Ver Historial</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg">
                  {user?.correo ? getInitials(user.correo) : 'U'}
                </div>
              </button>
            </div>

            {/* Desktop User Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-2xl transition-all duration-200 group"
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {user?.correo ? getInitials(user.correo) : 'U'}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900 font-display">
                    {user?.correo?.split('@')[0] || 'Usuario'}
                  </div>
                  <div className="text-xs text-gray-500 font-body">{user?.correo}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                          {user?.correo ? getInitials(user.correo) : 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 font-display">{user?.correo?.split('@')[0]}</div>
                          <div className="text-sm text-gray-500 font-body">{user?.correo}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Actions */}
                    <div className="md:hidden py-2 border-b border-gray-100">
                      {onStartFullExam && (
                        <button
                          onClick={() => {
                            onStartFullExam();
                            setShowUserMenu(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors font-body"
                        >
                          <Zap className="h-5 w-5 text-emerald-600" />
                          <span>Examen Completo</span>
                        </button>
                      )}
                      {onStartQuickExam && (
                        <div className="px-4 py-2">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide font-display">Examen Rápido</span>
                          <div className="mt-2 space-y-1">
                            {subjects.map((subject) => {
                              const IconComponent = subject.icon;
                              return (
                                <button
                                  key={subject.id}
                                  onClick={() => {
                                    onStartQuickExam(subject.id);
                                    setShowUserMenu(false);
                                  }}
                                  className="flex items-center space-x-2 w-full px-2 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-body text-sm"
                                >
                                  <IconComponent className={`h-4 w-4 ${subject.color}`} />
                                  <span>{subject.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {onViewResults && (
                        <button
                          onClick={() => {
                            onViewResults();
                            setShowUserMenu(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors font-body"
                        >
                          <BarChart3 className="h-5 w-5 text-purple-600" />
                          <span>Ver Historial</span>
                        </button>
                      )}
                    </div>
                    
                    <div className="py-2">
                      <button className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors font-body">
                        <User className="h-5 w-5 text-gray-400" />
                        <span>Mi Perfil</span>
                      </button>
                      <button className="flex items-center space-x-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors font-body">
                        <Settings className="h-5 w-5 text-gray-400" />
                        <span>Configuración</span>
                      </button>
                    </div>

                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-left text-red-700 hover:bg-red-50 transition-colors font-body"
                      >
                        <LogOut className="h-5 w-5 text-red-500" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;