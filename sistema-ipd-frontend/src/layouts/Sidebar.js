import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import logo from '../assets/logo.png';
const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img src={logo} alt="Logo" className="sidebar-logo" />
                <h2>IPD Admin</h2>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li><NavLink to="/dashboard" end>Dashboard</NavLink></li>
                    <li><NavLink to="/dashboard/deportistas">Deportistas</NavLink></li>
                    <li><NavLink to="/dashboard/entrenadores">Entrenadores</NavLink></li>
                    <li><NavLink to="/dashboard/torneos">Torneos</NavLink></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;