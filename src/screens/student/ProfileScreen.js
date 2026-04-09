import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getUserLevel, formatDate } from '../../utils/helpers';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { progress } = useAppContext();

  const level = getUserLevel(progress?.totalPoints || 0);

  const handleLogout = () => {
    const confirmed = window.confirm('¿Seguro que quieres cerrar sesión?');
    if (confirmed) logout();
  };

  return (
    <div className="screen-container">
      <h2 className="screen-title">👤 Mi Perfil</h2>

      <Card className="profile-card">
        <div className="profile-avatar">
          <span className="profile-avatar-emoji">👤</span>
        </div>
        <h3 className="profile-name">{user?.name}</h3>
        <p className="profile-email">{user?.email}</p>
        <div className="profile-level-badge">
          <span>Nivel {level.level} – {level.title}</span>
        </div>
      </Card>

      <h3 className="section-title">Estadísticas</h3>
      <Card>
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{progress?.totalPoints || 0}</span>
            <span className="profile-stat-label">Puntos totales</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{progress?.streak || 0}</span>
            <span className="profile-stat-label">Racha (días)</span>
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

      <h3 className="section-title">Información de Cuenta</h3>
      <Card>
        <div className="account-info">
          <div className="account-row">
            <span className="account-label">Miembro desde</span>
            <span className="account-value">{formatDate(user?.createdAt)}</span>
          </div>
          <div className="account-row">
            <span className="account-label">Último acceso</span>
            <span className="account-value">{formatDate(user?.lastLogin) || 'Hoy'}</span>
          </div>
          <div className="account-row">
            <span className="account-label">Rol</span>
            <span className="account-value">{user?.role === 'admin' ? 'Administrador' : 'Estudiante'}</span>
          </div>
        </div>
      </Card>

      <Button
        title="Cerrar Sesión"
        onPress={handleLogout}
        variant="danger"
        size="lg"
        className="btn-full"
        style={{ marginTop: 24 }}
      />
    </div>
  );
}
