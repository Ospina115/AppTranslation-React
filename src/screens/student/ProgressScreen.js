import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import { getUserLevel, formatDate } from '../../utils/helpers';
import { TOPICS } from '../../data/topics';
import { getLessonsForTopic } from '../../data/exercises';

export default function ProgressScreen() {
  const { user } = useAuth();
  const { progress } = useAppContext();

  const level = getUserLevel(progress?.totalPoints || 0);
  const recentHistory = (progress?.exerciseHistory || []).slice(0, 10);

  return (
    <div className="screen-container">
      <h2 className="screen-title">�� Mi Progreso</h2>

      <Card className="progress-summary-card">
        <div className="progress-summary-row">
          <div className="progress-summary-item">
            <span className="summary-value">{progress?.totalPoints || 0}</span>
            <span className="summary-label">Puntos</span>
          </div>
          <div className="progress-summary-item">
            <span className="summary-value">{progress?.streak || 0}</span>
            <span className="summary-label">Días seguidos</span>
          </div>
          <div className="progress-summary-item">
            <span className="summary-value">{progress?.completedLessons?.length || 0}</span>
            <span className="summary-label">Lecciones</span>
          </div>
          <div className="progress-summary-item">
            <span className="summary-value">{level.level}</span>
            <span className="summary-label">Nivel</span>
          </div>
        </div>
      </Card>

      <h3 className="section-title">Progreso por Tema</h3>
      {TOPICS.map((topic) => {
        const tp = progress?.topicsProgress?.[topic.id];
        const lessons = getLessonsForTopic(topic.id);
        const completedCount = tp?.completedLessons?.length || 0;
        const totalCount = lessons.length;
        const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return (
          <div key={topic.id} className="topic-progress-item">
            <div className="topic-progress-header">
              <span className="topic-progress-icon">{topic.icon}</span>
              <div className="topic-progress-info">
                <p className="topic-progress-name">{topic.title}</p>
                <p className="topic-progress-detail">
                  {completedCount}/{totalCount} lecciones · {tp?.averageScore || 0}% promedio
                </p>
              </div>
              <span className="topic-progress-pct">{pct}%</span>
            </div>
            <ProgressBar progress={pct} height={6} color={topic.color} />
          </div>
        );
      })}

      {recentHistory.length > 0 && (
        <>
          <h3 className="section-title">Actividad Reciente</h3>
          {recentHistory.map((entry) => (
            <div key={entry.id} className="history-item">
              <div className="history-item-left">
                <span className="history-type">{entry.exerciseType?.replace(/_/g, ' ')}</span>
                <span className="history-date">{formatDate(entry.completedAt)}</span>
              </div>
              <div className="history-score" style={{ color: entry.score >= 70 ? '#27AE60' : '#E74C3C' }}>
                {entry.score}%
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
