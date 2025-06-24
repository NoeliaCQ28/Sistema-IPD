import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// --- Páginas de Admin (Sin cambios) ---
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

// --- Páginas de Roles (Sin cambios para Deportista) ---
import DeportistaHomePage from './pages/deportista/DeportistaHomePage';
// Se elimina la importación de la página antigua del entrenador
// import EntrenadorHomePage from './pages/entrenador/EntrenadorHomePage'; 

// --- Componentes Adicionales ---
import ProgresoHistorial from './components/progreso/ProgresoHistorial';

// --- NUEVAS IMPORTACIONES PARA EL PANEL DE ENTRENADOR ---
import EntrenadorLayout from './pages/entrenador/EntrenadorLayout';
import DashboardView from './pages/entrenador/views/DashboardView';
import DeportistasView from './pages/entrenador/views/DeportistasView';
// Importa aquí las futuras vistas cuando las crees:
// import HorariosView from './pages/entrenador/views/HorariosView';
// import ProgresoView from './pages/entrenador/views/ProgresoView';


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

          {/* === SECCIÓN MODIFICADA: RUTAS DE ENTRENADOR === */}
          <Route element={<ProtectedRoute role="ENTRENADOR" />}>
            {/* Todas las rutas de entrenador ahora pasan por EntrenadorLayout */}
            <Route path="/portal/entrenador" element={<EntrenadorLayout />}>
              
              {/* Redirección: si un entrenador va a /portal/entrenador, lo mandamos a 'mis-deportistas' por defecto */}
              <Route index element={<Navigate to="dashboard" replace />} />
              
              {/* Vistas específicas que se renderizarán dentro del Layout */}
              <Route path="dashboard" element={<DashboardView />} />
              <Route path="mis-deportistas" element={<DeportistasView />} />
              {/* <Route path="horarios" element={<HorariosView />} /> */}
              {/* <Route path="progreso" element={<ProgresoView />} /> */}
              
              {/* Mantenemos la ruta para ver el detalle de un deportista, pero ahora anidada */}
              <Route path="deportistas/ver/:id" element={<DeportistaDetalle />} /> 
              <Route path="deportistas/ver/:deportistaId/progresos" element={<ProgresoHistorial />} /> 
            </Route>
          </Route>
          
          {/* Redirección por defecto y página no encontrada */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<p>Página no encontrada: 404!</p>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
