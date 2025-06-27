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
import TorneoModal from './TorneoModal';
import ChoiceModal from './ChoiceModal';

// Configuración del localizador para react-big-calendar en español
const locales = { 'es': es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), getDay, locales });

const EventCalendar = () => {
    // Estados para manejar los datos y la visibilidad de los modales
    const [calendarItems, setCalendarItems] = useState([]);
    const { authHeader } = useAuth();
    const [isEventoModalOpen, setIsEventoModalOpen] = useState(false);
    const [isTorneoModalOpen, setIsTorneoModalOpen] = useState(false);
    const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [slotInfo, setSlotInfo] = useState(null);

    // Función para obtener tanto eventos como torneos del backend
    const fetchCalendarData = useCallback(() => {
        if (!authHeader) return;
        Promise.all([
            fetch('http://localhost:8081/api/v1/eventos', { headers: { 'Authorization': authHeader } }),
            fetch('http://localhost:8081/api/v1/torneos', { headers: { 'Authorization': authHeader } })
        ]).then(async ([eventosRes, torneosRes]) => {
            const eventosData = await eventosRes.json();
            const torneosData = await torneosRes.json();
            
            const formattedEventos = eventosData.map(e => ({
                id: `evento-${e.id}`,
                title: e.title,
                start: new Date(e.start),
                end: new Date(e.end),
                resource: e,
                type: 'evento'
            }));

            const formattedTorneos = torneosData.map(t => ({
                id: `torneo-${t.id}`,
                title: t.nombre,
                start: new Date(t.fechaInicio),
                end: new Date(t.fechaFin),
                resource: t,
                type: 'torneo'
            }));

            setCalendarItems([...formattedEventos, ...formattedTorneos]);
        }).catch(error => console.error("Error al cargar datos:", error));
    }, [authHeader]);

    useEffect(() => {
        fetchCalendarData();
    }, [fetchCalendarData]);

    // Maneja el clic en un espacio vacío del calendario
    const handleSelectSlot = useCallback((slot) => {
        setSlotInfo(slot);
        setIsChoiceModalOpen(true);
    }, []);
    
    // Maneja el clic en un evento o torneo existente
    const handleSelectItem = useCallback((item) => {
        setSelectedItem(item);
        if (item.type === 'torneo') {
            setIsTorneoModalOpen(true);
        } else {
            setIsEventoModalOpen(true);
        }
    }, []);

    // Maneja la elección del usuario en el modal intermedio
    const handleChooseNewItem = (type) => {
        setIsChoiceModalOpen(false);
        setSelectedItem({
            start: slotInfo.start,
            end: slotInfo.end,
            type: type,
            resource: {}
        });
        if (type === 'torneo') {
            setIsTorneoModalOpen(true);
        } else {
            setIsEventoModalOpen(true);
        }
    };

    // Función unificada para guardar (crear o actualizar)
    const handleSave = async (itemData, itemType) => {
        const isNew = !itemData.id;
        const endpoint = itemType === 'torneo' ? 'torneos' : 'eventos';
        const url = isNew ? `http://localhost:8081/api/v1/${endpoint}` : `http://localhost:8081/api/v1/${endpoint}/${itemData.id}`;
        const method = isNew ? 'POST' : 'PUT';
        
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
            body: JSON.stringify(itemData)
        });

        handleCloseModals();
        fetchCalendarData();
    };
    
    // Función unificada para eliminar
    const handleDelete = async (itemId, itemType) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar este ${itemType}?`)) {
            const endpoint = itemType === 'torneo' ? 'torneos' : 'eventos';
            await fetch(`http://localhost:8081/api/v1/${endpoint}/${itemId}`, { method: 'DELETE', headers: { 'Authorization': authHeader }});
            handleCloseModals();
            fetchCalendarData();
        }
    };

    // Asigna una clase CSS a cada ítem del calendario según su tipo
    const eventPropGetter = useCallback((event) => ({
        className: event.type === 'torneo' ? 'rbc-event-torneo' : 'rbc-event-evento'
    }), []);

    // Cierra todos los modales y resetea los estados
    const handleCloseModals = () => {
        setIsEventoModalOpen(false);
        setIsTorneoModalOpen(false);
        setIsChoiceModalOpen(false);
        setSelectedItem(null);
        setSlotInfo(null);
    };

    return (
        <div style={{ height: '600px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginTop: '30px', position: 'relative' }}>
            <div className="calendar-legend">
                <div className="legend-item"><span className="legend-color-box" style={{ backgroundColor: '#2c3e50' }}></span> Evento</div>
                <div className="legend-item"><span className="legend-color-box" style={{ backgroundColor: '#c52127' }}></span> Torneo</div>
            </div>
            <Calendar
                localizer={localizer}
                events={calendarItems}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                culture='es'
                messages={{ next: "Siguiente", previous: "Anterior", today: "Hoy", month: "Mes", week: "Semana", day: "Día", agenda: "Agenda" }}
                onSelectEvent={handleSelectItem}
                onSelectSlot={handleSelectSlot}
                selectable
                eventPropGetter={eventPropGetter}
            />
            
            <ChoiceModal isOpen={isChoiceModalOpen} onClose={handleCloseModals} onChoose={handleChooseNewItem} />
            
            {selectedItem && (
                <>
                    <EventoModal
                        isOpen={isEventoModalOpen}
                        onClose={handleCloseModals}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        eventToEdit={selectedItem.type === 'evento' && selectedItem.resource.id ? selectedItem.resource : null}
                        initialDates={selectedItem && !selectedItem.resource.id ? { start: selectedItem.start, end: selectedItem.end } : null}
                    />
                    <TorneoModal
                        isOpen={isTorneoModalOpen}
                        onClose={handleCloseModals}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        torneoToEdit={selectedItem.type === 'torneo' && selectedItem.resource.id ? selectedItem.resource : null}
                        initialDates={selectedItem && !selectedItem.resource.id ? { start: selectedItem.start, end: selectedItem.end } : null}
                    />
                </>
            )}
        </div>
    );
};

export default EventCalendar;
