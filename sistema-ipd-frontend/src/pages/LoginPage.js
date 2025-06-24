import React, { useEffect } from 'react'; // IMPORTANTE: Importar useEffect de React
import { useNavigate } from 'react-router-dom'; // IMPORTANTE: Importar useNavigate para la redirección
import { useAuth } from '../context/AuthContext'; // IMPORTANTE: Importar useAuth para obtener el usuario
import LoginForm from '../components/login/LoginForm';
import './LoginPage.css';

const LoginPage = () => {
  // DECLARACIÓN DE VARIABLES: Obtenemos 'user' y 'navigate' usando los hooks.
  // Esto debe hacerse dentro del cuerpo del componente.
  const { user } = useAuth();
  const navigate = useNavigate();

  // LÓGICA DENTRO DEL COMPONENTE: El useEffect ahora está en el lugar correcto.
  useEffect(() => {
    // Si el objeto 'user' existe (después de un login exitoso), entra aquí.
    if (user) {
      // Miramos el rol del usuario y lo enviamos a la página correcta.
      switch (user.rol) {
        case 'ADMINISTRADOR':
          navigate('/dashboard', { replace: true });
          break;
        case 'DEPORTISTA':
          navigate('/portal/deportista', { replace: true });
          break;
        case 'ENTRENADOR':
          navigate('/portal/entrenador', { replace: true });
          break;
        default:
          // Por seguridad, si el rol es desconocido, lo dejamos en el login.
          navigate('/login', { replace: true });
      }
    }
  }, [user, navigate]); // El efecto se ejecuta cada vez que 'user' o 'navigate' cambian.

  return (
    <div className="login-page-wrapper">
      <LoginForm />
    </div>
  );
};

export default LoginPage;