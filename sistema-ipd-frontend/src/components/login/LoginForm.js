import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
// --- 1. IMPORTAR LINK ---
import { Link } from 'react-router-dom'; 
import logo from '../../assets/logo.png';
import './LoginForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const LoginForm = () => {
  const [email, setEmail] = useState('admin@ipd.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    setIsLoading(false);

    if (!result.success) {
      setError(result.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo IPD" className="login-logo" />
      
      <div className="login-header">
        <h1>Instituto Peruano del Deporte</h1>
        <p>Accede al sistema de gestión deportiva</p>
      </div>

      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Usuario (Correo)</label>
          <input 
            type="text"
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group password-group">
          <label htmlFor="password">Contraseña</label>
          <input 
            type={showPassword ? 'text' : 'password'}
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <span 
            className="password-toggle" 
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        
        {/* --- 2. AÑADIR ENLACE AQUÍ --- */}
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Link to="/forgot-password" style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
        </button>
      </form>
      
      <footer className="login-footer">
        <p>© 2025 IPD - Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default LoginForm;