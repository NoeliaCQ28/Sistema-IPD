import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../../context/AuthContext';
import EventoModal from './EventoModal';

const locales = { 'es': es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), getDay, locales });

const EventCalendar = () => {
    const [events, setEvents] = useState([]);
    const { authHeader } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const fetchEvents = useCallback(() => {
        if (!authHeader) return;
        fetch('http://localhost:8081/api/v1/eventos', { headers: { 'Authorization': authHeader } })
            .then(res => res.json())
            .then(data => {
                const formattedEvents = data.map(event => ({ ...event, start: new Date(event.start), end: new Date(event.end) }));
                setEvents(formattedEvents);
            })
            .catch(error => console.error("Error al cargar eventos:", error));
    }, [authHeader]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleSelectSlot = useCallback(({ start, end }) => {
        setSelectedEvent({ start, end });
        setIsModalOpen(true);
    }, []);

    const handleSelectEvent = useCallback((event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    }, []);

    // --- FUNCIÓN CORREGIDA ---
    const handleSaveEvent = async (eventData) => {
        const url = eventData.id
            ? `http://localhost:8081/api/v1/eventos/${eventData.id}`
            : 'http://localhost:8081/api/v1/eventos';
        const method = eventData.id ? 'PUT' : 'POST';

        // Creamos un objeto 'payload' con TODOS los datos necesarios
        const payload = {
            title: eventData.title,
            start: eventData.start,
            end: eventData.end,
            disciplina: eventData.disciplina // <-- La línea que faltaba
        };

        await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': authHeader 
            },
            body: JSON.stringify(payload), // Enviamos el payload completo
        });
        
        setIsModalOpen(false);
        setSelectedEvent(null);
        fetchEvents(); // Recargamos los eventos para ver los cambios
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
            await fetch(`http://localhost:8081/api/v1/eventos/${eventId}`, {
                method: 'DELETE',
                headers: { 'Authorization': authHeader },
            });
            setIsModalOpen(false);
            setSelectedEvent(null);
            fetchEvents();
        }
    };

    return (
        <div style={{ height: '600px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginTop: '30px' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                culture='es'
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
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
            />
            <EventoModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedEvent(null); }}
                onSave={handleSaveEvent}
                onDelete={handleDeleteEvent}
                eventToEdit={selectedEvent}
            />
        </div>
    );
};

export default EventCalendar;