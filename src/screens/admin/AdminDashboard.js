import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import authService from '../../services/authService';
import progressService from '../../services/progressService';
import { getUserLevel } from '../../utils/helpers';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, avgPoints: 0 });

  useEffect(() => {
    const users = authService.getAllUsers();
    const studentList = users.filter((u) => u.role !== 'admin');
    setStudents(studentList);

    const progressList = studentList.map((s) => progressService.getUserProgress(s.id));
    const totalPoints = progressList.reduce((sum, p) => sum + (p.totalPoints || 0), 0);
    const active = progressList.filter((p) => p.lastActivityDate).length;

    setStats({
      total: studentList.length,
      active,
      avgPoints: studentList.length > 0 ? Math.round(totalPoints / studentList.length) : 0,
    });
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm('¿Cerrar sesión?');
    if (confirmed) logout();
  };

  return (
    <div className="admin-screen">
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Panel de Administración</h2>
          <p className="admin-subtitle">Bienvenido, {user?.name}</p>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>Salir</button>
      </div>

      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <span className="admin-stat-value">{stats.total}</span>
          <span className="admin-stat-label">Estudiantes</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{stats.active}</span>
          <span className="admin-stat-label">Activos</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-value">{stats.avgPoints}</span>
          <span className="admin-stat-label">Pts. Promedio</span>
        </div>
      </div>

      <h3 className="section-title">Acciones Rápidas</h3>
      <div className="admin-actions">
        <Button
          title="👥 Ver Estudiantes"
          onPress={() => navigate('/admin/students')}
          variant="primary"
          size="lg"
          className="btn-full"
        />
      </div>

      <h3 className="section-title">Estudiantes Recientes</h3>
      {students.slice(0, 5).map((student) => {
        const prog = progressService.getUserProgress(student.id);
        const level = getUserLevel(prog.totalPoints);
        return (
          <div
            key={student.id}
            className="admin-student-item"
            onClick={() => navigate(`/admin/students/${student.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="admin-student-avatar">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="admin-student-info">
              <p className="admin-student-name">{student.name}</p>
              <p className="admin-student-meta">{student.email}</p>
            </div>
            <div className="admin-student-stats">
              <span className="admin-student-level">Nv. {level.level}</span>
              <span className="admin-student-points">{prog.totalPoints} pts</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
