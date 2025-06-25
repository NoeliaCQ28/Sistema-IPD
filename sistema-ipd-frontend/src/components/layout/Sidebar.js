import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-profile">
                <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt="Perfil" />
                <h3>{user.nombres} {user.apellidos}</h3>
                <p>{user.rol.charAt(0).toUpperCase() + user.rol.slice(1).toLowerCase()}</p>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/portal/entrenador/dashboard">
                    Dashboard
                </NavLink>
                <NavLink to="/portal/entrenador/mis-deportistas">
                    Mis Deportistas
                </NavLink>
                <NavLink to="/portal/entrenador/progreso">
                    Historial de Progreso
                </NavLink>
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-button-sidebar">
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
