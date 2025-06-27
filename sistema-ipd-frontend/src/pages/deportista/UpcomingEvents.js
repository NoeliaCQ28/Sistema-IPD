// UpcomingEvents.js
import React from 'react';
import './DeportistaHomePage.css';

const UpcomingEvents = ({ eventos }) => (
     <div className="portal-card">
        <h4>Eventos Programados</h4>
        <div className="events-container">
            {eventos.length > 0 ? (
                eventos.map(evento => (
                    <div key={evento.id} className="event-item">
                        <span className="event-date">{new Date(evento.start).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
                        <span className="event-title">{evento.title}</span>
                    </div>
                ))
            ) : (
                <p className="empty-message">No hay eventos para tu disciplina.</p>
            )}
        </div>
    </div>
);
export default UpcomingEvents;