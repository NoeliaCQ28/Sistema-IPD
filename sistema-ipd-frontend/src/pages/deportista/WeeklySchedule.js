// WeeklySchedule.js
import React from 'react';
import './DeportistaHomePage.css';

const WeeklySchedule = ({ horarios }) => (
    <div className="portal-card">
        <h4>Horario Semanal</h4>
        <div className="schedule-container">
            {horarios.length > 0 ? (
                horarios.map(item => (
                    <div key={item.id} className="schedule-item">
                        <span className="schedule-day">{item.dia}</span>
                        <span className="schedule-time">{item.horario}</span>
                        <span className="schedule-activity">{item.actividad}</span>
                    </div>
                ))
            ) : (
                <p className="empty-message">No tienes horarios asignados esta semana.</p>
            )}
        </div>
    </div>
);
export default WeeklySchedule;

