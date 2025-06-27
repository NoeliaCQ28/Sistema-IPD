import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './DeportistaViews.css';
import './DeportistaTorneosView.css';

const DeportistaTorneosView = () => {
    const { user, authHeader } = useAuth();
    const [torneos, setTorneos] = useState([]);
    const [misInscripciones, setMisInscripciones] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!user?.id || !authHeader) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const [torneosResponse, deportistaResponse] = await Promise.all([
                fetch('http://localhost:8081/api/v1/torneos', { headers: { 'Authorization': authHeader } }),
                fetch(`http://localhost:8081/api/v1/deportistas/${user.id}`, { headers: { 'Authorization': authHeader } })
            ]);

            if (!torneosResponse.ok || !deportistaResponse.ok) {
                throw new Error('No se pudo cargar la información de los torneos.');
            }

            const torneosData = await torneosResponse.json();
            const deportistaData = await deportistaResponse.json();

            setTorneos(torneosData);
            
            // --- CORRECCIÓN CLAVE ---
            // Nos aseguramos de que `torneosInscritos` exista y sea un array antes de mapearlo.
            // Si no existe, inicializamos un Set vacío.
            if (deportistaData && Array.isArray(deportistaData.torneosInscritos)) {
                const inscripcionesIds = new Set(deportistaData.torneosInscritos.map(t => t.id));
                setMisInscripciones(inscripcionesIds);
            } else {
                setMisInscripciones(new Set());
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id, authHeader]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInscripcion = async (torneoId, estaInscrito) => {
        const endpoint = estaInscrito ? 'anular-inscripcion' : 'inscribir';
        
        try {
            const response = await fetch(`http://localhost:8081/api/v1/torneos/${torneoId}/${endpoint}`, {
                method: 'POST',
                headers: { 'Authorization': authHeader },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ocurrió un error');
            }
            
            // Recargamos los datos para reflejar el cambio en la UI.
            fetchData(); 

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };
    
    if (loading) return <p>Cargando torneos...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="deportista-view-container">
            <div className="view-header">
                <h1>Eventos y Torneos</h1>
                <p className="welcome-message">Explora los próximos eventos e inscríbete.</p>
            </div>
            <div className="torneos-list">
                {torneos.map((torneo) => {
                    const estaInscrito = misInscripciones.has(torneo.id);
                    return (
                        <div key={torneo.id} className="torneo-card">
                            <div className="torneo-card-header">
                                <h3>{torneo.nombre}</h3>
                                <span className="torneo-categoria">{torneo.categoria}</span>
                            </div>
                            <div className="torneo-card-body">
                                <p><strong>Lugar:</strong> {torneo.lugar}</p>
                                <p><strong>Fecha:</strong> {new Date(torneo.fechaInicio).toLocaleDateString('es-ES')}</p>
                                <p>{torneo.descripcion}</p>
                            </div>
                            <div className="torneo-card-footer">
                                <button
                                    onClick={() => handleInscripcion(torneo.id, estaInscrito)}
                                    className={`inscription-button ${estaInscrito ? 'anular' : 'inscribir'}`}
                                >
                                    {estaInscrito ? 'Anular Inscripción' : 'Inscribirme'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DeportistaTorneosView;
