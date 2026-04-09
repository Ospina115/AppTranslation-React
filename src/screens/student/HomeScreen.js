import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoBook, IoFlame, IoStar, IoChatbubbles, IoBarChart } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import { getUserLevel } from '../../utils/helpers';
import { TOPICS } from '../../data/topics';

function getPrevLevelPoints(level) {
  const map = { 1: 0, 2: 100, 3: 300, 4: 600, 5: 1000, 6: 1500 };
  return map[level] || 0;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { progress } = useAppContext();
  const navigate = useNavigate();

  const level = getUserLevel(progress?.totalPoints || 0);
  const levelProgress = progress
    ? level.next
      ? Math.round(
          ((progress.totalPoints - getPrevLevelPoints(level.level)) /
            (level.next - getPrevLevelPoints(level.level))) *
            100
        )
      : 100
    : 0;

  const recentTopics = TOPICS.slice(0, 3);

  return (
    <div className="screen-container">
      <div className="home-header">
        <div>
          <h2 className="home-greeting">
            👋 Hola, {user?.name?.split(' ')[0] || 'Estudiante'}
          </h2>
          <p className="home-subtitle">¿Listo para practicar hoy?</p>
        </div>
        <div className="streak-badge">
          <span className="streak-icon">🔥</span>
          <span className="streak-count">{progress?.streak || 0}</span>
        </div>
      </div>

      <Card className="level-card">
        <div className="level-row">
          <div className="level-badge-circle">
            <span className="level-number">{level.level}</span>
          </div>
          <div className="level-info">
            <p className="level-title">Nivel {level.level} – {level.title}</p>
            <p className="level-points">{progress?.totalPoints || 0} puntos totales</p>
            <ProgressBar progress={levelProgress} height={8} color="#F5A623" style={{ marginTop: 4 }} />
            {level.next && (
              <p className="level-next-text">
                {level.next - (progress?.totalPoints || 0)} puntos para el siguiente nivel
              </p>
            )}
          </div>
        </div>
      </Card>

      <div className="stats-row">
        <div className="stat-card">
          <IoBook size={22} color="#4A90D9" />
          <span className="stat-value">{progress?.completedLessons?.length || 0}</span>
          <span className="stat-label">Lecciones</span>
        </div>
        <div className="stat-card">
          <IoFlame size={22} color="#4A90D9" />
          <span className="stat-value">{progress?.streak || 0} días</span>
          <span className="stat-label">Racha</span>
        </div>
        <div className="stat-card">
          <IoStar size={22} color="#4A90D9" />
          <span className="stat-value">{progress?.totalPoints || 0}</span>
          <span className="stat-label">Puntos</span>
        </div>
      </div>

      <h3 className="section-title">Acción Rápida</h3>
      <div className="actions-row">
        <button className="action-btn" onClick={() => navigate('/chatbot')}>
          <div className="action-icon" style={{ backgroundColor: '#4A90D915' }}>
            <IoChatbubbles size={26} color="#4A90D9" />
          </div>
          <span className="action-label">Chatbot IA</span>
        </button>
        <button className="action-btn" onClick={() => navigate('/topics')}>
          <div className="action-icon" style={{ backgroundColor: '#F5A62315' }}>
            <IoBook size={26} color="#F5A623" />
          </div>
          <span className="action-label">Ver Temas</span>
        </button>
        <button className="action-btn" onClick={() => navigate('/progress')}>
          <div className="action-icon" style={{ backgroundColor: '#27AE6015' }}>
            <IoBarChart size={26} color="#27AE60" />
          </div>
          <span className="action-label">Mi Progreso</span>
        </button>
      </div>

      <h3 className="section-title">Continúa Aprendiendo</h3>
      {recentTopics.map((topic) => (
        <button
          key={topic.id}
          className="topic-item"
          onClick={() => navigate('/topics')}
        >
          <div className="topic-icon-box" style={{ backgroundColor: topic.color + '20' }}>
            <span className="topic-emoji">{topic.icon}</span>
          </div>
          <div className="topic-item-info">
            <p className="topic-item-name">{topic.title}</p>
            <p className="topic-item-desc">{topic.description}</p>
          </div>
          <span className="chevron">›</span>
        </button>
      ))}
    </div>
  );
}
