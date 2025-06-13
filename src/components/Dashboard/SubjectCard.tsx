import React from 'react';
import { Play, Target, TrendingUp, ArrowRight, Star } from 'lucide-react';

interface SubjectStats {
  totalExams: number;
  averageScore: number;
  bestScore: number;
}

interface SubjectCardProps {
  subject: string;
  displayName: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onStartExam: (subject: string) => void;
  stats?: SubjectStats;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  displayName,
  description,
  icon,
  color,
  onStartExam,
  stats
}) => {
  const getPerformanceLevel = (score: number) => {
    if (score >= 80) return { label: 'Excelente', color: 'text-green-600 bg-green-50' };
    if (score >= 60) return { label: 'Bueno', color: 'text-blue-600 bg-blue-50' };
    return { label: 'Mejorable', color: 'text-orange-600 bg-orange-50' };
  };

  const performance = stats?.averageScore ? getPerformanceLevel(stats.averageScore) : null;

  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className={`p-4 rounded-2xl ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-500">Realizados</div>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalExams || 0}</div>
          </div>
        </div>

        {/* Subject Info */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors font-display">
            {displayName}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed font-body">{description}</p>
        </div>

        {/* Performance Badge */}
        {performance && (
          <div className="mb-6">
            <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${performance.color}`}>
              <span>{performance.label}</span>
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && stats.totalExams > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center group-hover:bg-blue-50 transition-colors">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Promedio</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.averageScore}%</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center group-hover:bg-green-50 transition-colors">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mejor</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.bestScore}%</div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onStartExam(subject)}
          className="group/btn w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-center space-x-3">
            <Play className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
            <span>Examen Rápido</span>
            <div className="bg-white/20 px-2 py-1 rounded-lg text-xs font-medium">
              5 preguntas
            </div>
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Progress Bar */}
        {stats && stats.totalExams > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2 font-medium">
              <span>Progreso semanal</span>
              <span>{Math.min(stats.totalExams, 10)}/10</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.totalExams / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative bottom border */}
      <div className={`h-1 ${color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
    </div>
  );
};

export default SubjectCard;