import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './DetailStyles.css'; // Reutilizamos los estilos de detalle

const EntrenadorDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authHeader } = useAuth();
    const [entrenador, setEntrenador] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authHeader) return;
        setIsLoading(true);
        fetch(`http://localhost:8081/api/v1/entrenadores/${id}`, {
            headers: { 'Authorization': authHeader }
        })
        .then(res => {
            if (!res.ok) throw new Error('Entrenador no encontrado');
            return res.json();
        })
        .then(data => {
            setEntrenador(data);
            setIsLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setIsLoading(false);
        });
    }, [id, authHeader]);

    if (isLoading) return <p>Cargando detalles del entrenador...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!entrenador) return <p>No se encontró al entrenador.</p>;

    return (
        <div className="detail-container">
            <h2>Detalles del Entrenador</h2>
            <div className="detail-grid">
                <div className="detail-item"><strong>ID:</strong> {entrenador.id}</div>
                <div className="detail-item"><strong>Nombres:</strong> {entrenador.nombres}</div>
                <div className="detail-item"><strong>Apellidos:</strong> {entrenador.apellidos}</div>
                <div className="detail-item"><strong>DNI:</strong> {entrenador.dni}</div>
                <div className="detail-item"><strong>Correo:</strong> {entrenador.correo}</div>
                <div className="detail-item"><strong>Teléfono:</strong> {entrenador.telefono}</div>
                <div className="detail-item"><strong>Fecha de Nacimiento:</strong> {entrenador.fechaNacimiento}</div>
                <div className="detail-item"><strong>Disciplina que Entrena:</strong> {entrenador.disciplinaQueEntrena}</div>
                <div className="detail-item"><strong>Profesión:</strong> {entrenador.profesion}</div>
                <div className="detail-item"><strong>Fecha de Contratación:</strong> {new Date(entrenador.fechaContratacion).toLocaleString()}</div>
                <div className="detail-item"><strong>Activo:</strong> {entrenador.activo ? 'Sí' : 'No'}</div>
                <div className="detail-item password"><strong>Contraseña (es su DNI):</strong> <span>{entrenador.dni}</span></div>
            </div>
            <button onClick={() => navigate('/dashboard/entrenadores')} className="back-button">Volver a la lista</button>
        </div>
    );
};

export default EntrenadorDetalle;