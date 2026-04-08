import { DIFFICULTY_LEVELS } from '../utils/constants';

export const TOPICS = [
  {
    id: 'greetings',
    title: 'Saludos y Presentaciones',
    description: 'Aprende a saludar y presentarte en inglés',
    icon: '👋',
    color: '#4A90D9',
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    lessonsCount: 5,
    order: 1,
  },
  {
    id: 'numbers',
    title: 'Números y Cantidades',
    description: 'Practica la pronunciación de números del 1 al 100',
    icon: '🔢',
    color: '#27AE60',
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    lessonsCount: 4,
    order: 2,
  },
  {
    id: 'colors',
    title: 'Colores y Descripción',
    description: 'Describe objetos usando colores y adjetivos básicos',
    icon: '🎨',
    color: '#9B59B6',
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    lessonsCount: 4,
    order: 3,
  },
  {
    id: 'family',
    title: 'Familia y Relaciones',
    description: 'Habla sobre tu familia y relaciones personales',
    icon: '👨‍👩‍👧‍👦',
    color: '#E74C3C',
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    lessonsCount: 5,
    order: 4,
  },
  {
    id: 'food',
    title: 'Comida y Restaurante',
    description: 'Ordena comida y habla sobre tus preferencias',
    icon: '🍽️',
    color: '#F39C12',
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    lessonsCount: 6,
    order: 5,
  },
  {
    id: 'travel',
    title: 'Viajes y Transporte',
    description: 'Comunicarse durante viajes y en el aeropuerto',
    icon: '✈️',
    color: '#1ABC9C',
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    lessonsCount: 6,
    order: 6,
  },
  {
    id: 'work',
    title: 'Trabajo y Profesiones',
    description: 'Vocabulario del entorno laboral y profesional',
    icon: '💼',
    color: '#2C3E50',
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    lessonsCount: 7,
    order: 7,
  },
  {
    id: 'health',
    title: 'Salud y Cuerpo',
    description: 'Habla sobre síntomas, salud y visitas médicas',
    icon: '🏥',
    color: '#27AE60',
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    lessonsCount: 6,
    order: 8,
  },
  {
    id: 'debate',
    title: 'Debate y Opinión',
    description: 'Expresa y defiende tus opiniones en inglés',
    icon: '🗣️',
    color: '#E67E22',
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    lessonsCount: 8,
    order: 9,
  },
  {
    id: 'business',
    title: 'Inglés de Negocios',
    description: 'Comunicación formal en entornos empresariales',
    icon: '📊',
    color: '#2980B9',
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    lessonsCount: 8,
    order: 10,
  },
];

export function getTopicById(topicId) {
  return TOPICS.find((t) => t.id === topicId) || null;
}

export function getTopicsByDifficulty(difficulty) {
  return TOPICS.filter((t) => t.difficulty === difficulty);
}

export function getAvailableTopics(completedTopics = []) {
  // Los temas principiantes siempre están disponibles
  // Los intermedios se desbloquean al completar todos los principiantes
  // Los avanzados se desbloquean al completar todos los intermedios
  const beginnerDone = TOPICS.filter(
    (t) => t.difficulty === DIFFICULTY_LEVELS.BEGINNER
  ).every((t) => completedTopics.includes(t.id));

  const intermediateDone = TOPICS.filter(
    (t) => t.difficulty === DIFFICULTY_LEVELS.INTERMEDIATE
  ).every((t) => completedTopics.includes(t.id));

  return TOPICS.map((topic) => {
    let unlocked = true;
    if (topic.difficulty === DIFFICULTY_LEVELS.INTERMEDIATE && !beginnerDone) {
      unlocked = completedTopics.includes(topic.id);
    }
    if (topic.difficulty === DIFFICULTY_LEVELS.ADVANCED && !intermediateDone) {
      unlocked = completedTopics.includes(topic.id);
    }
    return { ...topic, unlocked };
  });
}
