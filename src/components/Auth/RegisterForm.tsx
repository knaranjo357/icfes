import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, AlertCircle, BookOpen, CheckCircle, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';

interface RegisterFormProps {
  onToggleMode: () => void;
  onBackToLanding?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleMode, onBackToLanding }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, loading } = useAuth();

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthLabels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Excelente'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const success = await register(email, password);
    if (!success) {
      setError('Error al crear la cuenta. Es posible que el email ya esté registrado.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
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
          <div className="bg-gradient-to-br from-green-600 to-blue-700 p-4 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-xl">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent mb-2 font-display">
            ICFÉS ALLIASOFT
          </h1>
          <p className="text-gray-600 leading-relaxed font-body">Crea tu cuenta y comienza tu camino hacia el éxito académico</p>
        </div>

        {/* Register Form */}
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
                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 focus:border-green-500 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-400 font-body"
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
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 focus:border-green-500 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-400 font-body"
                  placeholder="Mínimo 6 caracteres"
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
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 font-body">
                    Fortaleza: <span className={`font-semibold ${passwordStrength >= 3 ? 'text-green-600' : 'text-orange-600'}`}>
                      {strengthLabels[passwordStrength - 1] || 'Muy débil'}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                Confirmar Contraseña
              </label>
              <div className="relative group">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 focus:border-green-500 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm placeholder-gray-400 font-body"
                  placeholder="Repite tu contraseña"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                
                {password && confirmPassword && password === confirmPassword && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-gradient-to-r from-green-600 to-blue-700 hover:from-green-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl"
            >
              <div className="flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creando cuenta...</span>
                  </>
                ) : (
                  <span>Crear Cuenta</span>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-body">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={onToggleMode}
                className="text-green-600 hover:text-blue-700 font-semibold transition-colors hover:underline"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>

        {/* Security Features */}
        <div className="mt-8 bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-gray-900">Tu información está protegida</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="font-medium">Encriptación SSL</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="font-medium">Datos seguros</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;