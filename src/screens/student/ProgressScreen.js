import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getLessonsForTopic } from '../../data/exercises';
import { TOPICS } from '../../data/topics';
import { formatDate, getUserLevel } from '../../utils/helpers';

export default function ProgressScreen() {
  const { user } = useAuth();
  const { progress } = useAppContext();

  const level = getUserLevel(progress?.totalPoints || 0);
  const recentHistory = (progress?.exerciseHistory || []).slice(0, 10);
  const totalPoints = progress?.totalPoints || 0;
  const streak = progress?.streak || 0;
  const completedLessons = progress?.completedLessons?.length || 0;
  const totalExercises = progress?.exerciseHistory?.length || 0;
  const averageScore = totalExercises
    ? Math.round(
        (progress.exerciseHistory.reduce((acc, entry) => acc + (entry.score || 0), 0) /
          totalExercises)
      )
    : 0;
  const firstName = user?.name?.split(' ')[0] || 'Estudiante';

  return (
    <div className="screen-container progress-screen">
      <section className="progress-hero">
        <div>
          <p className="progress-eyebrow">Panel de rendimiento</p>
          <h2 className="screen-title">Mi progreso</h2>
          <p className="progress-subtitle">{firstName}, este es tu avance en el entrenamiento de hoy.</p>
        </div>
        <div className="progress-level-chip">
          <span className="progress-level-label">Nivel</span>
          <span className="progress-level-value">{level.level}</span>
        </div>
      </section>

      <Card className="progress-summary-card">
        <div className="progress-summary-row">
          <div className="progress-summary-item">
            <span className="summary-value">{totalPoints}</span>
            <span className="summary-label">Puntos</span>
          </div>
          <div className="progress-summary-item">
            <span className="summary-value">{streak}</span>
            <span className="summary-label">Días seguidos</span>
          </div>
          <div className="progress-summary-item">
            <span className="summary-value">{completedLessons}</span>
            <span className="summary-label">Lecciones</span>
          </div>
          <div className="progress-summary-item">
            <span className="summary-value">{averageScore}%</span>
            <span className="summary-label">Promedio</span>
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
