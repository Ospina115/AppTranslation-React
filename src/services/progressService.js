import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

/**
 * Obtiene el progreso completo de un usuario.
 */
async function getUserProgress(userId) {
  try {
    const key = `${STORAGE_KEYS.PROGRESS}_${userId}`;
    const data = await AsyncStorage.getItem(key);
    if (data) return JSON.parse(data);
    return getDefaultProgress(userId);
  } catch (error) {
    console.error('Error getting progress:', error);
    return getDefaultProgress(userId);
  }
}

function getDefaultProgress(userId) {
  return {
    userId,
    totalPoints: 0,
    streak: 0,
    lastActivityDate: null,
    completedLessons: [],
    completedTopics: [],
    exerciseHistory: [],
    topicsProgress: {},
  };
}

/**
 * Guarda el progreso del usuario.
 */
async function saveUserProgress(userId, progress) {
  try {
    const key = `${STORAGE_KEYS.PROGRESS}_${userId}`;
    await AsyncStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

/**
 * Registra la completación de un ejercicio.
 */
async function recordExerciseComplete(userId, { topicId, lessonId, exerciseId, score, exerciseType }) {
  try {
    const progress = await getUserProgress(userId);
    const today = new Date().toISOString().split('T')[0];

    // Calcular racha diaria
    if (progress.lastActivityDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      if (progress.lastActivityDate === yesterdayStr) {
        progress.streak += 1;
      } else if (progress.lastActivityDate !== today) {
        progress.streak = 1;
      }
      progress.lastActivityDate = today;
    }

    // Puntos base por ejercicio
    let points = 10;
    if (score >= 90) points += 25;
    else if (score >= 70) points += 10;
    progress.totalPoints += points;

    // Historial de ejercicios
    const historyEntry = {
      id: generateId(),
      topicId,
      lessonId,
      exerciseId,
      score,
      exerciseType,
      completedAt: new Date().toISOString(),
      pointsEarned: points,
    };
    progress.exerciseHistory = [historyEntry, ...progress.exerciseHistory].slice(0, 200);

    // Progreso por tema
    if (!progress.topicsProgress[topicId]) {
      progress.topicsProgress[topicId] = {
        topicId,
        completedLessons: [],
        totalScore: 0,
        exercisesCount: 0,
        averageScore: 0,
      };
    }
    const tp = progress.topicsProgress[topicId];
    tp.totalScore += score;
    tp.exercisesCount += 1;
    tp.averageScore = Math.round(tp.totalScore / tp.exercisesCount);

    await saveUserProgress(userId, progress);
    return { success: true, pointsEarned: points, progress };
  } catch (error) {
    console.error('Error recording exercise:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Marca una lección como completada.
 */
async function markLessonComplete(userId, topicId, lessonId) {
  try {
    const progress = await getUserProgress(userId);
    const lessonKey = `${topicId}_${lessonId}`;

    if (!progress.completedLessons.includes(lessonKey)) {
      progress.completedLessons.push(lessonKey);
      progress.totalPoints += 50; // Bonus por completar lección

      if (progress.topicsProgress[topicId]) {
        const tp = progress.topicsProgress[topicId];
        if (!tp.completedLessons.includes(lessonId)) {
          tp.completedLessons.push(lessonId);
        }
      }
    }

    await saveUserProgress(userId, progress);
    return { success: true, progress };
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    return { success: false };
  }
}

/**
 * Obtiene el progreso de todos los usuarios (para admin).
 */
async function getAllUsersProgress(userIds) {
  try {
    const progressList = await Promise.all(
      userIds.map((id) => getUserProgress(id))
    );
    return progressList;
  } catch (error) {
    console.error('Error getting all progress:', error);
    return [];
  }
}

const progressService = {
  getUserProgress,
  saveUserProgress,
  recordExerciseComplete,
  markLessonComplete,
  getAllUsersProgress,
  getDefaultProgress,
};

export default progressService;
