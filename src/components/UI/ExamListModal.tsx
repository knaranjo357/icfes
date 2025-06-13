import React from 'react';
import { X, Calendar, Award, Eye, BookOpen } from 'lucide-react';
import { ExamResult } from '../../types';
import { getSubjectDisplayName, formatDate } from '../../utils/helpers';

interface ExamListModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: ExamResult[];
  onViewDetails: () => void;
}

const ExamListModal: React.FC<ExamListModalProps> = ({ isOpen, onClose, results, onViewDetails }) => {
  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return '🏆';
    if (score >= 60) return '🎯';
    return '📚';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Award className="h-6 w-6 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-900 font-display">Exámenes Completos</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h4 className="text-xl font-bold text-gray-900 mb-4 font-display">No hay exámenes completos</h4>
              <p className="text-gray-600 font-body">
                Aún no has completado ningún examen completo. ¡Comienza tu primer desafío completo!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => {
                const score = parseInt(result.resultado);
                return (
                  <div key={result.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{getScoreIcon(score)}</div>
                        <div>
                          <h4 className="font-bold text-gray-900 font-display">
                            {getSubjectDisplayName(result.materia)}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 font-body">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(result.created_at)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(score).split(' ')[0]}`}>
                            {score}%
                          </div>
                          <div className={`text-xs font-medium px-2 py-1 rounded-full ${getScoreColor(score)}`}>
                            {score >= 80 ? 'Excelente' : score >= 60 ? 'Muy bien' : 'A mejorar'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            {results.length > 0 && (
              <button
                onClick={() => {
                  onViewDetails();
                  onClose();
                }}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Eye className="h-4 w-4" />
                <span>Ver Análisis Completo</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition-all duration-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamListModal;