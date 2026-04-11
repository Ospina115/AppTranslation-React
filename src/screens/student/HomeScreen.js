import { IoBarChart, IoBook, IoChatbubbles, IoChevronForward, IoFlame, IoStar } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { TOPICS } from '../../data/topics';
import { getUserLevel } from '../../utils/helpers';

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
  const firstName = user?.name?.split(' ')[0] || 'Estudiante';
  const totalPoints = progress?.totalPoints || 0;
  const completedLessons = progress?.completedLessons?.length || 0;
  const totalLessons = TOPICS.reduce((acc, topic) => acc + (topic.lessonsCount || 0), 0);
  const completionPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const streak = progress?.streak || 0;
  const pointsToNext = level.next ? Math.max(level.next - totalPoints, 0) : 0;

  return (
    <div className="screen-container home-screen">
      <section className="home-hero">
        <div className="home-hero-text">
          <p className="home-eyebrow">Tu espacio de práctica</p>
          <h2 className="home-greeting">Hola, {firstName}</h2>
          <p className="home-subtitle">Sigue tu racha y completa una lección hoy.</p>
        </div>
        <div className="home-streak-pill" title="Racha actual">
          <span className="home-streak-icon">🔥</span>
          <div>
            <p className="home-streak-value">{streak} días</p>
            <p className="home-streak-label">Racha activa</p>
          </div>
        </div>
      </section>

      <Card className="home-level-card">
        <div className="home-level-head">
          <p className="home-level-chip">Nivel {level.level}</p>
          <p className="home-level-caption">{totalPoints} puntos acumulados</p>
        </div>
        <div className="level-row">
          <div className="level-badge-circle">
            <span className="level-number">{level.level}</span>
          </div>
          <div className="level-info">
            <p className="level-title">{level.title}</p>
            <ProgressBar progress={levelProgress} height={10} color="#F5A623" style={{ marginTop: 8 }} />
            {level.next ? (
              <p className="level-next-text">
                Te faltan {pointsToNext} puntos para el siguiente nivel
              </p>
            ) : (
              <p className="level-next-text">Nivel máximo alcanzado, excelente trabajo</p>
            )}
          </div>
        </div>
      </Card>

      <div className="home-stats-grid">
        <div className="stat-card">
          <IoBook size={22} color="#4A90D9" />
          <span className="stat-value">{completedLessons}</span>
          <span className="stat-label">Completadas</span>
        </div>
        <div className="stat-card">
          <IoFlame size={22} color="#4A90D9" />
          <span className="stat-value">{streak} días</span>
          <span className="stat-label">Racha</span>
        </div>
        <div className="stat-card">
          <IoStar size={22} color="#4A90D9" />
          <span className="stat-value">{totalPoints}</span>
          <span className="stat-label">Puntos</span>
        </div>
        <div className="stat-card stat-card-wide">
          <div className="stat-wide-top">
            <span className="stat-wide-title">Ruta de aprendizaje</span>
            <span className="stat-wide-value">{completionPercent}%</span>
          </div>
          <ProgressBar progress={completionPercent} height={8} color="#27AE60" />
          <p className="stat-wide-caption">{completedLessons} de {totalLessons} lecciones completadas</p>
        </div>
      </div>

      <h3 className="section-title">Acceso rápido</h3>
      <div className="home-actions-grid">
        <button className="home-action-btn" onClick={() => navigate('/chatbot')}>
          <div className="action-icon" style={{ backgroundColor: '#4A90D91A' }}>
            <IoChatbubbles size={26} color="#4A90D9" />
          </div>
          <span className="action-label">Practicar con IA</span>
          <span className="action-caption">Conversación guiada y correcciones</span>
        </button>
        <button className="home-action-btn" onClick={() => navigate('/topics')}>
          <div className="action-icon" style={{ backgroundColor: '#F5A6231A' }}>
            <IoBook size={26} color="#F5A623" />
          </div>
          <span className="action-label">Explorar temas</span>
          <span className="action-caption">Selecciona una lección para continuar</span>
        </button>
        <button className="home-action-btn" onClick={() => navigate('/progress')}>
          <div className="action-icon" style={{ backgroundColor: '#27AE601A' }}>
            <IoBarChart size={26} color="#27AE60" />
          </div>
          <span className="action-label">Ver progreso</span>
          <span className="action-caption">Métricas, historial y avance por tema</span>
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
          <IoChevronForward className="chevron" size={18} />
        </button>
      ))}
    </div>
  );
}
