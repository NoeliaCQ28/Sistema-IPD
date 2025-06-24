import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import './ProgresoHistorial.css';

const ProgresoHistorial = ({ deportistaId: propDeportistaId }) => {
    const { authHeader, user } = useAuth();
    const { deportistaId: paramDeportistaId } = useParams();
    const navigate = useNavigate();

    const currentDeportistaId = propDeportistaId || paramDeportistaId;

    const [historial, setHistorial] = useState([]);
    const [deportistaNombre, setDeportistaNombre] = useState('este deportista');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentDeportistaId || !authHeader) {
            setIsLoading(false);
            return;
        }

        const fetchHistorial = async () => {
            try {
                const deportistaResponse = await fetch(`http://localhost:8081/api/v1/deportistas/${currentDeportistaId}`, {
                    headers: { 'Authorization': authHeader }
                });
                if (deportistaResponse.ok) {
                    const deportistaData = await deportistaResponse.json();
                    setDeportistaNombre(`${deportistaData.nombres} ${deportistaData.apellidos}`);
                } else {
                    console.warn("No se pudo obtener el nombre del deportista para el historial.");
                }


                const response = await fetch(`http://localhost:8081/api/v1/deportistas/${currentDeportistaId}/progresos`, {
                    headers: { 'Authorization': authHeader }
                });

                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error("Acceso denegado. No tienes permisos para ver este historial.");
                    }
                    const errorText = await response.text();
                    throw new Error(errorText || `Error al cargar historial: ${response.status}`);
                }

                const data = await response.json();
                setHistorial(data);
            } catch (err) {
                setError(`Error: ${err.message}`);
                console.error("Error al cargar historial de progreso:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistorial();
    }, [currentDeportistaId, authHeader]);

    const getBackPath = () => {
        if (!user) return '/login';
        if (user.rol === 'ADMINISTRADOR') {
            return `/dashboard/deportistas/ver/${currentDeportistaId}`;
        }
        if (user.rol === 'ENTRENADOR') {
            return `/portal/entrenador/deportistas/ver/${currentDeportistaId}`;
        }
        if (user.rol === 'DEPORTISTA' && user.id === currentDeportistaId) {
            return '/portal/deportista';
        }
        return '/dashboard';
    };


    if (isLoading) {
        return <p>Cargando historial de progreso de {deportistaNombre}...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="progreso-historial-container info-card">
            <h4>Historial de Progreso de {deportistaNombre}</h4>
            {historial.length > 0 ? (
                <table className="progreso-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Métrica</th>
                            <th>Valor</th>
                            <th>Observaciones</th>
                            <th>Registrado por</th>
                            <th>Fecha Creación</th>
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
                                <td>{new Date(progreso.fechaCreacion).toLocaleString('es-ES')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay registros de progreso para este deportista.</p>
            )}
            {(user && user.rol !== 'DEPORTISTA' && user.id !== currentDeportistaId) && (
                <button onClick={() => navigate(getBackPath())} className="back-button">Volver</button>
            )}
        </div>
    );
};

export default ProgresoHistorial;   