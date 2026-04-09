import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import authService from '../../services/authService';
import progressService from '../../services/progressService';
import { getUserLevel, formatDate } from '../../utils/helpers';
import { TOPICS } from '../../data/topics';
import { getLessonsForTopic } from '../../data/exercises';

export default function StudentDetailScreen() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const users = authService.getAllUsers();
    const found = users.find((u) => u.id === studentId);
    setStudent(found || null);
    if (found) {
      const prog = progressService.getUserProgress(found.id);
      setProgress(prog);
    }
  }, [studentId]);

  if (!student) {
    return (
      <div className="admin-screen center-content">
        <p className="empty-text">Estudiante no encontrado.</p>
        <button className="back-btn" onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  const level = getUserLevel(progress?.totalPoints || 0);

  return (
    <div className="admin-screen">
      <div className="admin-header">
        <button className="back-btn" onClick={() => navigate('/admin/students')}>
          <IoArrowBack size={20} /> Volver
        </button>
        <h2 className="admin-title">Detalle Estudiante</h2>
      </div>

      <Card className="profile-card">
        <div className="profile-avatar">
          <span className="profile-avatar-initial">{student.name.charAt(0).toUpperCase()}</span>
        </div>
        <h3 className="profile-name">{student.name}</h3>
        <p className="profile-email">{student.email}</p>
        <span className="profile-level-badge">Nivel {level.level} – {level.title}</span>
      </Card>

      <h3 className="section-title">Estadísticas Generales</h3>
      <Card>
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{progress?.totalPoints || 0}</span>
            <span className="profile-stat-label">Puntos</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{progress?.streak || 0}</span>
            <span className="profile-stat-label">Racha</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{progress?.completedLessons?.length || 0}</span>
            <span className="profile-stat-label">Lecciones</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{progress?.exerciseHistory?.length || 0}</span>
            <span className="profile-stat-label">Ejercicios</span>
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

      <h3 className="section-title">Info de Cuenta</h3>
      <Card>
        <div className="account-info">
          <div className="account-row">
            <span className="account-label">Registrado</span>
            <span className="account-value">{formatDate(student.createdAt)}</span>
          </div>
          <div className="account-row">
            <span className="account-label">Último acceso</span>
            <span className="account-value">{formatDate(student.lastLogin) || 'Nunca'}</span>
          </div>
          <div className="account-row">
            <span className="account-label">Última actividad</span>
            <span className="account-value">{formatDate(progress?.lastActivityDate) || 'Sin actividad'}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
