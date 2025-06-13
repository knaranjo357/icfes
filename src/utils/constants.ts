export const SUBJECT_CONFIG = {
  'matematicas': {
    displayName: 'Matemáticas',
    description: 'Álgebra, geometría, cálculo y estadística',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    lightColor: 'bg-blue-100 text-blue-700 border-blue-200',
    chartColor: '#3B82F6'
  },
  'ciencias naturales': {
    displayName: 'Ciencias Naturales',
    description: 'Física, química y biología aplicada',
    color: 'bg-gradient-to-br from-green-500 to-green-600',
    lightColor: 'bg-green-100 text-green-700 border-green-200',
    chartColor: '#10B981'
  },
  'sociales y ciudadanas': {
    displayName: 'Sociales y Ciudadanas',
    description: 'Historia, geografía y competencias cívicas',
    color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    lightColor: 'bg-orange-100 text-orange-700 border-orange-200',
    chartColor: '#F59E0B'
  },
  'lectura': {
    displayName: 'Lectura Crítica',
    description: 'Comprensión lectora y análisis textual',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    lightColor: 'bg-purple-100 text-purple-700 border-purple-200',
    chartColor: '#8B5CF6'
  },
  'ingles': {
    displayName: 'Inglés',
    description: 'Comprensión y uso del idioma inglés',
    color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    lightColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    chartColor: '#6366F1'
  }
} as const;

export const SCORE_LEVELS = {
  excellent: { threshold: 80, label: 'Excelente', color: 'text-green-600', icon: '🏆' },
  good: { threshold: 60, label: 'Bueno', color: 'text-blue-600', icon: '🎯' },
  improving: { threshold: 0, label: 'Mejorando', color: 'text-orange-600', icon: '📚' }
} as const;

export const API_ENDPOINTS = {
  BASE_URL: 'https://n8n.alliasoft.com/webhook/icfes',
  REGISTER: '/usuarios',
  LOGIN: '/login',
  QUICK_EXAM: '/examen_rapido',
  SUBMIT_ANSWERS: '/respuestas',
  RESULTS: '/resultados',
  DETAILED_RESULTS: '/resultados_detalles'
} as const;