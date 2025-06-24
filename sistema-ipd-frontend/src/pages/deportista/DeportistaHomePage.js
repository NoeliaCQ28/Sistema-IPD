import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './DeportistaHomePage.css';
import ProgresoHistorial from '../../components/progreso/ProgresoHistorial';
import Modal from '../../components/Modal';
import ChatBox from '../../components/mensajeria/ChatBox';

const eventColors = ['rojo', 'verde', 'azul', 'naranja'];

const DeportistaHomePage = () => {
    const { user, logout, authHeader } = useAuth();
    const [eventos, setEventos] = useState([]);
    const [deportistaData, setDeportistaData] = useState(null);
    const [unreadCounts, setUnreadCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isChatModalOpen, setIsChatModalOpen] = useState(false);

    useEffect(() => {
        // La dependencia de user?.id es la clave para evitar el bucle infinito
        if (user?.id && authHeader) {
            const fetchData = async () => {
                setLoading(true);
                setError(null);
                try {
                    const [deportistaRes, eventosRes, unreadCountsRes] = await Promise.all([
                        fetch(`http://localhost:8081/api/v1/deportistas/${user.id}`, { headers: { 'Authorization': authHeader } }),
                        fetch(`http://localhost:8081/api/v1/eventos/por-disciplina/${user.disciplina}`, { headers: { 'Authorization': authHeader } }),
                        fetch(`http://localhost:8081/api/v1/mensajes/no-leidos/por-remitente`, { headers: { 'Authorization': authHeader } })
                    ]);

                    if (!deportistaRes.ok) throw new Error('No se pudieron cargar tus datos.');
                    const deportistaJson = await deportistaRes.json();
                    setDeportistaData(deportistaJson);

                    if (eventosRes.ok) {
                        const eventosJson = await eventosRes.json();
                        setEventos(eventosJson);
                    } else {
                         console.error("No se pudieron cargar los eventos.");
                    }

                    if (unreadCountsRes.ok) {
                        const countsJson = await unreadCountsRes.json();
                        setUnreadCounts(countsJson);
                    } else {
                        console.error("No se pudo obtener el conteo de mensajes no leídos.");
                    }

                } catch (err) {
                    setError("Error al cargar los datos: " + err.message);
                    console.error("Error al cargar datos:", err);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    // --- LÍNEA CORREGIDA ---
    }, [user?.id, authHeader]);
    // --- FIN DE LA CORRECCIÓN ---

    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return 'N/A';
        const cumpleanos = new Date(fechaNacimiento); 
        const hoy = new Date();
        let edad = hoy.getFullYear() - cumpleanos.getFullYear();
        const m = hoy.getMonth() - cumpleanos.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
        return edad;
    };

    const handleOpenChat = () => {
        if (deportistaData && deportistaData.entrenador) {
            setIsChatModalOpen(true);
        } else {
            alert("No tienes un entrenador asignado para chatear.");
        }
    };

    const handleCloseChatModal = () => {
        setIsChatModalOpen(false);
    };

    if (loading) {
        return <p>Cargando perfil del deportista...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!deportistaData) {
        return <p>No se pudieron cargar los datos del deportista.</p>;
    }

    const unreadFromCoach = deportistaData.entrenador ? (unreadCounts[deportistaData.entrenador.id] || 0) : 0;

    return (
        <div className="deportista-portal">
            <header className="portal-header">
                <h2>Perfil del Deportista</h2>
                <div className="header-actions">
                    <button onClick={logout} className="logout-button">Cerrar sesión</button>
                </div>
            </header>

            <div className="portal-body">
                <aside className="profile-sidebar">
                    <div className="profile-card">
                        <img src={`https://i.pravatar.cc/150?u=${deportistaData.id}`} alt="Foto de perfil" className="profile-picture" />
                        <h3>{deportistaData.nombres} {deportistaData.apellidos}</h3>
                        <p>{deportistaData.disciplina || 'Sin disciplina'}</p>
                        <p>Edad: {calcularEdad(deportistaData.fechaNacimiento)} años</p>
                        <p className="dni">DNI: {deportistaData.dni || 'N/A'}</p>
                        <p>Teléfono: {deportistaData.telefono || 'N/A'}</p>
                        <p>Correo: {deportistaData.correo || 'N/A'}</p>
                    </div>
                    <div className="info-card assigned-coaches">
                        <h4>Entrenador Asignado</h4>
                        {deportistaData.entrenador ? (
                            <div className="coach-item">
                                <div className="coach-details">
                                    <strong>{deportistaData.entrenador.nombreCompleto}</strong>
                                    {unreadFromCoach > 0 && (
                                        <span className="unread-indicator" title={`${unreadFromCoach} mensaje(s) nuevo(s)`}>
                                            {unreadFromCoach}
                                        </span>
                                    )}
                                </div>
                                <button 
                                    className="action-button" 
                                    onClick={handleOpenChat}
                                >
                                    Enviar Mensaje
                                </button>
                            </div>
                        ) : (
                            <p>No tienes entrenador asignado.</p>
                        )}
                    </div>
                </aside>

                <section className="main-content">
                    <div className="info-card">
                        <h4>Horario de Entrenamiento Semanal</h4>
                        <table className="schedule-table">
                            <thead>
                                <tr><th>Día</th><th>Horario</th><th>Actividad</th><th>Entrenador</th></tr>
                            </thead>
                            <tbody>
                                {deportistaData.horarioEntrenamiento && deportistaData.horarioEntrenamiento.length > 0 ? (
                                    deportistaData.horarioEntrenamiento.map((item, index) => (
                                        <tr key={item.id || index}>
                                            <td>{item.dia}</td>
                                            <td>{item.horario}</td>
                                            <td>{item.actividad}</td>
                                            <td>{item.entrenadorNombre || 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4">No hay horario de entrenamiento asignado.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                     <div className="info-card">
                        <h4>Eventos Programados</h4>
                        {eventos.length > 0 ? (
                            eventos.map((evento, index) => (
                                <div key={evento.id} className={`event-list-item ${eventColors[index % eventColors.length]}`}>
                                    {evento.title}: {new Date(evento.start).toLocaleDateString('es-ES')}
                                </div>
                            ))
                        ) : (
                            <p>No hay eventos programados para tu disciplina.</p>
                        )}
                    </div>

                    {deportistaData.id && (
                        <ProgresoHistorial deportistaId={deportistaData.id} />
                    )}
                </section>
            </div>

            {deportistaData.entrenador && user && user.id && (
                <Modal
                    isOpen={isChatModalOpen}
                    onClose={handleCloseChatModal}
                    title={`Chatear con ${deportistaData.entrenador.nombreCompleto}`}
                >
                    <ChatBox 
                        currentUserId={user.id}
                        currentUserRol={user.rol}
                        otherUserId={deportistaData.entrenador.id}
                        otherUserRol="ENTRENADOR"
                        otherUserName={deportistaData.entrenador.nombreCompleto}
                    />
                </Modal>
            )}
        </div>
    );
};

export default DeportistaHomePage;