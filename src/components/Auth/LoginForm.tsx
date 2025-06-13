import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, AlertCircle, BookOpen, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
  onBackToLanding?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, onBackToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor ingresa todos los campos');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back to Landing */}
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Volver al inicio</span>
          </button>
        )}

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-4 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent mb-2 font-display">
            ICFÉS ALLIASOFT
          </h1>
          <p className="text-gray-600 leading-relaxed font-body">Inicia sesión para continuar tu preparación hacia el éxito</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3 animate-shake">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-blue-500 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-400 font-body"
                  placeholder="tu@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 focus:border-blue-500 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-400 font-body"
                  placeholder="Tu contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
            >
              <div className="flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <span>Iniciar Sesión</span>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-body">
              ¿No tienes una cuenta?{' '}
              <button
                onClick={onToggleMode}
                className="text-blue-600 hover:text-purple-700 font-semibold transition-colors hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-medium">Seguro y protegido</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">50K+ estudiantes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;