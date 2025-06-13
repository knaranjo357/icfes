import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/Landing/LandingPage';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Dashboard from './components/Dashboard/Dashboard';
import ExamInterface from './components/Exam/ExamInterface';
import FullExamInterface from './components/Exam/FullExamInterface';
import ResultsView from './components/Results/ResultsView';
import LoadingSpinner from './components/UI/LoadingSpinner';

type AppState = 'landing' | 'login' | 'register' | 'dashboard' | 'exam' | 'fullExam' | 'results';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppState>('landing');
  const [currentSubject, setCurrentSubject] = useState('');

  const handleGetStarted = () => {
    setCurrentView('login');
  };

  const handleStartExam = (subject: string) => {
    setCurrentSubject(subject);
    setCurrentView('exam');
  };

  const handleStartFullExam = () => {
    setCurrentView('fullExam');
  };

  const handleExamComplete = () => {
    setCurrentView('results');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentSubject('');
  };

  const handleViewResults = () => {
    setCurrentView('results');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  if (loading) {
    return <LoadingSpinner message="Cargando ICFÉS ALLIASOFT" submessage="Preparando tu experiencia de aprendizaje..." />;
  }

  // If user is authenticated, show dashboard-related views
  if (user) {
    switch (currentView) {
      case 'exam':
        return (
          <ExamInterface
            subject={currentSubject}
            onExamComplete={handleExamComplete}
            onBackToDashboard={handleBackToDashboard}
          />
        );
      case 'fullExam':
        return (
          <FullExamInterface
            onExamComplete={handleExamComplete}
            onBackToDashboard={handleBackToDashboard}
          />
        );
      case 'results':
        return (
          <ResultsView onBackToDashboard={handleBackToDashboard} />
        );
      default:
        return (
          <Dashboard
            onStartExam={handleStartExam}
            onStartFullExam={handleStartFullExam}
            onViewResults={handleViewResults}
          />
        );
    }
  }

  // If user is not authenticated, show public views
  switch (currentView) {
    case 'login':
      return (
        <LoginForm
          onToggleMode={() => setCurrentView('register')}
          onBackToLanding={handleBackToLanding}
        />
      );
    case 'register':
      return (
        <RegisterForm
          onToggleMode={() => setCurrentView('login')}
          onBackToLanding={handleBackToLanding}
        />
      );
    default:
      return <LandingPage onGetStarted={handleGetStarted} />;
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;