import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const { user, unreadMessagesCount } = useAuth();

    return (
        <nav className="navbar-container">
            <div className="navbar-header">
                <img src={logo} alt="IPD Logo" className="navbar-logo" />
                <span className="navbar-title">IPD Admin</span>
            </div>
            <ul className="navbar-menu">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/dashboard/deportistas">Deportistas</Link></li>
                <li><Link to="/dashboard/entrenadores">Entrenadores</Link></li>
                <li><Link to="/dashboard/torneos">Torneos</Link></li>
                
                <li><Link to="/dashboard/perfil">Mi Perfil</Link></li>

                {user && (user.rol === 'DEPORTISTA' || user.rol === 'ENTRENADOR') && (
                    <li className="navbar-messages">
                        <Link to="/portal/mensajes">Mensajes</Link>
                        {unreadMessagesCount > 0 && (
                            <span className="messages-badge">{unreadMessagesCount}</span>
                        )}
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;