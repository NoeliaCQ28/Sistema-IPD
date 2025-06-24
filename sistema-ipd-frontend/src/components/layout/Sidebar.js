import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';
// Si quieres usar iconos, descomenta la siguiente línea e instala la librería:
// npm install react-icons
// import { FiGrid, FiUsers, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return null; // No renderizar nada si el usuario no está cargado
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
                    {/* <FiGrid /> */} Dashboard
                </NavLink>
                <NavLink to="/portal/entrenador/mis-deportistas">
                    {/* <FiUsers /> */} Mis Deportistas
                </NavLink>
                {/* Puedes añadir más enlaces aquí en el futuro */}
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-button-sidebar">
                    {/* <FiLogOut /> */} Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
