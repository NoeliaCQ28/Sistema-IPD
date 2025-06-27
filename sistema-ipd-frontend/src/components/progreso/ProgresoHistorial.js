import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import './ProgresoHistorial.css';

// El componente ahora puede funcionar de tres maneras:
// 1. Recibiendo `deportistaId` como prop (desde el Dashboard del Deportista).
// 2. Tomando el `deportistaId` de los parámetros de la URL (cuando lo ve un admin/entrenador).
// 3. Usando el ID del usuario logueado (cuando el deportista ve su propia página de "Mis Progresos").
const ProgresoHistorial = ({ deportistaId: propDeportistaId }) => {
    const { user, authHeader } = useAuth();
    const { deportistaId: paramDeportistaId } = useParams();
    const navigate = useNavigate();

    // --- LÓGICA CORREGIDA ---
    // Determina el ID correcto a usar, dando prioridad a props, luego a params,
    // y finalmente al usuario del contexto.
    const deportistaId = propDeportistaId || paramDeportistaId || user?.id;

    const [historial, setHistorial] = useState([]);
    const [deportistaNombre, setDeportistaNombre] = useState('este deportista');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!deportistaId || !authHeader) {
            setIsLoading(false);
            return;
        }

        const fetchHistorial = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Obtener el nombre del deportista (opcional, para el título)
                if (user?.rol !== 'DEPORTISTA') { // No es necesario si el deportista ve su propio historial
                     const deportistaResponse = await fetch(`http://localhost:8081/api/v1/deportistas/${deportistaId}`, {
                        headers: { 'Authorization': authHeader }
                    });
                    if (deportistaResponse.ok) {
                        const deportistaData = await deportistaResponse.json();
                        setDeportistaNombre(`${deportistaData.nombres} ${deportistaData.apellidos}`);
                    }
                } else {
                    setDeportistaNombre('Mi Progreso');
                }
                
                // Obtener el historial de progreso
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
        };

        fetchHistorial();
    }, [deportistaId, authHeader, user?.rol]);

    return (
        <div className="deportista-view-container">
             <div className="view-header">
                <h1>Historial de Progreso</h1>
                <p className="welcome-message">Un resumen detallado de todas tus métricas registradas.</p>
            </div>

            <div className="portal-card">
                {isLoading ? (
                    <p>Cargando historial...</p>
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
                                    <td>{new Date(progreso.fechaRegistro).toLocaleDateString('es-ES')}</td>
                                    <td>{progreso.tipoMebrica}</td>
                                    <td>{progreso.valor}</td>
                                    <td>{progreso.observaciones || 'N/A'}</td>
                                    <td>{progreso.entrenadorNombreCompleto || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="empty-message">Aún no tienes registros de progreso.</p>
                )}
            </div>
        </div>
    );
};

export default ProgresoHistorial;
