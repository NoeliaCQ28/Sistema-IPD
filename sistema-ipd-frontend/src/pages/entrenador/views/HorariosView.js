import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Importar localización en español para moment
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/Modal';
import AsignarHorarioForm from '../../../components/horarios/AsignarHorarioForm';
import './Views.css';

// Configurar moment en español para que el calendario muestre "Lunes", "Martes", etc.
moment.locale('es');
const localizer = momentLocalizer(moment);

const HorariosView = () => {
    const { user, authHeader } = useAuth();
    const [events, setEvents] = useState([]);
    const [deportistas, setDeportistas] = useState([]); // Necesario para el formulario de edición
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado para manejar los modales
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Función para convertir los datos de la API al formato que el calendario espera
    const transformDataToEvents = useCallback((horarios) => {
        const calendarEvents = [];
        const daysOfWeek = {
            'lunes': 1, 'martes': 2, 'miércoles': 3, 'jueves': 4, 'viernes': 5, 'sábado': 6, 'domingo': 7
        };

        horarios.forEach(horario => {
            const dayIndex = daysOfWeek[horario.dia.toLowerCase()];
            if (dayIndex === undefined) return;

            const [startStr, endStr] = horario.horario.split(' - ');
            if (!startStr || !endStr) return;

            const [startHour, startMinute] = startStr.split(':').map(Number);
            const [endHour, endMinute] = endStr.split(':').map(Number);

            // Generamos eventos recurrentes para varias semanas para que el calendario no se vea vacío
            for (let i = -2; i <= 2; i++) {
                const startDateTime = moment().add(i, 'weeks').day(dayIndex).hour(startHour).minute(startMinute).second(0);
                const endDateTime = moment().add(i, 'weeks').day(dayIndex).hour(endHour).minute(endMinute).second(0);
                
                calendarEvents.push({
                    // Creamos un ID único para cada instancia del evento recurrente
                    id: `${horario.id}-${i}`, 
                    originalId: horario.id, // Guardamos el ID real para las llamadas a la API
                    title: `${horario.actividad} (${horario.deportistaNombre})`,
                    start: startDateTime.toDate(),
                    end: endDateTime.toDate(),
                    allDay: false,
                    resource: horario, // Guardamos el objeto original con todos los datos
                });
            }
        });
        return calendarEvents;
    }, []);

    const fetchData = useCallback(async () => {
        if (!user?.id || !authHeader) return;
        setLoading(true);
        setError(null);
        try {
            // Pedimos tanto los horarios como los deportistas (para el formulario de edición)
            const [horariosRes, deportistasRes] = await Promise.all([
                fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}/horarios/todos`, { headers: { 'Authorization': authHeader } }),
                fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}/deportistas`, { headers: { 'Authorization': authHeader } })
            ]);
            
            if (!horariosRes.ok) throw new Error('No se pudo cargar los horarios.');
            const horariosData = await horariosRes.json();
            setEvents(transformDataToEvents(horariosData));

            if (deportistasRes.ok) {
                const deportistasData = await deportistasRes.json();
                setDeportistas(deportistasData);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id, authHeader, transformDataToEvents]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setIsDetailModalOpen(true);
    };

    const handleEditClick = () => {
        setIsDetailModalOpen(false); // Cierra el modal de detalles
        setIsEditModalOpen(true);   // Abre el modal de edición
    };

    const handleDeleteClick = async () => {
        if (!selectedEvent || !window.confirm('¿Estás seguro de que quieres eliminar este horario? Esta acción es permanente.')) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:8081/api/v1/horarios/${selectedEvent.resource.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': authHeader }
            });
            if (!response.ok) throw new Error('No se pudo eliminar el horario.');
            setIsDetailModalOpen(false);
            setSelectedEvent(null);
            fetchData(); // Recargamos los eventos para que desaparezca del calendario
        } catch (err) {
            alert(`Error al eliminar: ${err.message}`);
        }
    };

    const handleFormSave = () => {
        setIsEditModalOpen(false);
        setSelectedEvent(null);
        fetchData(); // Recargamos los eventos para ver los cambios
    };
    
    if (loading) return <p>Cargando horarios...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>Calendario de Horarios</h1>
            </header>
            <div className="calendar-container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '75vh' }}
                    messages={{
                        next: "Siguiente",
                        previous: "Anterior",
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        agenda: "Agenda",
                        date: "Fecha",
                        time: "Hora",
                        event: "Evento",
                    }}
                    defaultView="week"
                    views={['month', 'week', 'day', 'agenda']}
                    culture='es'
                    onSelectEvent={handleSelectEvent} // <-- Evento para abrir el modal
                />
            </div>

            {/* Modal de Detalles del Evento */}
            {selectedEvent && (
                <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detalle del Horario">
                    <div className="event-detail-modal">
                        <h3>{selectedEvent.resource.actividad}</h3>
                        <p><strong>Deportista:</strong> {selectedEvent.resource.deportistaNombre}</p>
                        <p><strong>Día:</strong> {selectedEvent.resource.dia}</p>
                        <p><strong>Horario:</strong> {selectedEvent.resource.horario}</p>
                        <div className="modal-actions">
                            <button onClick={() => setIsDetailModalOpen(false)} className="action-button secondary">Cerrar</button>
                            <button onClick={handleDeleteClick} className="action-button delete">Eliminar</button>
                            <button onClick={handleEditClick} className="action-button primary">Editar</button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Modal para Editar el Horario */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Horario">
                <AsignarHorarioForm
                    deportistasAsignados={deportistas}
                    onHorarioGuardado={handleFormSave}
                    onCancel={() => setIsEditModalOpen(false)}
                    editingHorario={selectedEvent} // Pasamos el evento seleccionado al formulario
                />
            </Modal>
        </div>
    );
};

export default HorariosView;
