import { IoCheckmarkCircle, IoLockClosed } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/common/ProgressBar';
import { useAppContext } from '../../context/AppContext';
import { getLessonsForTopic } from '../../data/exercises';
import { getAvailableTopics } from '../../data/topics';
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from '../../utils/constants';

export default function TopicsScreen() {
  const { progress, getTopicProgress } = useAppContext();
  const navigate = useNavigate();

  const completedTopicIds = progress?.completedTopics || [];
  const topics = getAvailableTopics(completedTopicIds);

  const groupByDifficulty = (topicList) => {
    const groups = {};
    topicList.forEach((t) => {
      if (!groups[t.difficulty]) groups[t.difficulty] = [];
      groups[t.difficulty].push(t);
    });
    return groups;
  };

  const groups = groupByDifficulty(topics);
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const completedLessons = progress?.completedLessons?.length || 0;
  const completedTopics = progress?.completedTopics?.length || 0;

  return (
    <div className="screen-container topics-screen">
      <section className="topics-hero">
        <div>
          <p className="topics-eyebrow">Mapa de aprendizaje</p>
          <h2 className="topics-title">Temas disponibles</h2>
          <p className="topics-subtitle">Avanza por niveles y desbloquea nuevo contenido.</p>
        </div>
        <div className="topics-hero-stats">
          <div className="topics-hero-stat">
            <span className="topics-hero-value">{completedLessons}</span>
            <span className="topics-hero-label">Lecciones</span>
          </div>
          <div className="topics-hero-divider" />
          <div className="topics-hero-stat">
            <span className="topics-hero-value">{completedTopics}</span>
            <span className="topics-hero-label">Temas</span>
          </div>
        </div>
      </section>

      {difficulties.map((difficulty) => {
        const group = groups[difficulty];
        if (!group || group.length === 0) return null;
        return (
          <div key={difficulty} className="topics-section">
            <div className="section-header-row">
              <span
                className="section-dot"
                style={{ backgroundColor: DIFFICULTY_COLORS[difficulty] }}
              />
              <h3 className="section-title" style={{ margin: 0 }}>
                {DIFFICULTY_LABELS[difficulty]}
              </h3>
            </div>
            {group.map((topic) => {
              const topicProgress = getTopicProgress(topic.id);
              const lessons = getLessonsForTopic(topic.id);
              const completedCount = topicProgress?.completedLessons?.length || 0;
              const totalCount = lessons.length;
              const progressPercent =
                totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

              return (
                <div
                  key={topic.id}
                  className={`topic-card${!topic.unlocked ? ' topic-locked' : ''}`}
                  onClick={() => {
                    if (topic.unlocked) navigate(`/lesson/${topic.id}`);
                  }}
                  style={{ cursor: topic.unlocked ? 'pointer' : 'default' }}
                >
                  <div className="topic-card-header">
                    <div
                      className="topic-icon-container"
                      style={{ backgroundColor: topic.color + '20' }}
                    >
                      <span className="topic-card-icon">{topic.icon}</span>
                    </div>
                    <div className="topic-meta">
                      <div className="topic-title-row">
                        <span className="topic-card-title">{topic.title}</span>
                        {!topic.unlocked && <IoLockClosed size={14} color="#BDC3C7" />}
                      </div>
                      <span
                        className="diff-badge"
                        style={{
                          backgroundColor: DIFFICULTY_COLORS[topic.difficulty] + '20',
                          color: DIFFICULTY_COLORS[topic.difficulty],
                        }}
                      >
                        {DIFFICULTY_LABELS[topic.difficulty]}
                      </span>
                    </div>
                    {progressPercent === 100 && (
                      <IoCheckmarkCircle size={22} color="#27AE60" />
                    )}
                  </div>

                  <p className="topic-card-desc">{topic.description}</p>

                  {topic.unlocked && (
                    <ProgressBar
                      progress={progressPercent}
                      height={6}
                      color={topic.color}
                      showLabel
                      label={`${completedCount}/${totalCount} lecciones`}
                    />
                  )}

                  {!topic.unlocked && (
                    <p className="locked-text">
                      Completa los temas anteriores para desbloquear
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
