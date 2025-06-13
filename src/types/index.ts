export interface User {
  id: number;
  created_at: string;
  correo: string;
  contraseña: string;
  nombre: string | null;
  colegio: string | null;
  grado: string | null;
  rol: string;
}

export interface Question {
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
}

export interface ExamResult {
  id: number;
  created_at: string;
  usuario: number;
  tipo: string | null;
  materia: string;
  resultado: string;
  tiempo: string | null;
}

export interface DetailedResult {
  id: number;
  created_at: string;
  usuario: number;
  pregunta: number;
  respuesta: string;
  prueba: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface ExamState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, string>;
  startTime: number;
  isSubmitting: boolean;
}

export interface ChartData {
  name: string;
  score: number;
  exams: number;
  color: string;
}