import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/Modal';
import ProgresoForm from '../../../components/progreso/ProgresoForm';
import AsignarHorarioForm from '../../../components/horarios/AsignarHorarioForm';
import ChatBox from '../../../components/mensajeria/ChatBox';
import './Views.css';

const DeportistasView = () => {
    const { user, authHeader } = useAuth();
    const navigate = useNavigate();

    // Estado para los datos y carga
    const [entrenadorData, setEntrenadorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para manejar los modales
    const [isProgresoModalOpen, setIsProgresoModalOpen] = useState(false);
    const [isHorarioModalOpen, setIsHorarioModalOpen] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    
    // Estado para la edición de progreso y el chat
    const [editingProgreso, setEditingProgreso] = useState(null);
    const [chatTarget, setChatTarget] = useState(null);

    // Función para recargar todos los datos del entrenador
    const fetchData = async () => {
        if (!user?.id || !authHeader) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}`, {
                headers: { 'Authorization': authHeader }
            });
            if (!response.ok) throw new Error('No se pudieron cargar los datos del entrenador.');
            const data = await response.json();
            setEntrenadorData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchData();
    }, [user?.id, authHeader]);

    // --- MANEJADORES DE MODALES Y ACCIONES ---

    const handleOpenProgresoModal = (progreso = null) => {
        setEditingProgreso(progreso);
        setIsProgresoModalOpen(true);
    };

    const handleProgresoSaved = () => {
        setIsProgresoModalOpen(false);
        setEditingProgreso(null);
        fetchData(); // Recargamos los datos para ver los cambios
    };
    
    const handleOpenChat = (targetId, targetRol, targetName) => {
        setChatTarget({ id: targetId, rol: targetRol, nombre: targetName });
        setIsChatModalOpen(true);
    };

    // --- RENDERIZADO DEL COMPONENTE ---

    if (loading) return <p>Cargando deportistas...</p>;
    if (error) return <p className="error-message">{error}</p>;

    const deportistas = entrenadorData?.deportistasACargo || [];

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>Mis Deportistas</h1>
                <div className="view-actions">
                    <button className="action-button-view primary" onClick={() => handleOpenProgresoModal(null)}>
                        + Registrar Progreso
                    </button>
                    <button className="action-button-view secondary" onClick={() => setIsHorarioModalOpen(true)}>
                        + Asignar Horario
                    </button>
                </div>
            </header>
            
            <div className="athlete-cards-container-view">
                {deportistas.length > 0 ? (
                    deportistas.map((deportista) => (
                        <div key={deportista.id} className="athlete-card-view">
                            <div className="athlete-card-header">
                                <img src={`https://i.pravatar.cc/150?u=${deportista.id}`} alt="Deportista" />
                                <div className="athlete-card-info">
                                    <strong>{deportista.nombreCompleto}</strong>
                                    <span>{deportista.disciplina}</span>
                                </div>
                            </div>
                            <div className="athlete-card-actions">
                                <button onClick={() => navigate(`/portal/entrenador/deportistas/ver/${deportista.id}`)}>
                                    Ver Detalles
                                </button>
                                <button onClick={() => handleOpenChat(deportista.id, 'DEPORTISTA', deportista.nombreCompleto)}>
                                    Chatear
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No tienes deportistas asignados.</p>
                )}
            </div>

            {/* --- MODALES --- */}
            
            <Modal
                isOpen={isProgresoModalOpen}
                onClose={() => setIsProgresoModalOpen(false)}
                title={editingProgreso ? 'Editar Registro de Progreso' : 'Registrar Nuevo Progreso'}
            >
                <ProgresoForm 
                    deportistasAsignados={deportistas}
                    entrenadorId={user?.id}
                    onProgresoRegistrado={handleProgresoSaved}
                    editingProgreso={editingProgreso}
                    onProgresoActualizado={handleProgresoSaved}
                    onCancelEdit={() => setIsProgresoModalOpen(false)}
                />
            </Modal>

            <Modal 
                isOpen={isHorarioModalOpen} 
                onClose={() => setIsHorarioModalOpen(false)}
                title="Asignar Nuevo Horario"
            >
                <AsignarHorarioForm 
                    deportistasAsignados={deportistas}
                    entrenadorId={user?.id}
                    authHeader={authHeader}
                    onHorarioAsignado={() => {
                        setIsHorarioModalOpen(false);
                        fetchData();
                    }}
                    onCancel={() => setIsHorarioModalOpen(false)}
                />
            </Modal>

            {chatTarget && (
                <Modal
                    isOpen={isChatModalOpen}
                    onClose={() => setIsChatModalOpen(false)}
                    title={`Chatear con ${chatTarget.nombre}`}
                >
                    <ChatBox 
                        currentUserId={user?.id}
                        currentUserRol="ENTRENADOR"
                        otherUserId={chatTarget.id}
                        otherUserRol={chatTarget.rol}
                        otherUserName={chatTarget.nombre}
                    />
                </Modal>
            )}
        </div>
    );
};

export default DeportistasView;
