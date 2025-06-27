import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Usaremos una versión modificada de los estilos del sidebar del entrenador
import '../../components/layout/Sidebar.css'; 

const DeportistaSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirige al login después de cerrar sesión
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-profile">
                <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt="Perfil" />
                <h3>{user.nombres}</h3>
                <p>{user.rol}</p>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/portal/deportista/dashboard">Dashboard</NavLink>
                <NavLink to="/portal/deportista/perfil">Mi Perfil</NavLink>
                <NavLink to="/portal/deportista/horarios">Mi Horario</NavLink>
                <NavLink to="/portal/deportista/progresos">Mis Progresos</NavLink>
                <NavLink to="/portal/deportista/mensajeria">Mensajería</NavLink>
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-button-sidebar">
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

export default DeportistaSidebar;