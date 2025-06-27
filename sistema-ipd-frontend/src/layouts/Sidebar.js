import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';
import logo from '../assets/logo.png';

/**
 * Componente Sidebar para la navegación principal del panel de administrador.
 * Muestra los enlaces de navegación, información del usuario y el botón para cerrar sesión.
 */
const Sidebar = () => {
    // Hooks para obtener el usuario, la función de logout y la navegación
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    /**
     * Maneja el evento de clic para cerrar la sesión del usuario.
     * Llama a la función logout del contexto y redirige al login.
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // No renderiza nada si no hay un usuario autenticado
    if (!user) {
        return null;
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img src={logo} alt="Logo" className="sidebar-logo" />
                <h2>IPD Admin</h2>
            </div>
            
            {/* Sección que muestra el nombre y rol del usuario logueado */}
            <div className="sidebar-profile">
                <h3>{user.nombres} {user.apellidos}</h3>
                <p>{user.rol.charAt(0).toUpperCase() + user.rol.slice(1).toLowerCase()}</p>
            </div>

            {/* Menú de navegación principal */}
            <nav className="sidebar-nav">
                <ul>
                    <li><NavLink to="/dashboard" end>Dashboard</NavLink></li>
                    <li><NavLink to="/dashboard/deportistas">Deportistas</NavLink></li>
                    <li><NavLink to="/dashboard/entrenadores">Entrenadores</NavLink></li>
                    <li><NavLink to="/dashboard/torneos">Torneos</NavLink></li>
                    {/* ¡NUEVO ENLACE AÑADIDO! */}
                    <li><NavLink to="/dashboard/eventos">Eventos</NavLink></li>
                    <li><NavLink to="/dashboard/perfil">Mi Perfil</NavLink></li>
                </ul>
            </nav>

            {/* Pie de página con el botón de cerrar sesión */}
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-button-sidebar">
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
