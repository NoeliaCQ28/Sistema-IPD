import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom'; // Para hacer los widgets interactivos
import './Views.css'; // Usaremos el mismo archivo de estilos

const DashboardView = () => {
    const { user, authHeader } = useAuth();
    const [entrenadorData, setEntrenadorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEntrenadorData = async () => {
            if (!user?.id || !authHeader) return;
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}`, {
                    headers: { 'Authorization': authHeader }
                });
                if (!response.ok) throw new Error('No se pudieron cargar los datos para el dashboard.');
                const data = await response.json();
                setEntrenadorData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEntrenadorData();
    }, [user?.id, authHeader]);

    if (loading) return <p>Cargando dashboard...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!entrenadorData) return <p>No hay datos disponibles para mostrar.</p>

    // --- Procesamiento de datos para los widgets ---
    const deportistasCount = entrenadorData.deportistasACargo?.length || 0;
    const horariosCount = entrenadorData.horariosCreados?.length || 0;
    const progresosCount = entrenadorData.progresosRegistrados?.length || 0;

    // Obtener los últimos 3 progresos registrados
    const progresosRecientes = [...(entrenadorData.progresosRegistrados || [])]
        .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
        .slice(0, 3);
        
    // Obtener los últimos 3 horarios creados
    // Nota: Como no tenemos fecha en los horarios, simplemente mostramos los últimos de la lista.
    const horariosRecientes = [...(entrenadorData.horariosCreados || [])].slice(-3).reverse();


    return (
        <div className="view-container dashboard-view">
            <header className="view-header">
                <h1>Dashboard</h1>
                <p className="welcome-message">¡Bienvenido de nuevo, {user.nombres}!</p>
            </header>

            {/* --- Widgets de Estadísticas (KPIs) --- */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon deportistas"></div>
                    <div className="stat-info">
                        <h2>{deportistasCount}</h2>
                        <p>Deportistas Asignados</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon horarios"></div>
                    <div className="stat-info">
                        <h2>{horariosCount}</h2>
                        <p>Horarios Creados</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon progresos"></div>
                    <div className="stat-info">
                        <h2>{progresosCount}</h2>
                        <p>Progresos Registrados</p>
                    </div>
                </div>
            </div>

            {/* --- Widgets de Actividad Reciente --- */}
            <div className="dashboard-widgets">
                <div className="widget">
                    <h3>Progreso Reciente</h3>
                    <ul className="widget-list">
                        {progresosRecientes.length > 0 ? progresosRecientes.map(p => (
                            <li key={p.id} className="widget-list-item">
                                <span><strong>{p.deportistaNombre}</strong> - {p.tipoMebrica}: {p.valor}</span>
                                <span className="item-date">{new Date(p.fechaRegistro).toLocaleDateString('es-ES')}</span>
                            </li>
                        )) : (
                            <p>No hay registros de progreso recientes.</p>
                        )}
                    </ul>
                    <Link to="/portal/entrenador/progreso" className="widget-link">Ver todo el progreso &rarr;</Link>
                </div>

                <div className="widget">
                    <h3>Horarios Creados Recientemente</h3>
                     <ul className="widget-list">
                        {horariosRecientes.length > 0 ? horariosRecientes.map(h => (
                           <li key={h.id} className="widget-list-item">
                                <span><strong>{h.dia}:</strong> {h.actividad}</span>
                                <span className="item-date">{h.deportistaNombre || 'N/A'}</span>
                            </li>
                        )) : (
                            <p>No has creado horarios recientemente.</p>
                        )}
                    </ul>
                    <Link to="/portal/entrenador/horarios" className="widget-link">Ver todos los horarios &rarr;</Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
