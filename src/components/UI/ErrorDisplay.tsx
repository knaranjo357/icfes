import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  title = '¡Ups! Algo salió mal', 
  message, 
  onRetry, 
  onBack 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
      <div className="text-center bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-md mx-4 p-8">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Intentar de nuevo
            </button>
          )}
          {onBack && (
            <button
              onClick={onBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
            >
              Volver
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;