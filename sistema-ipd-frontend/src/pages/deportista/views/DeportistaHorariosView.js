import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '../../../context/AuthContext';
import './DeportistaViews.css'; // Reutilizamos los estilos compartidos

// Configuración de Moment.js para usar español
moment.locale('es');
const localizer = momentLocalizer(moment);

const DeportistaHorariosView = () => {
    const { user, authHeader } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // useCallback para evitar que la función se recree en cada render
    const transformDataToEvents = useCallback((horarios) => {
        const calendarEvents = [];
        const daysOfWeek = {
            'lunes': 1, 'martes': 2, 'miércoles': 3, 'jueves': 4, 'viernes': 5, 'sábado': 6, 'domingo': 0
        };

        (horarios || []).forEach(horario => {
            const dayIndex = daysOfWeek[horario.dia.toLowerCase()];
            if (dayIndex === undefined) return;

            const [startStr, endStr] = horario.horario.split(' - ');
            if (!startStr || !endStr) return;

            const [startHour, startMinute] = startStr.split(':').map(Number);
            const [endHour, endMinute] = endStr.split(':').map(Number);

            // Generar eventos para varias semanas para que el calendario se vea poblado
            for (let i = -4; i <= 4; i++) {
                const startDateTime = moment().add(i, 'weeks').day(dayIndex).hour(startHour).minute(startMinute).second(0);
                const endDateTime = moment().add(i, 'weeks').day(dayIndex).hour(endHour).minute(endMinute).second(0);
                
                calendarEvents.push({
                    id: `${horario.id}-${i}`,
                    title: `${horario.actividad}`,
                    start: startDateTime.toDate(),
                    end: endDateTime.toDate(),
                    allDay: false,
                    resource: horario,
                });
            }
        });
        return calendarEvents;
    }, []);

    useEffect(() => {
        if (!user?.id || !authHeader) {
            setLoading(false);
            return;
        }

        const fetchHorarios = async () => {
            setLoading(true);
            try {
                // Obtenemos los detalles completos del deportista, que incluyen su horario
                const response = await fetch(`http://localhost:8081/api/v1/deportistas/${user.id}`, {
                    headers: { 'Authorization': authHeader }
                });
                if (!response.ok) throw new Error("No se pudieron cargar tus datos de horario.");
                
                const data = await response.json();
                const transformedEvents = transformDataToEvents(data.horarioEntrenamiento || []);
                setEvents(transformedEvents);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchHorarios();
    }, [user?.id, authHeader, transformDataToEvents]);

    if (loading) {
        return <p>Cargando tu horario...</p>;
    }

    return (
        <div className="deportista-view-container">
            <div className="view-header">
                <h1>Mi Horario Semanal</h1>
                <p className="welcome-message">Aquí puedes ver todas tus actividades de entrenamiento programadas.</p>
            </div>
            <div className="calendar-container" style={{backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'}}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '70vh' }}
                    culture='es'
                    messages={{
                        next: "Siguiente",
                        previous: "Anterior",
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        agenda: "Agenda",
                    }}
                />
            </div>
        </div>
    );
};

export default DeportistaHorariosView;

