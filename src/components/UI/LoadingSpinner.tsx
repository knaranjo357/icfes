import React from 'react';
import { Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Cargando...', 
  submessage, 
  size = 'md',
  showIcon = true 
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16', 
    lg: 'h-20 w-20'
  };

  const containerClasses = {
    sm: 'p-6',
    md: 'p-12',
    lg: 'p-16'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
      <div className={`text-center bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 ${containerClasses[size]}`}>
        <div className="relative mb-8">
          <div className={`animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto ${sizeClasses[size]}`}></div>
          {showIcon && (
            <Sparkles className="h-8 w-8 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{message}</h3>
        {submessage && <p className="text-gray-600">{submessage}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;