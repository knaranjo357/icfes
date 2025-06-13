import { SUBJECT_CONFIG, SCORE_LEVELS } from './constants';

export const getSubjectDisplayName = (subject: string) => {
  return SUBJECT_CONFIG[subject as keyof typeof SUBJECT_CONFIG]?.displayName || subject;
};

export const getSubjectConfig = (subject: string) => {
  return SUBJECT_CONFIG[subject as keyof typeof SUBJECT_CONFIG] || SUBJECT_CONFIG.matematicas;
};

export const getScoreLevel = (score: number) => {
  if (score >= SCORE_LEVELS.excellent.threshold) return SCORE_LEVELS.excellent;
  if (score >= SCORE_LEVELS.good.threshold) return SCORE_LEVELS.good;
  return SCORE_LEVELS.improving;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getInitials = (email: string) => {
  return email.split('@')[0].slice(0, 2).toUpperCase();
};

export const getWelcomeMessage = () => {
  const hour = new Date().getHours();
  if (hour < 12) return '¡Buenos días';
  if (hour < 18) return '¡Buenas tardes';
  return '¡Buenas noches';
};

export const getMotivationalMessage = (averageScore: number) => {
  if (averageScore >= 85) return "¡Eres imparable! 🔥";
  if (averageScore >= 70) return "¡Vas por buen camino! 💪";
  if (averageScore >= 50) return "¡Sigue mejorando! 📈";
  return "¡Tu momento llegará! ⭐";
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};