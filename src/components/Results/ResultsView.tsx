import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../Layout/Header';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorDisplay from '../UI/ErrorDisplay';
import { Calendar, TrendingUp, Award, BookOpen, ChevronLeft, Filter, Eye, CheckCircle, XCircle, Target, BarChart3, PieChart, Activity, Zap, Trophy, Star, ChevronRight, ArrowLeft, ArrowRight, Menu, X } from 'lucide-react';
import { ExamResult, Question, ChartData } from '../../types';
import { apiService } from '../../services/api';
import { getSubjectDisplayName, getSubjectConfig, getScoreLevel, formatDate } from '../../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ResultsViewProps {
  onBackToDashboard: () => void;
}

// Extended interface for detailed results with complete question data
interface DetailedResultWithQuestion {
  id: number;
  created_at: string;
  img_url: string | null;
  contenido: string;
  pregunta: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  opcionD: string;
  respuesta_correcta: string;
  justificacion: string;
  materia: string;
  dificultad: number;
  usuario: number;
  respuesta: string; // User's answer
  prueba: number;
}

type AnswerFilter = 'all' | 'correct' | 'incorrect';

const ResultsView: React.FC<ResultsViewProps> = ({ onBackToDashboard }) => {
  const { token } = useAuth();
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterTimeRange, setFilterTimeRange] = useState('all');
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [detailedResults, setDetailedResults] = useState<DetailedResultWithQuestion[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState('');
  
  // New states for detailed view navigation
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerFilter, setAnswerFilter] = useState<AnswerFilter>('incorrect');
  const [showNavigation, setShowNavigation] = useState(false);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!token) return;
      
      try {
        const data = await apiService.getResults(token);
        setResults(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch (error) {
        console.error('Error fetching results:', error);
        setError('Error al cargar los resultados');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token]);

  const fetchDetailedResults = async (result: ExamResult) => {
    if (!token) return;
    
    setLoadingDetails(true);
    try {
      const details = await apiService.getDetailedResults(result.id, token);
      setDetailedResults(details);
      setSelectedResult(result);
      setCurrentQuestionIndex(0);
      setAnswerFilter('incorrect'); // Start with incorrect answers by default
      questionRefs.current = new Array(details.length).fill(null);
    } catch (error) {
      console.error('Error fetching detailed results:', error);
      setError('Error al cargar los detalles del examen');
    } finally {
      setLoadingDetails(false);
    }
  };

  // Filter questions based on answer type
  const getFilteredQuestions = () => {
    switch (answerFilter) {
      case 'correct':
        return detailedResults.filter(q => q.respuesta === q.respuesta_correcta);
      case 'incorrect':
        return detailedResults.filter(q => q.respuesta !== q.respuesta_correcta);
      default:
        return detailedResults;
    }
  };

  const filteredQuestions = getFilteredQuestions();

  // Navigate to next/previous question with auto-scroll
  const navigateQuestion = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? Math.min(currentQuestionIndex + 1, filteredQuestions.length - 1)
      : Math.max(currentQuestionIndex - 1, 0);
    
    setCurrentQuestionIndex(newIndex);
    
    // Auto-scroll to question
    setTimeout(() => {
      const questionElement = questionRefs.current[newIndex];
      if (questionElement) {
        questionElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  // Filter results by time range
  const filterResultsByTime = (results: ExamResult[], range: string) => {
    if (range === 'all') return results;
    
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

  // Apply both subject and time filters
  const getFilteredResults = () => {
    let filtered = results;
    
    // Apply subject filter
    if (filterSubject !== 'all') {
      filtered = filtered.filter(r => r.materia === filterSubject);
    }
    
    // Apply time filter
    filtered = filterResultsByTime(filtered, filterTimeRange);
    
    return filtered;
  };

  const filteredResults = getFilteredResults();

  const totalExams = filteredResults.length;
  const averageScore = filteredResults.length > 0 
    ? Math.round(filteredResults.reduce((sum, r) => sum + parseInt(r.resultado), 0) / filteredResults.length)
    : 0;

  // Prepare chart data with filtered results
  const subjectStats = ['matematicas', 'ciencias naturales', 'sociales y ciudadanas', 'lectura', 'ingles'].map(subject => {
    const subjectResults = filteredResults.filter(r => r.materia === subject);
    const count = subjectResults.length;
    const average = count > 0 
      ? Math.round(subjectResults.reduce((sum, r) => sum + parseInt(r.resultado), 0) / count)
      : 0;
    const config = getSubjectConfig(subject);
    return { 
      subject, 
      count, 
      average,
      name: getSubjectDisplayName(subject),
      score: average,
      exams: count,
      color: config.chartColor
    };
  });

  // Progress over time data with filtered results
  const progressData = filteredResults.slice(-10).reverse().map((result, index) => ({
    exam: `Examen ${index + 1}`,
    score: parseInt(result.resultado),
    date: new Date(result.created_at).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
  }));

  // Pie chart data for subject distribution
  const pieData = subjectStats.filter(s => s.count > 0).map(s => ({
    name: s.name,
    value: s.count,
    color: s.color
  }));

  // Radar chart data
  const radarData = subjectStats.map(s => ({
    subject: s.name.split(' ')[0], // Shortened names for radar
    score: s.average,
    fullMark: 100
  }));

  if (loading) {
    return <LoadingSpinner message="Cargando resultados" submessage="Analizando tu progreso..." />;
  }

  if (error) {
    return (
      <ErrorDisplay 
        message={error} 
        onBack={onBackToDashboard}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Detailed Results View with improved navigation
  if (selectedResult) {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const isCorrect = currentQuestion?.respuesta === currentQuestion?.respuesta_correcta;
    const correctCount = detailedResults.filter(q => q.respuesta === q.respuesta_correcta).length;
    const incorrectCount = detailedResults.filter(q => q.respuesta !== q.respuesta_correcta).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <Header 
          onStartFullExam={() => {}}
          onStartQuickExam={() => {}}
          onViewResults={() => {}}
        />

        {/* Floating Navigation Controls */}
        <div className="fixed top-6 right-6 z-40 flex flex-col space-y-3">
          {/* Answer Filter */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-700 font-display">Filtrar:</span>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setAnswerFilter('incorrect');
                  setCurrentQuestionIndex(0);
                }}
                className={`w-full px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  answerFilter === 'incorrect'
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Incorrectas ({incorrectCount})
              </button>
              <button
                onClick={() => {
                  setAnswerFilter('correct');
                  setCurrentQuestionIndex(0);
                }}
                className={`w-full px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  answerFilter === 'correct'
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Correctas ({correctCount})
              </button>
              <button
                onClick={() => {
                  setAnswerFilter('all');
                  setCurrentQuestionIndex(0);
                }}
                className={`w-full px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  answerFilter === 'all'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas ({detailedResults.length})
              </button>
            </div>
          </div>

          {/* Question Counter */}
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 px-4 py-3">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900 font-body">
                {currentQuestionIndex + 1} de {filteredQuestions.length}
              </span>
            </div>
          </div>

          {/* Navigation Toggle */}
          <button
            onClick={() => setShowNavigation(!showNavigation)}
            className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-3 hover:bg-white transition-all duration-200"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        {showNavigation && (
          <>
            <div 
              className="fixed inset-0 bg-black/20 z-30"
              onClick={() => setShowNavigation(false)}
            ></div>
            <div className="fixed top-6 right-6 bottom-6 w-80 md:w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 z-40 p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900 font-display">Navegación</h3>
                </div>
                <button
                  onClick={() => setShowNavigation(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {filteredQuestions.map((_, index) => {
                  const question = filteredQuestions[index];
                  const isQuestionCorrect = question.respuesta === question.respuesta_correcta;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentQuestionIndex(index);
                        setShowNavigation(false);
                        setTimeout(() => {
                          const questionElement = questionRefs.current[index];
                          if (questionElement) {
                            questionElement.scrollIntoView({ 
                              behavior: 'smooth', 
                              block: 'start' 
                            });
                          }
                        }, 100);
                      }}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-semibold transition-all duration-200 transform hover:scale-110 ${
                        index === currentQuestionIndex
                          ? 'bg-blue-600 text-white shadow-lg scale-110'
                          : isQuestionCorrect
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-red-100 text-red-700 border border-red-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
        
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => setSelectedResult(null)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
              >
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Volver a Resultados</span>
              </button>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Análisis Detallado</h1>
              <p className="text-gray-600 text-lg font-body">
                {getSubjectDisplayName(selectedResult.materia)} • {formatDate(selectedResult.created_at)}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-5xl font-bold ${getScoreLevel(parseInt(selectedResult.resultado)).color} mb-2`}>
                {selectedResult.resultado}%
              </div>
              <div className="text-lg text-gray-500 font-medium">Puntuación Final</div>
            </div>
          </div>

          {loadingDetails ? (
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner 
                size="md" 
                message="Cargando análisis detallado..." 
                showIcon={false}
              />
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-16 text-center">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">
                No hay preguntas {answerFilter === 'correct' ? 'correctas' : answerFilter === 'incorrect' ? 'incorrectas' : ''}
              </h3>
              <p className="text-gray-600 text-lg font-body">
                {answerFilter === 'correct' 
                  ? '¡Excelente! No tienes respuestas correctas que revisar.'
                  : answerFilter === 'incorrect'
                  ? '¡Perfecto! No tienes errores que corregir.'
                  : 'No hay preguntas disponibles.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Current Question Display */}
              <div 
                ref={el => questionRefs.current[currentQuestionIndex] = el}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {isCorrect ? <CheckCircle className="h-7 w-7" /> : <XCircle className="h-7 w-7" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 font-display">
                        Pregunta {currentQuestionIndex + 1}
                      </h3>
                      <p className={`text-sm font-semibold ${
                        isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isCorrect ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Context if available */}
                {currentQuestion?.contenido && (
                  <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold text-blue-900 font-display text-sm md:text-base">Contexto</h3>
                    </div>
                    <p className="text-blue-800 leading-relaxed font-body text-sm">{currentQuestion.contenido}</p>
                  </div>
                )}
                
                <h4 className="text-lg md:text-xl font-bold text-gray-900 leading-relaxed font-display mb-6">
                  {currentQuestion?.pregunta}
                </h4>
                
                <div className="space-y-4 mb-6">
                  {['A', 'B', 'C', 'D'].map((option) => {
                    const optionText = currentQuestion?.[`opcion${option}` as keyof DetailedResultWithQuestion] as string;
                    const isUserAnswer = currentQuestion?.respuesta === option;
                    const isCorrectAnswer = currentQuestion?.respuesta_correcta === option;
                    
                    return (
                      <div
                        key={option}
                        className={`p-5 rounded-2xl border-2 transition-all ${
                          isCorrectAnswer
                            ? 'border-green-500 bg-green-50'
                            : isUserAnswer && !isCorrectAnswer
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            isCorrectAnswer
                              ? 'bg-green-500 text-white'
                              : isUserAnswer && !isCorrectAnswer
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {option}
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-900 leading-relaxed font-body">{optionText}</span>
                            <div className="flex items-center space-x-3 mt-2">
                              {isUserAnswer && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                  Tu respuesta
                                </span>
                              )}
                              {isCorrectAnswer && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                  Respuesta correcta
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {currentQuestion?.justificacion && (
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-200">
                    <h5 className="font-bold text-purple-900 mb-3 flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Explicación Detallada</span>
                    </h5>
                    <p className="text-purple-800 leading-relaxed font-body">{currentQuestion.justificacion}</p>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateQuestion('prev')}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center space-x-3 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 font-body"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Anterior</span>
                  </button>

                  <div className="text-center">
                    <div className="text-sm text-gray-600 font-body">
                      Pregunta {currentQuestionIndex + 1} de {filteredQuestions.length}
                    </div>
                    <div className="text-xs text-gray-500 font-body">
                      Mostrando: {answerFilter === 'all' ? 'Todas' : answerFilter === 'correct' ? 'Correctas' : 'Incorrectas'}
                    </div>
                  </div>

                  <button
                    onClick={() => navigateQuestion('next')}
                    disabled={currentQuestionIndex === filteredQuestions.length - 1}
                    className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl font-body"
                  >
                    <span>Siguiente</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Header 
        onStartFullExam={() => {}}
        onStartQuickExam={() => {}}
        onViewResults={() => {}}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={onBackToDashboard}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Volver al Dashboard</span>
            </button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">Análisis de Rendimiento</h1>
            <p className="text-gray-600 text-lg font-body">Visualiza tu progreso y descubre patrones en tu aprendizaje</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="font-semibold text-gray-700 font-display">Filtros:</span>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/70 backdrop-blur-sm font-body"
                >
                  <option value="all">Todas las materias</option>
                  <option value="matematicas">Matemáticas</option>
                  <option value="ciencias naturales">Ciencias Naturales</option>
                  <option value="sociales y ciudadanas">Sociales y Ciudadanas</option>
                  <option value="lectura">Lectura Crítica</option>
                  <option value="ingles">Inglés</option>
                </select>

                <select
                  value={filterTimeRange}
                  onChange={(e) => setFilterTimeRange(e.target.value)}
                  className="border-2 border-gray-200 rounded-2xl px-4 py-3 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/70 backdrop-blur-sm font-body"
                >
                  <option value="all">Todo el tiempo</option>
                  <option value="week">Última semana</option>
                  <option value="month">Último mes</option>
                  <option value="year">Último año</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <BarChart3 className="h-4 w-4" />
              <span className="font-semibold font-body">
                Mostrando {filteredResults.length} de {results.length} resultados
              </span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-500">Total Exámenes</div>
                <div className="text-3xl font-bold text-gray-900">{totalExams}</div>
                <div className="text-sm text-blue-600 font-semibold">En período seleccionado</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-500">Promedio Período</div>
                <div className="text-3xl font-bold text-gray-900">{averageScore}%</div>
                <div className="text-sm text-green-600 font-semibold">
                  {averageScore >= 75 ? 'Excelente' : averageScore >= 60 ? 'Muy bien' : 'Mejorando'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-500">Mejor Materia</div>
                <div className="text-lg font-bold text-gray-900">
                  {subjectStats.sort((a, b) => b.average - a.average)[0]?.count > 0 
                    ? getSubjectDisplayName(subjectStats.sort((a, b) => b.average - a.average)[0].subject)
                    : 'N/A'
                  }
                </div>
                <div className="text-sm text-purple-600 font-semibold">
                  {subjectStats.sort((a, b) => b.average - a.average)[0]?.average || 0}% promedio
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-500">Último Examen</div>
                <div className="text-lg font-bold text-gray-900">
                  {filteredResults.length > 0 
                    ? formatDate(filteredResults[0].created_at).split(',')[0]
                    : 'N/A'
                  }
                </div>
                <div className="text-sm text-orange-600 font-semibold">
                  {filteredResults.length > 0 ? `${filteredResults[0].resultado}% obtenido` : 'Sin datos'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Progress Over Time */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900 font-display">Progreso en el Tiempo</h3>
            </div>
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
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-body">No hay datos para el período seleccionado</p>
                </div>
              </div>
            )}
          </div>

          {/* Subject Performance Radar */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="h-6 w-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900 font-display">Rendimiento por Materia</h3>
            </div>
            {radarData.some(d => d.score > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                  />
                  <Radar
                    name="Puntaje"
                    dataKey="score"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-body">No hay datos para mostrar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* More Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Subject Scores Bar Chart */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900 font-display">Puntajes por Materia</h3>
            </div>
            {subjectStats.some(s => s.count > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectStats.filter(s => s.count > 0)}>
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
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-body">No hay datos para mostrar</p>
                </div>
              </div>
            )}
          </div>

          {/* Exam Distribution Pie Chart */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <PieChart className="h-6 w-6 text-orange-600" />
              <h3 className="text-xl font-bold text-gray-900 font-display">Distribución de Exámenes</h3>
            </div>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-body">No hay datos para mostrar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subject Performance Cards */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900 font-display">Rendimiento Detallado por Materia</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {subjectStats.map(({ subject, count, average, name }) => {
              const config = getSubjectConfig(subject);
              return (
                <div key={subject} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                  <div className={`w-16 h-16 ${config.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-sm font-semibold text-gray-600 mb-2">{name}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{average}%</div>
                  <div className="text-sm text-gray-500 mb-3 font-body">{count} exámenes</div>
                  <div className="flex items-center justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(average / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results List */}
        {filteredResults.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-16 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-display">No hay resultados disponibles</h3>
            <p className="text-gray-600 text-lg font-body">
              No hay exámenes que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredResults.map((result) => {
              const score = parseInt(result.resultado);
              const scoreLevel = getScoreLevel(score);
              const config = getSubjectConfig(result.materia);
              
              return (
                <div key={result.id} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 p-8 hover:shadow-2xl transition-all duration-300 group">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                    <div className="flex items-center space-x-6">
                      <div className="text-4xl group-hover:scale-110 transition-transform">{scoreLevel.icon}</div>
                      <div>
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900 font-display">
                            {getSubjectDisplayName(result.materia)}
                          </h3>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.color} text-white`}>
                            {getSubjectDisplayName(result.materia)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-6 text-gray-600 font-body">
                          <span className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(result.created_at)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className={`text-4xl font-bold ${scoreLevel.color}`}>
                          {score}%
                        </div>
                        <div className="text-lg text-gray-500 font-medium">
                          {scoreLevel.label}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => fetchDetailedResults(result)}
                        className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group-hover:shadow-2xl"
                      >
                        <Eye className="h-5 w-5" />
                        <span>Ver Análisis</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResultsView;