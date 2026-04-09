import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

export default function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Correo no válido';
    if (!password) errs.password = 'La contraseña es requerida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    e && e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if (!result.success) {
      setServerError(result.error || 'No se pudo iniciar sesión.');
    } else {
      navigate(result.user?.role === 'admin' ? '/admin' : '/home', { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">🎤</span>
          <h1 className="auth-app-name">SpeakUp</h1>
          <p className="auth-subtitle">Mejora tu inglés con IA</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <h2 className="auth-form-title">Iniciar Sesión</h2>

          {serverError && <div className="error-banner">{serverError}</div>}

          <div className="input-group">
            <label className="input-label">Correo electrónico</label>
            <div className={`input-wrapper${errors.email ? ' input-error' : ''}`}>
              <IoMailOutline size={20} className="input-icon" />
              <input
                className="input-field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@correo.com"
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <label className="input-label">Contraseña</label>
            <div className={`input-wrapper${errors.password ? ' input-error' : ''}`}>
              <IoLockClosedOutline size={20} className="input-icon" />
              <input
                className="input-field"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <Button title="Iniciar Sesión" onPress={handleLogin} loading={loading} size="lg" className="btn-full" />

          <div className="hint-box">
            <IoInformationCircleOutline size={14} />
            <span className="hint-text">Admin: admin@apptranslation.edu / Admin123!</span>
          </div>

          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">¿No tienes cuenta?</span>
            <span className="divider-line" />
          </div>

          <Button
            title="Crear Cuenta"
            onPress={() => navigate('/register')}
            variant="outline"
            size="lg"
            className="btn-full"
          />
        </form>
      </div>
    </div>
  );
}
