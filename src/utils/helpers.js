import { PRONUNCIATION_THRESHOLDS, POINTS } from './constants';

/**
 * Calcula el porcentaje de similitud entre dos cadenas de texto.
 * Usado para comparar pronunciación esperada vs reconocida.
 */
export function calculateSimilarity(expected, spoken) {
  if (!expected || !spoken) return 0;

  const normalize = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[.,!?;:]/g, '');

  const a = normalize(expected);
  const b = normalize(spoken);

  if (a === b) return 100;

  const aWords = a.split(/\s+/);
  const bWords = b.split(/\s+/);
  let matches = 0;

  aWords.forEach((word) => {
    if (bWords.includes(word)) matches++;
  });

  return Math.round((matches / Math.max(aWords.length, bWords.length)) * 100);
}

/**
 * Devuelve una etiqueta y color según el puntaje de pronunciación.
 */
export function getPronunciationFeedback(score) {
  if (score >= PRONUNCIATION_THRESHOLDS.EXCELLENT) {
    return { label: '¡Excelente!', color: '#27AE60', emoji: '🌟' };
  }
  if (score >= PRONUNCIATION_THRESHOLDS.GOOD) {
    return { label: '¡Bien hecho!', color: '#F39C12', emoji: '👍' };
  }
  if (score >= PRONUNCIATION_THRESHOLDS.NEEDS_PRACTICE) {
    return { label: 'Sigue practicando', color: '#E67E22', emoji: '💪' };
  }
  return { label: 'Inténtalo de nuevo', color: '#E74C3C', emoji: '🔄' };
}

/**
 * Calcula los puntos ganados en un ejercicio.
 */
export function calculatePoints(score, exerciseType) {
  let base = POINTS.EXERCISE_COMPLETE;
  if (score >= PRONUNCIATION_THRESHOLDS.EXCELLENT) {
    base += POINTS.PERFECT_SCORE;
  }
  return base;
}

/**
 * Formatea una fecha como cadena legible en español.
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formatea una duración en segundos como mm:ss.
 */
export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Genera un ID único simple.
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Calcula el nivel de usuario basado en puntos totales.
 */
export function getUserLevel(totalPoints) {
  if (totalPoints < 100) return { level: 1, title: 'Principiante', next: 100 };
  if (totalPoints < 300) return { level: 2, title: 'Aprendiz', next: 300 };
  if (totalPoints < 600) return { level: 3, title: 'Estudiante', next: 600 };
  if (totalPoints < 1000) return { level: 4, title: 'Practicante', next: 1000 };
  if (totalPoints < 1500) return { level: 5, title: 'Avanzado', next: 1500 };
  return { level: 6, title: 'Experto', next: null };
}

/**
 * Calcula el porcentaje de progreso en un tema.
 */
export function getTopicProgress(completedLessons, totalLessons) {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
}
