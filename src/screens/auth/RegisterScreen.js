import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoPersonOutline, IoMailOutline, IoLockClosedOutline,
  IoShieldCheckmarkOutline, IoEyeOutline, IoEyeOffOutline,
} from 'react-icons/io5';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre es requerido';
    else if (form.name.trim().length < 2) errs.name = 'Nombre muy corto';
    if (!form.email.trim()) errs.email = 'El correo es requerido';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Correo no válido';
    if (!form.password) errs.password = 'La contraseña es requerida';
    else if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (!form.confirm) errs.confirm = 'Confirma tu contraseña';
    else if (form.confirm !== form.password) errs.confirm = 'Las contraseñas no coinciden';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e) => {
    e && e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    const result = await register(form.name.trim(), form.email.trim(), form.password);
    setLoading(false);
    if (!result.success) {
      setServerError(result.error || 'No se pudo crear la cuenta.');
    } else {
      navigate('/home', { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">🎓</span>
          <h1 className="auth-app-name">Crea tu cuenta</h1>
          <p className="auth-subtitle">Comienza a mejorar tu inglés hoy</p>
        </div>

        <form className="auth-form" onSubmit={handleRegister}>
          {serverError && <div className="error-banner">{serverError}</div>}

          {[
            { field: 'name', label: 'Nombre completo', icon: <IoPersonOutline size={20} />, placeholder: 'Ej. María García', type: 'text' },
            { field: 'email', label: 'Correo electrónico', icon: <IoMailOutline size={20} />, placeholder: 'usuario@correo.com', type: 'email' },
            { field: 'password', label: 'Contraseña', icon: <IoLockClosedOutline size={20} />, placeholder: 'Mínimo 6 caracteres', type: 'password' },
            { field: 'confirm', label: 'Confirmar contraseña', icon: <IoShieldCheckmarkOutline size={20} />, placeholder: 'Repite tu contraseña', type: 'password' },
          ].map(({ field, label, icon, placeholder, type }) => (
            <div key={field} className="input-group">
              <label className="input-label">{label}</label>
              <div className={`input-wrapper${errors[field] ? ' input-error' : ''}`}>
                <span className="input-icon">{icon}</span>
                <input
                  className="input-field"
                  type={type === 'password' && showPassword ? 'text' : type}
                  value={form[field]}
                  onChange={(e) => update(field, e.target.value)}
                  placeholder={placeholder}
                />
                {field === 'password' && (
                  <button
                    type="button"
                    className="input-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                  </button>
                )}
              </div>
              {errors[field] && <span className="error-text">{errors[field]}</span>}
            </div>
          ))}

          <Button title="Crear Cuenta" onPress={handleRegister} loading={loading} size="lg" className="btn-full" />

          <button type="button" className="auth-link" onClick={() => navigate('/')}>
            ¿Ya tienes cuenta? <strong>Inicia sesión</strong>
          </button>
        </form>
      </div>
    </div>
  );
}
