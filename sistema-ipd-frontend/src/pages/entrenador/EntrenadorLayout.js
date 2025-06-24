import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import './EntrenadorLayout.css';

const EntrenadorLayout = () => {
    return (
        <div className="entrenador-layout">
            <Sidebar />
            <main className="main-content-area">
                {/* Aquí es donde React Router renderizará las vistas anidadas */}
                <Outlet />
            </main>
        </div>
    );
};

export default EntrenadorLayout;
