// Colores de la aplicación
export const COLORS = {
  primary: '#4A90D9',
  primaryDark: '#2C6FAC',
  primaryLight: '#EBF4FF',
  secondary: '#F5A623',
  secondaryLight: '#FFF3DC',
  success: '#27AE60',
  successLight: '#E8F8EF',
  error: '#E74C3C',
  errorLight: '#FDECEB',
  warning: '#F39C12',
  warningLight: '#FEF9E7',
  text: '#2C3E50',
  textLight: '#7F8C8D',
  textMuted: '#BDC3C7',
  background: '#F8FAFC',
  white: '#FFFFFF',
  border: '#E5E9ED',
  cardBg: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.5)',
};

// Tipografías
export const FONTS = {
  regular: 'System',
  bold: 'System',
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    title: 36,
  },
};

// Espaciado
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Bordes redondeados
export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 28,
  full: 100,
};

// Niveles de dificultad
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

export const DIFFICULTY_LABELS = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

export const DIFFICULTY_COLORS = {
  beginner: '#27AE60',
  intermediate: '#F39C12',
  advanced: '#E74C3C',
};

// Tipos de ejercicio
export const EXERCISE_TYPES = {
  LISTEN_REPEAT: 'listen_repeat',
  READ_ALOUD: 'read_aloud',
  CONVERSATION: 'conversation',
  FILL_BLANK: 'fill_blank',
  WORD_MATCH: 'word_match',
};

// Roles de usuario
export const USER_ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

// Rutas de navegación
export const ROUTES = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',
  // Student
  STUDENT_HOME: 'StudentHome',
  TOPICS: 'Topics',
  LESSON: 'Lesson',
  CHATBOT: 'Chatbot',
  PROGRESS: 'Progress',
  PROFILE: 'Profile',
  // Admin
  ADMIN_DASHBOARD: 'AdminDashboard',
  STUDENTS_LIST: 'StudentsList',
  STUDENT_DETAIL: 'StudentDetail',
};

// Clave de almacenamiento local
export const STORAGE_KEYS = {
  USER: '@app_translation_user',
  USERS_DB: '@app_translation_users_db',
  PROGRESS: '@app_translation_progress',
  SETTINGS: '@app_translation_settings',
};

// Puntos por actividad
export const POINTS = {
  EXERCISE_COMPLETE: 10,
  LESSON_COMPLETE: 50,
  PERFECT_SCORE: 25,
  DAILY_STREAK: 15,
};

// Umbrales de pronunciación
export const PRONUNCIATION_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 70,
  NEEDS_PRACTICE: 50,
};
