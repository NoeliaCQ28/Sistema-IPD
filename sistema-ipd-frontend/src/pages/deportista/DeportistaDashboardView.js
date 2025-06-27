import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import ChatBox from '../../components/mensajeria/ChatBox';
import ProgresoHistorial from '../../components/progreso/ProgresoHistorial';

import ProfileCard from './ProfileCard';
import CoachCard from './CoachCard';
import UpcomingEvents from './UpcomingEvents';
import WeeklySchedule from './WeeklySchedule';
import DeportistaDashboardSkeleton from './DeportistaDashboardSkeleton';

import './DeportistaHomePage.css';

const DeportistaDashboardView = () => {
    const { user, authHeader } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);

    useEffect(() => {
        // Si no tenemos el usuario o la autenticación, no hacemos nada.
        if (!user?.id || !authHeader) {
            setLoading(false); // Importante: detener la carga si no hay usuario.
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // El fetch de los datos es correcto, usamos Promise.all.
                const [deportistaRes, eventosRes, unreadCountsRes] = await Promise.all([
                    fetch(`http://localhost:8081/api/v1/deportistas/${user.id}`, { headers: { 'Authorization': authHeader } }),
                    fetch(`http://localhost:8081/api/v1/eventos/por-disciplina/${user.disciplina}`, { headers: { 'Authorization': authHeader } }),
                    fetch(`http://localhost:8081/api/v1/mensajes/no-leidos/por-remitente`, { headers: { 'Authorization': authHeader } })
                ]);

                if (!deportistaRes.ok) throw new Error('No se pudieron cargar tus datos de perfil.');

                const deportistaData = await deportistaRes.json();
                const eventosData = eventosRes.ok ? await eventosRes.json() : [];
                const unreadCountsData = unreadCountsRes.ok ? await unreadCountsRes.json() : {};

                setDashboardData({
                    deportista: deportistaData,
                    eventos: eventosData,
                    unreadCounts: unreadCountsData,
                });

            } catch (err) {
                setError(err.message);
            } finally {
                // Esta es la corrección clave: nos aseguramos de que el loading termine.
                setLoading(false);
            }
        };

        fetchData();
        // Este efecto depende directamente del ID del usuario. Si cambia, vuelve a cargar.
    }, [user?.id, user?.disciplina, authHeader]);

    if (loading) {
        return <DeportistaDashboardSkeleton />;
    }

    if (error) {
        return <div className="portal-error-container"><p>{error}</p></div>;
    }

    // Si no hay datos después de cargar, mostramos un mensaje amigable.
    if (!dashboardData?.deportista) {
        return <div className="portal-error-container"><p>No se pudieron cargar los datos del deportista.</p></div>;
    }

    const { deportista, eventos, unreadCounts } = dashboardData;

    return (
        <div className="deportista-dashboard-view">
             <div className="view-header">
                <h1>Dashboard</h1>
                <p className="welcome-message">Resumen de tu actividad reciente.</p>
            </div>
            <main className="portal-main-content">
                <aside className="portal-sidebar">
                    <ProfileCard deportista={deportista} />
                    <CoachCard 
                        entrenador={deportista?.entrenador} 
                        unreadCount={deportista?.entrenador ? (unreadCounts[deportista.entrenador.id] || 0) : 0}
                        onChatClick={() => setIsChatModalOpen(true)} 
                    />
                </aside>

                <section className="portal-feed">
                    <div className="portal-grid">
                        <WeeklySchedule horarios={deportista?.horarioEntrenamiento || []} />
                        <UpcomingEvents eventos={eventos} />
                    </div>
                    {deportista?.id && (
                        <div className="portal-card full-width">
                            {/* --- CORRECCIÓN CLAVE --- 
                                Pasamos `deportistaId` en lugar del objeto `deportista` completo.
                            */}
                            <ProgresoHistorial deportistaId={deportista.id} />
                        </div>
                    )}
                </section>
            </main>
            
            {deportista?.entrenador && (
                 <Modal
                    isOpen={isChatModalOpen}
                    onClose={() => setIsChatModalOpen(false)}
                    title={`Chatear con ${deportista.entrenador.nombreCompleto}`}
                >
                    <ChatBox 
                        otroUsuario={{...deportista.entrenador, id: deportista.entrenador.id}}
                        rolOtroUsuario="ENTRENADOR"
                    />
                </Modal>
            )}
        </div>
    );
};

export default DeportistaDashboardView;