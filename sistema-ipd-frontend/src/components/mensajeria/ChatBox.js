import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './ChatBox.css';

const ChatBox = ({ otroUsuario, rolOtroUsuario }) => {
    const { user, authHeader } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // No hacer nada si falta información esencial.
        if (!otroUsuario || !user || !authHeader) {
            return;
        }

        // Cargar el historial de la conversación al seleccionar un contacto.
        const fetchMessages = async () => {
            try {
                const response = await fetch(`http://localhost:8081/api/v1/mensajes/conversacion/${otroUsuario.id}/${rolOtroUsuario}`, {
                    headers: { 'Authorization': authHeader }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error("Error al cargar el historial de mensajes:", error);
            }
        };

        fetchMessages();

        // Crear una nueva instancia del cliente STOMP.
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
            connectHeaders: { Authorization: authHeader },
            reconnectDelay: 10000,
            onConnect: () => {
                setIsConnected(true);
                console.log('CONEXIÓN STOMP EXITOSA. Suscribiendo al canal personal...');
                
                // Suscribirse al canal privado para recibir mensajes dirigidos a este usuario.
                client.subscribe(`/user/${user.id}/queue/messages`, (message) => {
                    const receivedMessage = JSON.parse(message.body);
                    
                    // --- PUNTO CLAVE ---
                    // Esta es la forma correcta de actualizar el estado para asegurar que la UI se renderice.
                    // Se usa una función de callback para obtener el estado previo (`prev`) y evitar problemas de "estado rancio".
                    setMessages(prev => [...prev, receivedMessage]);
                });
            },
            onDisconnect: () => {
                setIsConnected(false);
                console.log('DESCONECTADO del WebSocket.');
            },
        });

        stompClientRef.current = client;
        client.activate();

        // Función de limpieza: se ejecuta al cambiar de chat o al salir de la página.
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    // --- DEPENDENCIA CLAVE CORREGIDA ---
    // El efecto solo se volverá a ejecutar si el ID del contacto cambia,
    // evitando el bucle de renderizado y manteniendo la conexión estable.
    }, [otroUsuario?.id, user?.id, authHeader, rolOtroUsuario]); 

    // Efecto para hacer scroll al final cada vez que se añada un mensaje.
    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = () => {
        // Comprobar que el mensaje no esté vacío y que la conexión esté activa.
        if (newMessage.trim() && isConnected && stompClientRef.current?.active) {
            const chatMessage = {
                remitenteId: user.id,
                remitenteRol: user.rol,
                receptorId: otroUsuario.id,
                receptorRol: rolOtroUsuario,
                contenido: newMessage,
            };
            
            stompClientRef.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(chatMessage),
            });

            setNewMessage('');
        }
    };
    
    if (!otroUsuario) {
        return <div className="chat-placeholder">Selecciona un chat para comenzar.</div>;
    }

    return (
        <div className="chat-box">
            <div className="chat-header">
                <h3>{otroUsuario.nombres} {otroUsuario.apellidos}</h3>
                <span>{rolOtroUsuario.charAt(0).toUpperCase() + rolOtroUsuario.slice(1).toLowerCase()}</span>
            </div>
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.remitenteId === user.id ? 'sent' : 'received'}`}>
                        <div className="message-content">{msg.contenido}</div>
                        <div className="message-timestamp">
                            {new Date(msg.fechaEnvio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Escribe un mensaje..."
                    disabled={!isConnected}
                />
                <button onClick={handleSendMessage} disabled={!isConnected}>Enviar</button>
            </div>
        </div>
    );
};

export default ChatBox;
