import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main-content">
        <Navbar />
        <div className="admin-page-content">
          {/* Aquí se renderizarán las páginas hijas (Deportistas, etc.) */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;