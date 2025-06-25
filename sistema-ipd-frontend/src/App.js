import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Páginas de Admin
import DashboardPage from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import DeportistaPortal from './pages/deportistas/DeportistaPortal';
import DeportistaForm from './pages/deportistas/DeportistaForm';
import DeportistaDetalle from './pages/deportistas/DeportistaDetalle';
import EntrenadorPortal from './pages/entrenadores/EntrenadorPortal';
import EntrenadorForm from './pages/entrenadores/EntrenadorForm';
import EntrenadorDetalle from './pages/entrenadores/EntrenadorDetalle';
import TorneoPortal from './pages/torneos/TorneoPortal';
import TorneoForm from './pages/torneos/TorneoForm';
import TorneoDetalle from './pages/torneos/TorneoDetalle';

// Páginas de Roles
import DeportistaHomePage from './pages/deportista/DeportistaHomePage';

// Componentes adicionales
import ProgresoHistorial from './components/progreso/ProgresoHistorial';

// --- NUEVAS IMPORTACIONES PARA EL PANEL DE ENTRENADOR ---
import EntrenadorLayout from './pages/entrenador/EntrenadorLayout';
import DashboardView from './pages/entrenador/views/DashboardView';
import DeportistasView from './pages/entrenador/views/DeportistasView';
import ProgresoView from './pages/entrenador/views/ProgresoView';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* RUTA DE LOGIN */}
          <Route path="/login" element={<LoginPage />} />

          {/* RUTAS DE ADMINISTRADOR */}
          <Route element={<ProtectedRoute role="ADMINISTRADOR" />}>
            <Route path="/dashboard" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="perfil" element={<ProfilePage />} />
              <Route path="deportistas" element={<DeportistaPortal />} />
              <Route path="deportistas/nuevo" element={<DeportistaForm />} />
              <Route path="deportistas/editar/:id" element={<DeportistaForm />} />
              <Route path="deportistas/ver/:id" element={<DeportistaDetalle />} />
              <Route path="deportistas/ver/:deportistaId/progresos" element={<ProgresoHistorial />} /> 
              <Route path="entrenadores" element={<EntrenadorPortal />} />
              <Route path="entrenadores/nuevo" element={<EntrenadorForm />} />
              <Route path="entrenadores/editar/:id" element={<EntrenadorForm />} />
              <Route path="entrenadores/ver/:id" element={<EntrenadorDetalle />} />
              <Route path="torneos" element={<TorneoPortal />} />
              <Route path="torneos/nuevo" element={<TorneoForm />} />
              <Route path="torneos/editar/:id" element={<TorneoForm />} />
              <Route path="torneos/ver/:id" element={<TorneoDetalle />} />
            </Route>
          </Route>

          {/* RUTAS DE DEPORTISTA */}
          <Route element={<ProtectedRoute role="DEPORTISTA" />}>
            <Route path="/portal/deportista" element={<DeportistaHomePage />} />
          </Route>

          {/* RUTAS DE ENTRENADOR CON EL NUEVO LAYOUT */}
          <Route element={<ProtectedRoute role="ENTRENADOR" />}>
            <Route path="/portal/entrenador" element={<EntrenadorLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardView />} />
              <Route path="mis-deportistas" element={<DeportistasView />} />
              <Route path="progreso" element={<ProgresoView />} />
              <Route path="deportistas/ver/:id" element={<DeportistaDetalle />} /> 
              <Route path="deportistas/ver/:deportistaId/progresos" element={<ProgresoHistorial />} /> 
            </Route>
          </Route>
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<p>Página no encontrada: 404!</p>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
