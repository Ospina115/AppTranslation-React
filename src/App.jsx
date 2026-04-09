import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { IoHomeOutline, IoBookOutline, IoChatbubblesOutline, IoBarChartOutline, IoPersonOutline } from 'react-icons/io5';

import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import HomeScreen from './screens/student/HomeScreen';
import TopicsScreen from './screens/student/TopicsScreen';
import LessonScreen from './screens/student/LessonScreen';
import ChatbotScreen from './screens/student/ChatbotScreen';
import ProgressScreen from './screens/student/ProgressScreen';
import ProfileScreen from './screens/student/ProfileScreen';
import AdminDashboard from './screens/admin/AdminDashboard';
import StudentsListScreen from './screens/admin/StudentsListScreen';
import StudentDetailScreen from './screens/admin/StudentDetailScreen';

function StudentLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: <IoHomeOutline size={22} />, label: 'Inicio' },
    { path: '/topics', icon: <IoBookOutline size={22} />, label: 'Temas' },
    { path: '/chatbot', icon: <IoChatbubblesOutline size={22} />, label: 'Chat IA' },
    { path: '/progress', icon: <IoBarChartOutline size={22} />, label: 'Progreso' },
    { path: '/profile', icon: <IoPersonOutline size={22} />, label: 'Perfil' },
  ];

  return (
    <div className="student-layout">
      <div className="student-content">{children}</div>
      <nav className="bottom-nav">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              className={`bottom-nav-item${active ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (role === 'admin' && user.role !== 'admin') return <Navigate to="/home" replace />;
  if (role === 'student' && user.role === 'admin') return <Navigate to="/admin" replace />;

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user
            ? user.role === 'admin'
              ? <Navigate to="/admin" replace />
              : <Navigate to="/home" replace />
            : <LoginScreen />
        }
      />
      <Route
        path="/register"
        element={
          user ? <Navigate to={user.role === 'admin' ? '/admin' : '/home'} replace /> : <RegisterScreen />
        }
      />

      {/* Student routes */}
      <Route path="/home" element={
        <ProtectedRoute role="student">
          <StudentLayout><HomeScreen /></StudentLayout>
        </ProtectedRoute>
      } />
      <Route path="/topics" element={
        <ProtectedRoute role="student">
          <StudentLayout><TopicsScreen /></StudentLayout>
        </ProtectedRoute>
      } />
      <Route path="/lesson/:topicId" element={
        <ProtectedRoute role="student">
          <LessonScreen />
        </ProtectedRoute>
      } />
      <Route path="/chatbot" element={
        <ProtectedRoute role="student">
          <StudentLayout><ChatbotScreen /></StudentLayout>
        </ProtectedRoute>
      } />
      <Route path="/progress" element={
        <ProtectedRoute role="student">
          <StudentLayout><ProgressScreen /></StudentLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute role="student">
          <StudentLayout><ProfileScreen /></StudentLayout>
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/students" element={
        <ProtectedRoute role="admin">
          <StudentsListScreen />
        </ProtectedRoute>
      } />
      <Route path="/admin/students/:studentId" element={
        <ProtectedRoute role="admin">
          <StudentDetailScreen />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
