import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AsistenciaLayout.css';

const AsistenciaLayout = () => {
    return (
        <div className="view-container">
            <header className="view-header">
                <h1>Gestión de Asistencia</h1>
            </header>
            
            <nav className="sub-nav">
                <NavLink 
                    to="tomar" 
                    className={({ isActive }) => isActive ? 'sub-nav-link active' : 'sub-nav-link'}
                >
                    Tomar Asistencia
                </NavLink>
                <NavLink 
                    to="reporte" 
                    className={({ isActive }) => isActive ? 'sub-nav-link active' : 'sub-nav-link'}
                >
                    Reporte de Asistencia
                </NavLink>
            </nav>

            <main className="sub-nav-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AsistenciaLayout;
