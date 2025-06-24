import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './ChatBox.css';

const ChatBox = ({ currentUserId, currentUserRol, otherUserId, otherUserRol, otherUserName }) => {
    const { authHeader, user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const fetchConversation = async () => {
        if (!authHeader || !currentUserId || !currentUserRol || !otherUserId || !otherUserRol) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8081/api/v1/mensajes/conversacion/${otherUserId}/${otherUserRol}`, {
                method: 'GET',
                headers: { 'Authorization': authHeader }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Error ${response.status}: al cargar conversación.`);
            }
            const data = await response.json();
            setMessages(data);

            const unreadMessagesFromOtherUser = data.filter(msg => msg.remitenteId === otherUserId && !msg.leido);
            for (const msg of unreadMessagesFromOtherUser) {
                await fetch(`http://localhost:8081/api/v1/mensajes/${msg.id}/leido`, {
                    method: 'PUT',
                    headers: { 'Authorization': authHeader }
                });
            }
        } catch (err) {
            setError(`Error al cargar mensajes: ${err.message}`);
            console.error("Error al cargar conversación:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);

        const messageData = {
            remitenteId: currentUserId,
            remitenteRol: currentUserRol,
            receptorId: otherUserId,
            receptorRol: otherUserRol,
            contenido: newMessage
        };

        try {
            const response = await fetch('http://localhost:8081/api/v1/mensajes/enviar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                body: JSON.stringify(messageData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Error ${response.status}: al enviar mensaje.`);
            }

            const sentMessage = await response.json();
            setMessages(prevMessages => [...prevMessages, sentMessage]);
            setNewMessage('');
        } catch (err) {
            setError(`Error al enviar mensaje: ${err.message}`);
            console.error("Error al enviar mensaje:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchConversation();
    }, [currentUserId, currentUserRol, otherUserId, otherUserRol, authHeader]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    if (isLoading) return <p>Cargando mensajes con {otherUserName}...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="chat-box-container info-card">
            <h4>Conversación con {otherUserName}</h4>
            <div className="messages-list">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        <div key={msg.id} className={`message-item ${msg.remitenteId === currentUserId ? 'sent' : 'received'}`}>
                            <div className="message-header">
                                <strong>{msg.remitenteId === currentUserId ? 'Tú' : msg.remitenteNombre}</strong>
                                <span className="message-time">{new Date(msg.fechaEnvio).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                            </div>
                            <p className="message-content">{msg.contenido}</p>
                        </div>
                    ))
                ) : (
                    <p>No hay mensajes en esta conversación.</p>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="message-input-form">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    rows="3"
                    disabled={isLoading}
                ></textarea>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
            </form>
        </div>
    );
};

export default ChatBox;