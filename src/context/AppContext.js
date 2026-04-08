import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import progressService from '../services/progressService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  const loadProgress = useCallback(async () => {
    if (!user) return;
    setLoadingProgress(true);
    const p = await progressService.getUserProgress(user.id);
    setProgress(p);
    setLoadingProgress(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProgress();
    } else {
      setProgress(null);
    }
  }, [user, loadProgress]);

  const recordExercise = async ({ topicId, lessonId, exerciseId, score, exerciseType }) => {
    if (!user) return;
    const result = await progressService.recordExerciseComplete(user.id, {
      topicId,
      lessonId,
      exerciseId,
      score,
      exerciseType,
    });
    if (result.success) {
      setProgress(result.progress);
    }
    return result;
  };

  const completeLesson = async (topicId, lessonId) => {
    if (!user) return;
    const result = await progressService.markLessonComplete(user.id, topicId, lessonId);
    if (result.success) {
      setProgress(result.progress);
    }
    return result;
  };

  const isLessonCompleted = (topicId, lessonId) => {
    if (!progress) return false;
    return progress.completedLessons.includes(`${topicId}_${lessonId}`);
  };

  const getTopicProgress = (topicId) => {
    if (!progress) return null;
    return progress.topicsProgress[topicId] || null;
  };

  return (
    <AppContext.Provider
      value={{
        progress,
        loadingProgress,
        loadProgress,
        recordExercise,
        completeLesson,
        isLessonCompleted,
        getTopicProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de AppProvider');
  }
  return context;
}

export default AppContext;
