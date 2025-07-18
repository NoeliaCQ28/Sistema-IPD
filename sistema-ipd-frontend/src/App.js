import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';

// --- PÁGINAS DE AUTENTICACIÓN ---
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// --- LAYOUTS PRINCIPALES ---
import AdminLayout from './layouts/AdminLayout';
import EntrenadorLayout from './pages/entrenador/EntrenadorLayout';
import DeportistaLayout from './pages/deportista/DeportistaLayout';

// --- PÁGINAS DEL PANEL DE ADMINISTRADOR ---
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
import EventosView from './pages/admin/views/EventosView';

// --- PÁGINAS DEL PANEL DE ENTRENADOR ---
import DashboardView from './pages/entrenador/views/DashboardView';
import DeportistasView from './pages/entrenador/views/DeportistasView';
import ProgresoView from './pages/entrenador/views/ProgresoView';
import HorariosView from './pages/entrenador/views/HorariosView';
import ProfileView from './pages/entrenador/views/ProfileView';
import AnalisisProgresoView from './pages/entrenador/views/AnalisisProgresoView';
import AsistenciaLayout from './pages/entrenador/views/asistencia/AsistenciaLayout';
import TomarAsistenciaView from './pages/entrenador/views/asistencia/TomarAsistenciaView';
import ReporteAsistenciaView from './pages/entrenador/views/asistencia/ReporteAsistenciaView';
import MensajeriaView from './pages/entrenador/views/mensajeria/MensajeriaView';

// --- PÁGINAS DEL PANEL DE DEPORTISTA ---
import DeportistaDashboardView from './pages/deportista/DeportistaDashboardView';
import DeportistaPerfilView from './pages/deportista/views/DeportistaPerfilView';
import DeportistaHorariosView from './pages/deportista/views/DeportistaHorariosView';
import DeportistaMensajeriaView from './pages/deportista/views/DeportistaMensajeriaView';
import DeportistaTorneosView from './pages/deportista/views/DeportistaTorneosView';

// --- COMPONENTES REUTILIZABLES ---
import ProgresoHistorial from './components/progreso/ProgresoHistorial';
import AsistenciaHistorial from './components/asistencia/AsistenciaHistorial';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* RUTAS PROTEGIDAS PARA ADMINISTRADOR */}
          <Route element={<ProtectedRoute role="ADMINISTRADOR" />}>
            <Route path="/dashboard" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="perfil" element={<ProfilePage />} />
              <Route path="deportistas" element={<DeportistaPortal />} />
              <Route path="deportistas/nuevo" element={<DeportistaForm />} />
              <Route path="deportistas/editar/:id" element={<DeportistaForm />} />
              <Route path="deportistas/ver/:id" element={<DeportistaDetalle />} />
              <Route path="deportistas/ver/:deportistaId/progresos" element={<ProgresoHistorial />} />
              <Route path="deportistas/ver/:deportistaId/asistencias" element={<AsistenciaHistorial />} />
              <Route path="entrenadores" element={<EntrenadorPortal />} />
              <Route path="entrenadores/nuevo" element={<EntrenadorForm />} />
              <Route path="entrenadores/editar/:id" element={<EntrenadorForm />} />
              <Route path="entrenadores/ver/:id" element={<EntrenadorDetalle />} />
              <Route path="torneos" element={<TorneoPortal />} />
              <Route path="torneos/nuevo" element={<TorneoForm />} />
              <Route path="torneos/editar/:id" element={<TorneoForm />} />
              <Route path="torneos/ver/:id" element={<TorneoDetalle />} />
              <Route path="eventos" element={<EventosView />} />
            </Route>
          </Route>

          {/* RUTAS PROTEGIDAS PARA ENTRENADOR */}
          <Route element={<ProtectedRoute role="ENTRENADOR" />}>
            <Route path="/portal/entrenador" element={<EntrenadorLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardView />} />
              <Route path="mis-deportistas" element={<DeportistasView />} />
              <Route path="progreso" element={<ProgresoView />} />
              <Route path="horarios" element={<HorariosView />} />
              <Route path="asistencia" element={<AsistenciaLayout />}>
                <Route index element={<Navigate to="tomar" replace />} />
                <Route path="tomar" element={<TomarAsistenciaView />} />
                <Route path="reporte" element={<ReporteAsistenciaView />} />
              </Route>
              <Route path="mensajeria" element={<MensajeriaView />} />
              <Route path="perfil" element={<ProfileView />} />
              <Route path="analisis" element={<AnalisisProgresoView />} />
              <Route path="deportistas/ver/:id" element={<DeportistaDetalle />} />
              <Route path="deportistas/ver/:deportistaId/progresos" element={<ProgresoHistorial />} />
              <Route path="deportistas/ver/:deportistaId/asistencias" element={<AsistenciaHistorial />} />
            </Route>
          </Route>

          {/* RUTAS PROTEGIDAS PARA DEPORTISTA */}
          <Route element={<ProtectedRoute role="DEPORTISTA" />}>
            <Route path="/portal/deportista" element={<DeportistaLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DeportistaDashboardView />} />
              <Route path="perfil" element={<DeportistaPerfilView />} />
              <Route path="horarios" element={<DeportistaHorariosView />} />
              <Route path="progresos" element={<ProgresoHistorial />} />
              <Route path="mensajeria" element={<DeportistaMensajeriaView />} />
              <Route path="torneos" element={<DeportistaTorneosView />} />
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