import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoSearchOutline } from 'react-icons/io5';
import authService from '../../services/authService';
import progressService from '../../services/progressService';
import { getUserLevel } from '../../utils/helpers';

export default function StudentsListScreen() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const users = authService.getAllUsers();
    const studentList = users
      .filter((u) => u.role !== 'admin')
      .map((s) => {
        const prog = progressService.getUserProgress(s.id);
        return { ...s, progress: prog };
      });
    setStudents(studentList);
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-screen">
      <div className="admin-header">
        <button className="back-btn" onClick={() => navigate('/admin')}>
          <IoArrowBack size={20} /> Volver
        </button>
        <h2 className="admin-title">Estudiantes</h2>
      </div>

      <div className="search-bar">
        <IoSearchOutline size={18} className="search-icon" />
        <input
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o correo..."
        />
      </div>

      <p className="results-count">{filtered.length} estudiante{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.map((student) => {
        const level = getUserLevel(student.progress.totalPoints);
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
              <span className="admin-student-points">{student.progress.totalPoints} pts</span>
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <p className="empty-text">No se encontraron estudiantes.</p>
      )}
    </div>
  );
}
