import { STORAGE_KEYS } from '../utils/constants';
import { generateId } from '../utils/helpers';

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

function getUserProgress(userId) {
  try {
    const key = `${STORAGE_KEYS.PROGRESS}_${userId}`;
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);
    return getDefaultProgress(userId);
  } catch (error) {
    console.error('Error getting progress:', error);
    return getDefaultProgress(userId);
  }
}

function saveUserProgress(userId, progress) {
  try {
    const key = `${STORAGE_KEYS.PROGRESS}_${userId}`;
    localStorage.setItem(key, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

async function recordExerciseComplete(userId, { topicId, lessonId, exerciseId, score, exerciseType }) {
  try {
    const progress = getUserProgress(userId);
    const today = new Date().toISOString().split('T')[0];

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

    let points = 10;
    if (score >= 90) points += 25;
    else if (score >= 70) points += 10;
    progress.totalPoints += points;

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

    const safeTopicId = String(topicId).replace(/[^a-zA-Z0-9_-]/g, '_');
    if (!Object.prototype.hasOwnProperty.call(progress.topicsProgress, safeTopicId)) {
      progress.topicsProgress[safeTopicId] = {
        topicId: safeTopicId,
        completedLessons: [],
        totalScore: 0,
        exercisesCount: 0,
        averageScore: 0,
      };
    }
    const tp = progress.topicsProgress[safeTopicId];
    tp.totalScore += score;
    tp.exercisesCount += 1;
    tp.averageScore = Math.round(tp.totalScore / tp.exercisesCount);

    saveUserProgress(userId, progress);
    return { success: true, pointsEarned: points, progress };
  } catch (error) {
    console.error('Error recording exercise:', error);
    return { success: false, error: error.message };
  }
}

async function markLessonComplete(userId, topicId, lessonId) {
  try {
    const progress = getUserProgress(userId);
    const safeTopicId = String(topicId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const lessonKey = `${safeTopicId}_${lessonId}`;

    if (!progress.completedLessons.includes(lessonKey)) {
      progress.completedLessons.push(lessonKey);
      progress.totalPoints += 50;

      if (Object.prototype.hasOwnProperty.call(progress.topicsProgress, safeTopicId)) {
        const tp = progress.topicsProgress[safeTopicId];
        if (!tp.completedLessons.includes(lessonId)) {
          tp.completedLessons.push(lessonId);
        }
      }
    }

    saveUserProgress(userId, progress);
    return { success: true, progress };
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    return { success: false };
  }
}

async function getAllUsersProgress(userIds) {
  try {
    return userIds.map((id) => getUserProgress(id));
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
