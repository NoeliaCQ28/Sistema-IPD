import React from 'react';
import './DeportistaHomePage.css';

const CoachCard = ({ entrenador, unreadCount, onChatClick }) => (
    <div className="portal-card">
        <h4>Entrenador Asignado</h4>
        {entrenador ? (
            <div className="coach-item">
                <div className="coach-details">
                    <strong>{entrenador.nombreCompleto}</strong>
                    {unreadCount > 0 && (
                        <span className="unread-indicator" title={`${unreadCount} mensaje(s) nuevo(s)`}>
                            {unreadCount}
                        </span>
                    )}
                </div>
                <button className="chat-button" onClick={onChatClick}>
                    Enviar Mensaje
                </button>
            </div>
        ) : (
            <p>No tienes un entrenador asignado.</p>
        )}
    </div>
);
export default CoachCard;