import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
// Asumimos que tienes un FormStyles.css genérico o puedes crearlo.
import '../../pages/deportistas/FormStyles.css';

const ChangePasswordForm = () => {
    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { authHeader } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (formData.newPassword !== formData.confirmPassword) {
            setError('La nueva contraseña y la confirmación no coinciden.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/api/v1/profile/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                // Usamos el mensaje de error específico que envía nuestro backend
                throw new Error(data.error || 'Ocurrió un error al actualizar la contraseña.');
            }

            setSuccess(data.message);
            // Limpiamos el formulario tras el éxito
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '500px', margin: 0 }}>
            <h3>Cambiar Contraseña</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Contraseña Actual</label>
                    <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Nueva Contraseña</label>
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Confirmar Nueva Contraseña</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>

                {error && <p className="error-message">{error}</p>}
                {success && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{success}</p>}

                <div className="form-buttons">
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;