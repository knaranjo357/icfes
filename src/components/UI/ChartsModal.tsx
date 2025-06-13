import React, { useState } from 'react';
import { X, Calendar, Filter, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ExamResult } from '../../types';
import { getSubjectDisplayName } from '../../utils/helpers';

interface ChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: ExamResult[];
}

const ChartsModal: React.FC<ChartsModalProps> = ({ isOpen, onClose, results }) => {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [dateRange, setDateRange] = useState('month');

  if (!isOpen) return null;

  const filterResultsByDate = (results: ExamResult[], range: string) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return results;
    }
    
    return results.filter(r => new Date(r.created_at) >= startDate);
  };

  const filteredResults = filterResultsByDate(
    selectedSubject === 'all' ? results : results.filter(r => r.materia === selectedSubject),
    dateRange
  );

  const progressData = filteredResults.slice(-10).reverse().map((result, index) => ({
    exam: `Examen ${index + 1}`,
    score: parseInt(result.resultado),
    date: new Date(result.created_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  }));

  const subjectStats = ['matematicas', 'ciencias naturales', 'sociales y ciudadanas', 'lectura', 'ingles'].map(subject => {
    const subjectResults = filteredResults.filter(r => r.materia === subject);
    const count = subjectResults.length;
    const average = count > 0 
      ? Math.round(subjectResults.reduce((sum, r) => sum + parseInt(r.resultado), 0) / count)
      : 0;
    return { 
      subject, 
      count, 
      average,
      name: getSubjectDisplayName(subject)
    };
  }).filter(s => s.count > 0);

  const averageScore = filteredResults.length > 0 
    ? Math.round(filteredResults.reduce((sum, r) => sum + parseInt(r.resultado), 0) / filteredResults.length)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900 font-display">Análisis de Rendimiento</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-display">Materia</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white font-body"
              >
                <option value="all">Todas las materias</option>
                <option value="matematicas">Matemáticas</option>
                <option value="ciencias naturales">Ciencias Naturales</option>
                <option value="sociales y ciudadanas">Sociales y Ciudadanas</option>
                <option value="lectura">Lectura Crítica</option>
                <option value="ingles">Inglés</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-display">Período</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white font-body"
              >
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="year">Este año</option>
              </select>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="text-3xl font-bold text-blue-900 mb-2">{filteredResults.length}</div>
              <div className="text-blue-700 font-semibold font-body">Exámenes en período</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="text-3xl font-bold text-green-900 mb-2">{averageScore}%</div>
              <div className="text-green-700 font-semibold font-body">Promedio período</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <div className="text-3xl font-bold text-purple-900 mb-2">
                {filteredResults.length > 0 ? Math.max(...filteredResults.map(r => parseInt(r.resultado))) : 0}%
              </div>
              <div className="text-purple-700 font-semibold font-body">Mejor puntaje</div>
            </div>
          </div>

          {/* Charts */}
          <div className="space-y-8">
            {/* Progress Over Time */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4 font-display">Progreso en el Tiempo</h4>
              {progressData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="font-body">No hay datos para el período seleccionado</p>
                  </div>
                </div>
              )}
            </div>

            {/* Subject Performance */}
            {selectedSubject === 'all' && subjectStats.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 font-display">Rendimiento por Materia</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280" 
                      fontSize={10}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Bar 
                      dataKey="average" 
                      fill="#10B981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsModal;