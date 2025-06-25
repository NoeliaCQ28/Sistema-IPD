    import React, { useState, useEffect } from 'react';
    import { useAuth } from '../../context/AuthContext';
    import '../../pages/deportistas/FormStyles.css';

    const ProfileEditForm = ({ user, onProfileUpdated }) => {
        const { authHeader } = useAuth();
        const [formData, setFormData] = useState({
            correo: '',
            telefono: ''
        });
        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');
        const [isLoading, setIsLoading] = useState(false);

        useEffect(() => {
            if (user) {
                setFormData({
                    correo: user.correo || '',
                    telefono: user.telefono || ''
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

            try {
                const response = await fetch('http://localhost:8081/api/v1/profile/update', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authHeader
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Ocurrió un error al actualizar el perfil.');
                }

                setSuccess(data.message);
                if (onProfileUpdated) {
                    onProfileUpdated(); // Llama a la función para refrescar datos si es necesario
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="form-container" style={{ maxWidth: '500px', margin: 0 }}>
                <h3>Editar Información</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Teléfono</label>
                        <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>{success}</p>}

                    <div className="form-buttons">
                        <button type="submit" className="submit-button" disabled={isLoading}>
                            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    export default ProfileEditForm;
    