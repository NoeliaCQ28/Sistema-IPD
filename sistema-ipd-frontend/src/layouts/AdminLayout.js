import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Mantenemos el Sidebar principal
import './AdminLayout.css';

// El componente AdminLayout define la estructura principal del panel de administrador.
const AdminLayout = () => {
  return (
    <div className="admin-layout">
      {/* La estructura correcta es tener un único Sidebar a la izquierda
        y el contenido principal a la derecha.
      */}
      <Sidebar />
      <div className="admin-main-content">
        {/*
          Hemos eliminado el componente <Navbar /> de aquí, ya que estaba
          duplicando la navegación y causando un desplazamiento en el contenido.
        */}
        <div className="admin-page-content">
          {/* Outlet es donde React Router renderizará las rutas hijas (DashboardPage, DeportistaPortal, etc.) */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
