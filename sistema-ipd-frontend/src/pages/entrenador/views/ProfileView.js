    import React from 'react';
    import { useAuth } from '../../../context/AuthContext';
    import ProfileEditForm from '../../../components/profile/ProfileEditForm';
    import ChangePasswordForm from '../../../components/profile/ChangePasswordForm';
    import './ProfileView.css';

    const ProfileView = () => {
        const { user } = useAuth();
        
        // El hook useAuth ya nos da la información del usuario logueado.
        // Si se necesitara más detalle, se podría hacer un fetch a /api/v1/entrenadores/{user.id}

        if (!user) {
            return <p>Cargando perfil...</p>;
        }

        return (
            <div className="view-container">
                <header className="view-header">
                    <h1>Mi Perfil</h1>
                </header>

                <div className="profile-view-content">
                    <div className="profile-section">
                        <ProfileEditForm user={user} />
                    </div>
                    <div className="profile-section">
                        <ChangePasswordForm />
                    </div>
                </div>
            </div>
        );
    };

    export default ProfileView;
    