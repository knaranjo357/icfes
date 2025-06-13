import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorDisplay from '../UI/ErrorDisplay';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, Send, Target, Zap, X, Menu } from 'lucide-react';
import { Question, ExamState } from '../../types';
import { apiService } from '../../services/api';
import { getSubjectDisplayName, formatTime } from '../../utils/helpers';

interface ExamInterfaceProps {
  subject: string;
  onExamComplete: () => void;
  onBackToDashboard: () => void;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({
  subject,
  onExamComplete,
  onBackToDashboard
}) => {
  const { token } = useAuth();
  const [examState, setExamState] = useState<ExamState>({
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    startTime: Date.now(),
    isSubmitting: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questions = await apiService.getQuickExam(subject);
        setExamState(prev => ({
          ...prev,
          questions,
          startTime: Date.now()
        }));
      } catch (error) {
        setError('Error al cargar el examen. Por favor intenta de nuevo.');
        console.error('Error fetching exam:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [subject]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - examState.startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [examState.startTime]);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setExamState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    setExamState(prev => ({
      ...prev,
      currentQuestionIndex: direction === 'next' 
        ? Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1)
        : Math.max(prev.currentQuestionIndex - 1, 0)
    }));
  };

  const handleSubmitExam = async () => {
    if (!token) return;

    const unansweredCount = examState.questions.length - Object.keys(examState.answers).length;
    
    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `Tienes ${unansweredCount} pregunta(s) sin responder. ¿Estás seguro de que quieres enviar el examen?`
      );
      if (!confirmSubmit) return;
    }

    setExamState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const answersArray = examState.questions.map(q => [
        q.id,
        examState.answers[q.id] || 'A'
      ]);

      await apiService.submitAnswers(answersArray, token);
      onExamComplete();
    } catch (error) {
      setError('Error al enviar las respuestas. Por favor intenta de nuevo.');
      console.error('Error submitting exam:', error);
    } finally {
      setExamState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <LoadingSpinner message="Preparando tu examen" submessage="Cargando preguntas personalizadas..." />
      </div>
    );
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

  const currentQuestion = examState.questions[examState.currentQuestionIndex];
  const progress = ((examState.currentQuestionIndex + 1) / examState.questions.length) * 100;
  const answeredCount = Object.keys(examState.answers).length;

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex flex-col">
      {/* Floating Controls */}
      <div className="fixed top-6 right-6 z-40 flex flex-col space-y-3">
        {/* Timer */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 px-4 py-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-lg font-mono font-bold text-blue-900">{formatTime(timeElapsed)}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 px-4 py-3">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-900 font-body">
              {answeredCount}/{examState.questions.length}
            </span>
          </div>
        </div>

        {/* Navigation Toggle */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-3 hover:bg-white transition-all duration-200"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      {showSidebar && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-30"
            onClick={() => setShowSidebar(false)}
          ></div>
          <div className="fixed top-6 right-6 bottom-6 w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 z-40 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 font-display">Navegación</h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {examState.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setExamState(prev => ({ ...prev, currentQuestionIndex: index }));
                    setShowSidebar(false);
                  }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold transition-all duration-200 transform hover:scale-110 ${
                    index === examState.currentQuestionIndex
                      ? 'bg-blue-600 text-white shadow-lg'
                      : examState.answers[examState.questions[index]?.id]
                      ? 'bg-green-100 text-green-700 border-2 border-green-300'
                      : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                  }`}
                >
                  {index === examState.currentQuestionIndex ? (
                    index + 1
                  ) : examState.answers[examState.questions[index]?.id] ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </button>
              ))}
            </div>

            {/* Progress Bar in Sidebar */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm text-gray-600 font-body">
                <span>Progreso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Question Content - Full Width */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {/* Compact Header */}
            <div className="mb-4 md:mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-2 md:space-y-0">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-display">
                    {getSubjectDisplayName(subject)}
                  </h1>
                  <p className="text-sm md:text-base text-gray-600 font-body">
                    Pregunta {examState.currentQuestionIndex + 1} de {examState.questions.length}
                  </p>
                </div>
                <button
                  onClick={onBackToDashboard}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors font-body text-sm md:text-base"
                >
                  Salir
                </button>
              </div>
              
              {/* Thin Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question Content */}
            <div className="flex-1 flex flex-col">
              {/* Context if available */}
              {currentQuestion?.contenido && (
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold text-blue-900 font-display text-sm md:text-base">Contexto</h3>
                  </div>
                  <p className="text-blue-800 leading-relaxed font-body text-sm">{currentQuestion.contenido}</p>
                </div>
              )}

              {/* Question */}
              <div className="mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-relaxed font-display">
                  {currentQuestion?.pregunta}
                </h2>
              </div>

              {/* Options */}
              <div className="flex-1 space-y-2 md:space-y-3">
                {['A', 'B', 'C', 'D'].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                    className={`group w-full p-3 md:p-4 text-left rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.01] ${
                      examState.answers[currentQuestion.id] === option
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs md:text-sm transition-all ${
                        examState.answers[currentQuestion.id] === option
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 group-hover:border-purple-400 text-gray-600'
                      }`}>
                        {option}
                      </div>
                      <div className="flex-1">
                        <span className={`leading-relaxed font-body text-sm md:text-base ${
                          examState.answers[currentQuestion.id] === option
                            ? 'text-blue-900 font-medium'
                            : 'text-gray-700'
                        }`}>
                          {currentQuestion[`opcion${option}` as keyof Question]}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="mt-4 md:mt-6 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
              <button
                onClick={() => handleNavigation('prev')}
                disabled={examState.currentQuestionIndex === 0}
                className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 font-body text-sm md:text-base"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </button>

              <div className="w-full md:w-auto flex items-center justify-center space-x-4">
                {examState.currentQuestionIndex === examState.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitExam}
                    disabled={examState.isSubmitting}
                    className="w-full md:w-auto flex items-center justify-center space-x-3 px-6 md:px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-display text-sm md:text-base"
                  >
                    <Send className="h-4 w-4" />
                    <span>{examState.isSubmitting ? 'Enviando...' : 'Finalizar'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavigation('next')}
                    className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-body text-sm md:text-base"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;