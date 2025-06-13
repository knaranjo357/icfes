import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Layout/Header';
import SubjectCard from './SubjectCard';
import StatsCard from './StatsCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import Modal from '../UI/Modal';
import ChartsModal from '../UI/ChartsModal';
import ExamListModal from '../UI/ExamListModal';
import { Calculator, FlaskConical, Globe, BookText, History, Award, Languages, Users, TrendingUp, Target, Zap, Clock, Sparkles, Trophy, Rocket, BookOpen } from 'lucide-react';
import { apiService } from '../../services/api';
import { ExamResult } from '../../types';
import { SUBJECT_CONFIG } from '../../utils/constants';
import { getSubjectDisplayName, getWelcomeMessage, getMotivationalMessage } from '../../utils/helpers';

interface DashboardProps {
  onStartExam: (subject: string) => void;
  onStartFullExam: () => void;
  onViewResults: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartExam, onStartFullExam, onViewResults }) => {
  const { token, user } = useAuth();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [showChartsModal, setShowChartsModal] = useState(false);
  const [showExamListModal, setShowExamListModal] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!token) return;
      
      try {
        const data = await apiService.getResults(token);
        setResults(data);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token]);

  const getSubjectStats = (subject: string) => {
    const subjectResults = results.filter(r => r.materia === subject);
    if (subjectResults.length === 0) return { totalExams: 0, averageScore: 0, bestScore: 0 };

    const scores = subjectResults.map(r => parseInt(r.resultado));
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const bestScore = Math.max(...scores);

    return {
      totalExams: subjectResults.length,
      averageScore,
      bestScore
    };
  };

  const subjects = Object.entries(SUBJECT_CONFIG).map(([subject, config]) => ({
    subject,
    displayName: config.displayName,
    description: config.description,
    icon: getSubjectIcon(subject),
    color: config.color,
    stats: getSubjectStats(subject)
  }));

  const totalExams = results.length;
  const averageScore = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + parseInt(r.resultado), 0) / results.length)
    : 0;

  const fullExamResults = results.filter(r => r.tipo === 'completo' || results.length > 5); // Assuming full exams have more questions

  const handleStatsCardClick = (type: string) => {
    switch (type) {
      case 'exams':
        setModalContent({
          title: 'Exámenes Completados',
          content: `Has completado un total de ${totalExams} exámenes. ¡Excelente progreso! Cada examen te acerca más a tu objetivo. Continúa practicando regularmente para mantener tu nivel de preparación.`
        });
        setShowModal(true);
        break;
      case 'average':
        setShowChartsModal(true);
        break;
      case 'fullExams':
        setShowExamListModal(true);
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando Dashboard" submessage="Preparando tu panel de control..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Header 
        onStartFullExam={onStartFullExam}
        onStartQuickExam={onStartExam}
        onViewResults={onViewResults}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Welcome Section */}
        <div className="mb-12">
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-20 right-20 w-16 h-16 bg-yellow-300 rounded-full animate-bounce"></div>
              <div className="absolute bottom-10 left-1/3 w-12 h-12 bg-pink-300 rounded-full animate-ping"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-yellow-300 animate-pulse" />
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-display">
                      {getWelcomeMessage()}, {user?.correo?.split('@')[0]}!
                    </h2>
                  </div>
                  <p className="text-blue-100 text-lg md:text-xl leading-relaxed mb-4 font-body">
                    Continúa tu preparación ICFES con exámenes personalizados y análisis detallado de tu progreso.
                  </p>
                  <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Trophy className="h-5 w-5 text-yellow-300" />
                    <span className="font-semibold">{getMotivationalMessage(averageScore)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center transform hover:scale-105 transition-transform">
                    <div className="text-2xl md:text-3xl font-bold mb-1">{totalExams}</div>
                    <div className="text-xs md:text-sm text-blue-100 font-medium">Exámenes completados</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center transform hover:scale-105 transition-transform">
                    <div className="text-2xl md:text-3xl font-bold mb-1">{averageScore}%</div>
                    <div className="text-xs md:text-sm text-blue-100 font-medium">Promedio general</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard
            icon={BookText}
            title="Exámenes Completados"
            value={totalExams}
            subtitle="+12 este mes"
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            onClick={() => handleStatsCardClick('exams')}
          />
          
          <StatsCard
            icon={Target}
            title="Promedio General"
            value={`${averageScore}%`}
            subtitle={averageScore >= 75 ? 'Excelente' : averageScore >= 60 ? 'Muy bien' : 'Mejorando'}
            gradient="bg-gradient-to-br from-green-500 to-green-600"
            onClick={() => handleStatsCardClick('average')}
          />

          <StatsCard
            icon={History}
            title="Exámenes Completos"
            value={fullExamResults.length}
            subtitle="Ver lista completa →"
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            onClick={() => handleStatsCardClick('fullExams')}
          />
        </div>

        {/* Full Exam CTA */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <div className="flex items-center space-x-3 mb-4">
                    <Rocket className="h-6 w-6 md:h-8 md:w-8 text-yellow-300" />
                    <h3 className="text-2xl md:text-3xl font-bold font-display">¿Listo para el Desafío Completo?</h3>
                  </div>
                  <p className="text-emerald-100 text-base md:text-lg leading-relaxed mb-4 font-body">
                    Pon a prueba todos tus conocimientos con nuestro examen completo que incluye todas las materias.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">25 preguntas</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                      <Target className="h-4 w-4" />
                      <span className="font-medium">Todas las materias</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                      <Award className="h-4 w-4" />
                      <span className="font-medium">Análisis detallado</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={onStartFullExam}
                  className="group bg-white hover:bg-gray-50 text-emerald-600 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center space-x-3"
                >
                  <Zap className="h-5 w-5 md:h-6 md:w-6 group-hover:scale-110 transition-transform" />
                  <span>Examen Completo</span>
                  <div className="bg-emerald-100 px-2 py-1 rounded-lg text-xs font-semibold">
                    ¡NUEVO!
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 font-display">Materias Disponibles</h3>
              <p className="text-gray-600 font-body">Selecciona una materia para comenzar tu examen de práctica</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.subject}
                {...subject}
                onStartExam={onStartExam}
              />
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6 md:p-8 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg md:text-xl font-bold text-gray-900 font-display">Insights de Rendimiento</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Tu Progreso Semanal</h4>
              <div className="space-y-3">
                {subjects.slice(0, 3).map((subject, index) => (
                  <div key={subject.subject} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 ${subject.color} rounded-full`}></div>
                      <span className="font-semibold text-gray-700">{subject.displayName}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {subject.stats.averageScore || 0}%
                      </div>
                      <div className="text-xs text-gray-500 font-body">
                        {subject.stats.totalExams} exámenes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Recomendaciones</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-blue-900">Mantén el ritmo</div>
                    <div className="text-sm text-blue-700 font-body">
                      Has completado {totalExams} exámenes. ¡Sigue así para mantener tu progreso!
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl border border-green-200">
                  <Target className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-semibold text-green-900">Objetivo de la semana</div>
                    <div className="text-sm text-green-700 font-body">
                      Completa 3 exámenes más para superar tu meta semanal.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Study Tips */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-6 md:p-8 border border-purple-100">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2 font-display">
            <span>💡</span>
            <span>Consejos para Maximizar tu Rendimiento</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: '📚',
                title: 'Consistencia es clave',
                tip: 'Estudia 30 minutos diarios en lugar de sesiones largas esporádicas'
              },
              {
                icon: '⏰',
                title: 'Gestiona tu tiempo',
                tip: 'Practica con límites de tiempo similares al examen real'
              },
              {
                icon: '🎯',
                title: 'Enfócate en debilidades',
                tip: 'Dedica más tiempo a las materias donde tengas menor puntaje'
              },
              {
                icon: '📊',
                title: 'Analiza tus errores',
                tip: 'Revisa las explicaciones detalladas de cada pregunta incorrecta'
              }
            ].map((tip, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white/60 rounded-xl backdrop-blur-sm hover:bg-white/80 transition-colors">
                <span className="text-2xl">{tip.icon}</span>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">{tip.title}</div>
                  <div className="text-sm text-gray-600 font-body">{tip.tip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
        content={modalContent.content}
      />

      <ChartsModal
        isOpen={showChartsModal}
        onClose={() => setShowChartsModal(false)}
        results={results}
      />

      <ExamListModal
        isOpen={showExamListModal}
        onClose={() => setShowExamListModal(false)}
        results={fullExamResults}
        onViewDetails={onViewResults}
      />
    </div>
  );
};

// Helper function to get subject icons
const getSubjectIcon = (subject: string) => {
  const icons = {
    'matematicas': <Calculator className="h-7 w-7 text-white" />,
    'ciencias naturales': <FlaskConical className="h-7 w-7 text-white" />,
    'sociales y ciudadanas': <Users className="h-7 w-7 text-white" />,
    'lectura': <BookText className="h-7 w-7 text-white" />,
    'ingles': <Languages className="h-7 w-7 text-white" />
  };
  return icons[subject as keyof typeof icons] || <BookOpen className="h-7 w-7 text-white" />;
};

export default Dashboard;