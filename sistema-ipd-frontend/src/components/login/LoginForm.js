import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import './LoginForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importa los iconos de ojo


const LoginForm = () => {
  const [email, setEmail] = useState('admin@ipd.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para la visibilidad

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
    setShowPassword(!showPassword); // Cambia el estado de visibilidad
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
        
        <div className="form-group password-group"> {/* Añadimos una nueva clase aquí */}
          <label htmlFor="password">Contraseña</label>
          <input 
type={showPassword ? 'text' : 'password'} /* Cambia el tipo según el estado */            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <span 
            className="password-toggle" 
            onClick={togglePasswordVisibility} // Maneja el clic para alternar
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Muestra el icono según el estado */}
          </span>
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