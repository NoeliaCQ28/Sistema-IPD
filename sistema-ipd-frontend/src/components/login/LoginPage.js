import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/login/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      // 1. Revisa si vinimos de una ruta guardada por ProtectedRoute.
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
        return; // Salimos para no ejecutar la lógica de abajo
      }

      // 2. Si no hay ruta guardada, usa la redirección por rol.
      switch (user.rol) {
        case 'ADMINISTRADOR':
          navigate('/dashboard', { replace: true });
          break;
        case 'DEPORTISTA':
          navigate('/portal/deportista', { replace: true });
          break;
        case 'ENTRENADOR':
          // Esta redirección ahora funcionará porque la ruta ya existe en App.js
          navigate('/portal/entrenador', { replace: true });
          break;
        default:
          // Fallback seguro
          navigate('/login', { replace: true });
      }
    }
  }, [user, navigate, location]);

  return (
    <div className="login-page-wrapper">
      <LoginForm />
    </div>
  );
};

export default LoginPage;