import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../components/login/LoginForm.css'; // Reutilizamos los estilos del login

const ResetPasswordPage = () => {
    // Hooks para manejar la lógica del componente
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    // Estados del formulario y de la UI
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isTokenValid, setIsTokenValid] = useState(false);

    // Efecto para validar el token tan pronto como la página cargue
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setError('No se proporcionó un token de reseteo.');
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/v1/password/validate-token?token=${token}`);
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'El enlace no es válido o ha expirado.');
                }
                setIsTokenValid(true);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/v1/password/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'No se pudo restablecer la contraseña.');
            }
            setMessage(data.message);
            // Redirigir al login después de 3 segundos
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <p>Validando enlace...</p>;
        }
        if (error) {
            return <p className="error-message">{error}</p>;
        }
        if (message) {
            return <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>;
        }
        if (isTokenValid) {
            return (
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="password">Nueva Contraseña</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Cambiar Contraseña'}
                    </button>
                </form>
            );
        }
        return null; // No debería llegar aquí si no hay errores
    };
    
    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                <img src={logo} alt="Logo IPD" className="login-logo" />
                <div className="login-header">
                    <h1>Establecer Nueva Contraseña</h1>
                </div>
                {renderContent()}
                <div style={{ marginTop: '20px' }}>
                    <Link to="/login" style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;