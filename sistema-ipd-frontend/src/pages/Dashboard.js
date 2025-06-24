import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EventCalendar from '../components/dashboard/EventCalendar'; // <-- IMPORTAMOS EL CALENDARIO
import './Dashboard.css';

const DashboardPage = () => {
    const { user, authHeader } = useAuth();
    const [stats, setStats] = useState({ totalDeportistas: 0, totalEntrenadores: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (authHeader) {
            fetch('http://localhost:8081/api/v1/dashboard/stats', {
                headers: { 'Authorization': authHeader }
            })
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error al cargar estadísticas:", error);
                setIsLoading(false);
            });
        }
    }, [authHeader]);

    return (
        <div className="dashboard-page">
            <h1>Bienvenido al Panel de Administración, {user?.nombres}</h1>
            <p className="dashboard-subtitle">Aquí tienes un resumen rápido del sistema.</p>

            <div className="stats-cards-container">
                {/* ... Tus tarjetas de estadísticas no cambian ... */}
                <div className="stat-card">
                    <h2>Deportistas Registrados</h2>
                    <p className="stat-number">{isLoading ? '...' : stats.totalDeportistas}</p>
                </div>
                <div className="stat-card">
                    <h2>Entrenadores Activos</h2>
                    <p className="stat-number">{isLoading ? '...' : stats.totalEntrenadores}</p>
                </div>
            </div>

            {/* AÑADIMOS EL NUEVO COMPONENTE DE CALENDARIO AQUÍ */}
            <EventCalendar />

        </div>
    );
};

export default DashboardPage;