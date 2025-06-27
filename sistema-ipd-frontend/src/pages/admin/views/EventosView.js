import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
// 1. Importamos el modal que usaremos para editar
import EventoModal from '../../../components/dashboard/EventoModal';
import './EventosView.css';

const EventosView = () => {
    const { authHeader } = useAuth();
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Estados para controlar el modal y el evento seleccionado
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Usamos useCallback para evitar que la función se recree innecesariamente
    const fetchEventos = useCallback(async () => {
        if (!authHeader) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8081/api/v1/eventos', {
                headers: { 'Authorization': authHeader }
            });
            if (!response.ok) {
                throw new Error('No se pudieron cargar los eventos.');
            }
            const data = await response.json();
            setEventos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [authHeader]);

    useEffect(() => {
        fetchEventos();
    }, [fetchEventos]);

    // 3. Función para abrir el modal en modo edición
    const handleEdit = (evento) => {
        setSelectedEvent(evento);
        setIsModalOpen(true);
    };

    // 4. Función para manejar la eliminación del evento
    const handleDelete = async (eventoId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
            try {
                const response = await fetch(`http://localhost:8081/api/v1/eventos/${eventoId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': authHeader },
                });
                if (!response.ok) {
                    throw new Error('Error al eliminar el evento.');
                }
                // Si se elimina correctamente, cerramos el modal y recargamos la lista
                setIsModalOpen(false);
                setSelectedEvent(null);
                fetchEventos(); 
            } catch (err) {
                setError(err.message);
                alert(err.message);
            }
        }
    };

    // 5. Función para guardar (actualizar) el evento desde el modal
    const handleSaveEvent = async (eventData) => {
        // El modal de edición siempre tendrá un ID
        const url = `http://localhost:8081/api/v1/eventos/${eventData.id}`;
        const method = 'PUT';

        try {
            await fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': authHeader 
                },
                body: JSON.stringify(eventData),
            });
            
            setIsModalOpen(false);
            setSelectedEvent(null);
            fetchEventos(); // Recargamos los eventos para ver los cambios
        } catch(err) {
            alert(`Error al guardar: ${err.message}`);
        }
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'Fecha no especificada';
        return new Date(dateTime).toLocaleString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="admin-view-container">
            <div className="view-header">
                <h1>Gestión de Eventos</h1>
                <p>Aquí puedes ver, editar y eliminar los eventos creados.</p>
            </div>
            
            {loading && <p>Cargando eventos...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && (
                <div className="eventos-card-grid">
                    {eventos.length > 0 ? (
                        eventos.map(evento => (
                            <div key={evento.id} className="evento-card">
                                <div className="evento-card-header">
                                    <h3>{evento.title}</h3>
                                    <span className="evento-disciplina">{evento.disciplina}</span>
                                </div>
                                <div className="evento-card-body">
                                    <p><strong>Inicio:</strong> {formatDateTime(evento.start)}</p>
                                    <p><strong>Fin:</strong> {formatDateTime(evento.end)}</p>
                                </div>
                                <div className="evento-card-footer">
                                    {/* Pasamos el objeto completo del evento al hacer clic */}
                                    <button onClick={() => handleEdit(evento)} className="btn-edit">Editar</button>
                                    <button onClick={() => handleDelete(evento.id)} className="btn-delete">Eliminar</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay eventos creados.</p>
                    )}
                </div>
            )}

            {/* 6. Renderizamos el Modal */}
            <EventoModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedEvent(null); }}
                onSave={handleSaveEvent}
                onDelete={handleDelete} // Pasamos la función de eliminar al modal
                eventToEdit={selectedEvent}
            />
        </div>
    );
};

export default EventosView;
