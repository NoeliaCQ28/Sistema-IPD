import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import './ProgresoHistorial.css';
import '../../pages/deportista/views/DeportistaViews.css'; // Importamos los estilos de vista

const ProgresoHistorial = () => {
    const { user, authHeader } = useAuth();
    const { deportistaId: paramDeportistaId } = useParams();

    // --- LÓGICA CORREGIDA ---
    // Determina el ID del deportista a usar.
    // Si la ruta es `/portal/deportista/progresos`, paramDeportistaId será undefined.
    // En ese caso, usamos el ID del usuario logueado.
    const deportistaId = paramDeportistaId || user?.id;

    const [historial, setHistorial] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHistorial = useCallback(async () => {
        if (!deportistaId || !authHeader) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8081/api/v1/deportistas/${deportistaId}/progresos`, {
                headers: { 'Authorization': authHeader }
            });

            if (!response.ok) {
                throw new Error("No se pudo cargar el historial de progreso.");
            }

            const data = await response.json();
            setHistorial(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [deportistaId, authHeader]);

    useEffect(() => {
        fetchHistorial();
    }, [fetchHistorial]);

    return (
        <div className="deportista-view-container">
             <div className="view-header">
                <h1>Mis Progresos</h1>
                <p className="welcome-message">Un registro detallado de todas tus métricas a lo largo del tiempo.</p>
            </div>

            <div className="portal-card">
                {isLoading ? (
                    <p>Cargando tu historial de progreso...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : historial.length > 0 ? (
                    <table className="progreso-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Métrica</th>
                                <th>Valor</th>
                                <th>Observaciones</th>
                                <th>Registrado por</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historial.map((progreso) => (
                                <tr key={progreso.id}>
                                    <td>{new Date(progreso.fechaRegistro + 'T00:00:00Z').toLocaleDateString('es-ES')}</td>
                                    <td>{progreso.tipoMebrica}</td>
                                    <td>{progreso.valor}</td>
                                    <td>{progreso.observaciones || 'N/A'}</td>
                                    <td>{progreso.entrenadorNombreCompleto || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="empty-message">Aún no tienes registros de progreso. ¡Tu entrenador puede añadirlos!</p>
                )}
            </div>
        </div>
    );
};

export default ProgresoHistorial;
