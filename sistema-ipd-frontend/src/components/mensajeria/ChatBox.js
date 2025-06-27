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

    // --- EFECTO 1: Cargar el historial del chat seleccionado ---
    useEffect(() => {
        if (!otroUsuario?.id || !authHeader) return;
        
        setMessages([]); // Limpiar mensajes al cambiar de conversación.

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
                console.error("Error al cargar historial:", error);
            }
        };
        fetchMessages();
    }, [otroUsuario?.id, authHeader, rolOtroUsuario]);

    // --- EFECTO 2: Gestionar la conexión y suscripción del WebSocket ---
    useEffect(() => {
        if (!user?.id || !authHeader) return;

        // Crear una única instancia del cliente STOMP.
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
            connectHeaders: { Authorization: authHeader },
            reconnectDelay: 10000,
            onConnect: () => {
                setIsConnected(true);
                // Suscribirse a la cola personal para recibir mensajes.
                // Esta es la parte que escucha los mensajes que el servidor envía a ESTE usuario.
                client.subscribe(`/user/${user.id}/queue/messages`, (message) => {
                    const receivedMessage = JSON.parse(message.body);

                    // Lógica para mostrar el mensaje recibido del OTRO usuario.
                    setMessages(prevMessages => {
                        // Evita añadir un mensaje que ya podría estar (por la actualización optimista).
                        if (prevMessages.some(msg => msg.id === receivedMessage.id)) {
                            return prevMessages;
                        }
                        return [...prevMessages, receivedMessage];
                    });
                });
            },
            onDisconnect: () => setIsConnected(false),
        });

        stompClientRef.current = client;
        client.activate();

        // Función de limpieza para desconectar al salir.
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [user?.id, authHeader]);

    // Efecto para scroll automático.
    useEffect(scrollToBottom, [messages]);

    // --- FUNCIÓN DE ENVÍO CON ACTUALIZACIÓN OPTIMISTA ---
    const handleSendMessage = () => {
        if (!newMessage.trim() || !isConnected || !stompClientRef.current?.active) {
            return;
        }

        const tempId = `temp-${Date.now()}`; // ID temporal para la UI
        const chatMessage = {
            remitenteId: user.id,
            remitenteRol: user.rol,
            receptorId: otroUsuario.id,
            receptorRol: rolOtroUsuario,
            contenido: newMessage,
        };
        
        // **ACTUALIZACIÓN OPTIMISTA**
        // Añadimos el mensaje a la UI inmediatamente con un ID temporal.
        // El usuario ve su mensaje al instante.
        const optimisticMessage = {
            ...chatMessage,
            id: tempId,
            fechaEnvio: new Date().toISOString(),
        };
        setMessages(prevMessages => [...prevMessages, optimisticMessage]);
        
        // Limpiamos el input.
        setNewMessage('');

        // Publicamos el mensaje real al servidor.
        stompClientRef.current.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(chatMessage),
        });
    };
    
    // --- Renderizado del componente ---
    return (
        <div className="chat-box">
             <div className="chat-header">
                <h3>{otroUsuario.nombres} {otroUsuario.apellidos}</h3>
                <span className={`status ${isConnected ? 'online' : 'offline'}`}>
                    {isConnected ? 'Conectado' : 'Desconectado'}
                </span>
            </div>
            <div className="chat-messages">
                {messages.map((msg) => (
                    // Usamos el id temporal como key si el mensaje aún no tiene uno del backend.
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
                    placeholder={isConnected ? "Escribe un mensaje..." : "Conectando..."}
                    disabled={!isConnected}
                />
                <button onClick={handleSendMessage} disabled={!isConnected || !newMessage.trim()}>Enviar</button>
            </div>
        </div>
    );
};

export default ChatBox;