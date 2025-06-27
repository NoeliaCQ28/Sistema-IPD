import React from 'react';
import './DeportistaHomePage.css';

const ProfileCard = ({ deportista }) => {
    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return 'N/A';
        const hoy = new Date();
        const cumpleanos = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - cumpleanos.getFullYear();
        const m = hoy.getMonth() - cumpleanos.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        return edad;
    };

    if (!deportista) return <div className="portal-card">Cargando perfil...</div>;

    return (
        <div className="portal-card profile-card-widget">
            <img src={`https://i.pravatar.cc/150?u=${deportista.id}`} alt="Foto de perfil" className="profile-picture" />
            <h3>{deportista.nombres} {deportista.apellidos}</h3>
            <p className="profile-discipline">{deportista.disciplina || 'Sin disciplina'}</p>
            <div className="profile-details">
                <span><strong>Edad:</strong> {calcularEdad(deportista.fechaNacimiento)} años</span>
                <span><strong>DNI:</strong> {deportista.dni || 'N/A'}</span>
                <span><strong>Correo:</strong> {deportista.correo || 'N/A'}</span>
                <span><strong>Teléfono:</strong> {deportista.telefono || 'N/A'}</span>
            </div>
        </div>
    );
};
export default ProfileCard;