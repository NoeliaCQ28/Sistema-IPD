import React from 'react';
import { useAuth } from '../context/AuthContext';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';
import './deportistas/DetailStyles.css'; // Reutilizamos los estilos de la vista de detalle

const ProfilePage = () => {
    const { user } = useAuth();

    if (!user) {
        return <p>Cargando perfil...</p>;
    }

    return (
        <div>
            <h1>Mi Perfil</h1>
            <div className="detail-container" style={{ marginBottom: '40px' }}>
                <div className="detail-grid">
                    <div className="detail-item"><strong>Nombre:</strong> {user.nombres} {user.apellidos}</div>
                    <div className="detail-item"><strong>Correo:</strong> {user.correo}</div>
                    <div className="detail-item"><strong>Rol:</strong> {user.rol}</div>
                </div>
            </div>
            
            <ChangePasswordForm />
        </div>
    );
};

export default ProfilePage;