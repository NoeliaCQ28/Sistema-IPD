    import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { useAuth } from '../../context/AuthContext';
    import './DetailStyles.css';

    const DeportistaDetalle = () => {
        const { id } = useParams();
        const navigate = useNavigate();
        const { authHeader, user } = useAuth();
        const [deportista, setDeportista] = useState(null);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState('');

        useEffect(() => {
            if (!authHeader) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            fetch(`http://localhost:8081/api/v1/deportistas/${id}`, {
                headers: { 'Authorization': authHeader }
            })
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) throw new Error('Deportista no encontrado.');
                    if (res.status === 403) throw new Error('Acceso denegado. No tienes permisos para ver este deportista.');
                    throw new Error('Error en la petición: ' + res.statusText);
                }
                return res.json();
            })
            .then(data => {
                setDeportista(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
                console.error("Error al cargar deportista:", err);
            });
        }, [id, authHeader]);

        const formatFecha = (fecha) => {
            if (!fecha) return 'N/A';
            return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        };
        
        const formatFechaHora = (fechaHora) => {
            if (!fechaHora) return 'N/A';
            return new Date(fechaHora).toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        };

        const getBackPath = () => {
            if (!user) return '/login';
            if (user.rol === 'ENTRENADOR') return '/portal/entrenador/mis-deportistas';
            if (user.rol === 'ADMINISTRADOR') return '/dashboard/deportistas';
            return '/login';
        };
        
        const goToHistorial = (tipo) => {
            const basePath = user.rol === 'ENTRENADOR' ? '/portal/entrenador' : '/dashboard';
            navigate(`${basePath}/deportistas/ver/${deportista.id}/${tipo}`);
        };

        if (isLoading) return <p>Cargando detalles del deportista...</p>;
        if (error) return <p className="error-message">Error: {error}</p>;
        if (!deportista) return <p>No se encontró al deportista.</p>;

        return (
            <div className="detail-container">
                <h2>Detalles del Deportista</h2>
                <div className="detail-grid">
                    <div className="detail-item"><strong>ID:</strong> {deportista.id || 'N/A'}</div>
                    <div className="detail-item"><strong>Nombres:</strong> {deportista.nombres || 'N/A'}</div>
                    <div className="detail-item"><strong>Apellidos:</strong> {deportista.apellidos || 'N/A'}</div>
                    <div className="detail-item"><strong>DNI:</strong> {deportista.dni || 'N/A'}</div>
                    <div className="detail-item"><strong>Correo:</strong> {deportista.correo || 'N/A'}</div>
                    <div className="detail-item"><strong>Teléfono:</strong> {deportista.telefono || 'N/A'}</div>
                    <div className="detail-item"><strong>Fecha de Nacimiento:</strong> {formatFecha(deportista.fechaNacimiento)}</div>
                    <div className="detail-item"><strong>Disciplina:</strong> {deportista.disciplina || 'N/A'}</div>
                    <div className="detail-item"><strong>Peso:</strong> {deportista.peso ? `${deportista.peso} kg` : 'N/A'}</div>
                    <div className="detail-item"><strong>Entrenador:</strong> {deportista.entrenador?.nombreCompleto || 'Sin asignar'}</div>
                    <div className="detail-item"><strong>Activo:</strong> {deportista.activo ? 'Sí' : 'No'}</div>
                    <div className="detail-item"><strong>Fecha de Registro:</strong> {formatFechaHora(deportista.fechaRegistro)}</div>
                    <div className="detail-item password">
                        <strong>Contraseña (es su DNI):</strong> 
                        <span>{deportista.dni || 'N/A'}</span>
                    </div>
                </div>
                
                <div className="detail-actions">
                    <button onClick={() => navigate(getBackPath())} className="back-button">Volver</button>
                    {user && (user.rol === 'ADMINISTRADOR' || user.rol === 'ENTRENADOR') && (
                        <>
                            <button onClick={() => goToHistorial('progresos')} className="action-button view-history-button">
                                Historial de Progreso
                            </button>
                            <button onClick={() => goToHistorial('asistencias')} className="action-button view-history-button blue">
                                Historial de Asistencia
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    };

    export default DeportistaDetalle;
    