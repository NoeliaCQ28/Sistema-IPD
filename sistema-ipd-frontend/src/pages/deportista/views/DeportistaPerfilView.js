import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ChangePasswordForm from '../../../components/profile/ChangePasswordForm';
import './DeportistaViews.css'; // Crearemos este archivo de estilos compartidos

// Componente de formulario específico para el perfil del deportista
const DeportistaProfileForm = ({ user }) => {
    const { authHeader, revalidateSession } = useAuth(); // Usamos revalidateSession del contexto
    const [formData, setFormData] = useState({
        correo: user?.correo || '',
        telefono: user?.telefono || '',
        peso: user?.peso || ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Actualiza el formulario si el objeto user del contexto cambia
    React.useEffect(() => {
        if (user) {
            setFormData({
                correo: user.correo || '',
                telefono: user.telefono || '',
                peso: user.peso || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        // Preparamos los datos, asegurándonos de que el peso sea un número o null
        const dataToSend = {
            ...formData,
            peso: formData.peso ? parseFloat(formData.peso) : null,
        };

        try {
            const response = await fetch('http://localhost:8081/api/v1/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader
                },
                body: JSON.stringify(dataToSend)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Ocurrió un error al actualizar el perfil.');
            }

            setSuccess(data.message);
            // Si el contexto tiene una función para recargar los datos del usuario, la llamamos
            if (revalidateSession) {
                revalidateSession();
            }
            
            setTimeout(() => setSuccess(''), 4000); // Oculta el mensaje de éxito después de 4 segundos
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container" style={{ margin: 0 }}>
            <h3>Editar Información</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="correo">Correo Electrónico</label>
                    <input id="correo" type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input id="telefono" type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="peso">Peso (kg)</label>
                    <input id="peso" type="number" step="0.1" name="peso" value={formData.peso} onChange={handleChange} />
                </div>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <div className="form-buttons">
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Componente principal de la vista
const DeportistaPerfilView = () => {
    const { user } = useAuth();
    
    return (
        <div className="deportista-view-container">
            <div className="view-header">
                <h1>Mi Perfil</h1>
                <p className="welcome-message">Gestiona tu información personal y seguridad.</p>
            </div>

            <div className="profile-view-content">
                <div className="profile-section">
                    <DeportistaProfileForm user={user} />
                </div>
                <div className="profile-section">
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
};

export default DeportistaPerfilView;
