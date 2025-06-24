import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './DetailStyles.css'; // Reutilizamos los estilos

const TorneoDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authHeader } = useAuth();
    const [torneo, setTorneo] = useState(null);

    useEffect(() => {
        if (!authHeader) return;
        fetch(`http://localhost:8081/api/v1/torneos/${id}`, {
            headers: { 'Authorization': authHeader }
        })
        .then(res => res.json())
        .then(data => setTorneo(data));
    }, [id, authHeader]);

    if (!torneo) return <p>Cargando detalles del torneo...</p>;

    return (
        <div className="detail-container">
            <h2>{torneo.nombre}</h2>
            <div className="detail-grid">
                <div className="detail-item"><strong>ID:</strong> {torneo.id}</div>
                <div className="detail-item"><strong>Lugar:</strong> {torneo.lugar}</div>
                <div className="detail-item"><strong>Categoría:</strong> {torneo.categoria}</div>
                <div className="detail-item"><strong>Fecha de Inicio:</strong> {torneo.fechaInicio}</div>
                <div className="detail-item"><strong>Fecha de Fin:</strong> {torneo.fechaFin}</div>
                <div className="detail-item" style={{gridColumn: '1 / -1'}}>
                    <strong>Descripción:</strong>
                    <p style={{marginTop: '5px'}}>{torneo.descripcion}</p>
                </div>
            </div>
            <button onClick={() => navigate('/dashboard/torneos')} className="back-button">Volver a la lista</button>
        </div>
    );
};

export default TorneoDetalle;