import React from 'react';
import { Outlet } from 'react-router-dom';
import DeportistaSidebar from './DeportistaSidebar'; // Importamos el nuevo sidebar
import './DeportistaLayout.css'; // Estilos para este layout

const DeportistaLayout = () => {
    return (
        <div className="deportista-layout">
            <DeportistaSidebar />
            <main className="deportista-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DeportistaLayout;