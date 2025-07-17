import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../components/login/LoginForm.css'; // Reutilizamos los estilos del login

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const params = new URLSearchParams({ email });
            // Verificamos que esta es la URL CORRECTA que espera el backend
            const response = await fetch(`/api/v1/password/forgot?${params.toString()}`, {
                method: 'POST',
            });

            const data = await response.json();

            if (!response.ok) {
                // Usamos el mensaje de error del backend si existe
                throw new Error(data.error || 'Ocurrió un error al procesar la solicitud.');
            }
            
            setMessage(data.message);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                <img src={logo} alt="Logo IPD" className="login-logo" />
                <div className="login-header">
                    <h1>Restablecer Contraseña</h1>
                    <p>Ingresa tu correo electrónico para recibir un enlace de reseteo.</p>
                </div>
                
                {!message ? (
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Correo Electrónico</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu.correo@example.com"
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="login-button" disabled={isLoading}>
                            {isLoading ? 'Enviando...' : 'Enviar Enlace'}
                        </button>
                    </form>
                ) : (
                    <p style={{ color: 'green', fontWeight: 'bold', padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                        {message}
                    </p>
                )}

                <div style={{ marginTop: '20px' }}>
                    <Link to="/login" style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;