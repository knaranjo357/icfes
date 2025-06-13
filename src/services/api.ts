const API_BASE_URL = 'https://n8n.alliasoft.com/webhook/icfes';

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiService = {
  async register(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new ApiError('Error al registrar usuario', response.status);
      }

      const data = await response.json();
      return data[0];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Error de conexión al registrar usuario');
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new ApiError('Credenciales incorrectas', response.status);
      }

      const data = await response.json();
      return data[0];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Error de conexión al iniciar sesión');
    }
  },

  async getQuickExam(subject: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/examen_rapido?materia=${subject}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new ApiError('Error al obtener examen', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Error de conexión al obtener examen');
    }
  },

  async getFullExam() {
    try {
      const subjects = ['matematicas', 'ciencias naturales', 'sociales y ciudadanas', 'lectura', 'ingles'];
      const allQuestions = [];
      
      // Fetch questions from each subject
      for (const subject of subjects) {
        const questions = await this.getQuickExam(subject);
        allQuestions.push(...questions);
      }
      
      // Shuffle questions to create a mixed exam
      const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);
      
      return shuffledQuestions;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Error de conexión al obtener examen completo');
    }
  },

  async submitAnswers(answers: Array<[number, string]>, token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/respuestas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ respuestas: answers }),
      });

      if (!response.ok) {
        throw new ApiError('Error al enviar respuestas', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Error de conexión al enviar respuestas');
    }
  },

  async getResults(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/resultados`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new ApiError('Error al obtener resultados', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Error de conexión al obtener resultados');
    }
  },

  async getDetailedResults(prueba_id: number, token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/resultados_detalles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ prueba_id }),
      });

      if (!response.ok) {
        throw new ApiError('Error al obtener resultados detallados', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Error de conexión al obtener resultados detallados');
    }
  },
};