import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ChatBox from '../../../components/mensajeria/ChatBox';
import './DeportistaViews.css';

const DeportistaMensajeriaView = () => {
    const { user, authHeader } = useAuth();
    // Estado para guardar la información completa del entrenador
    const [entrenador, setEntrenador] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // La información básica del entrenador puede venir en el objeto `user`.
        // Si necesitamos más detalles, o para asegurar que esté actualizada,
        // hacemos un fetch.
        const fetchEntrenadorDetails = async () => {
            if (user?.entrenador?.id) {
                try {
                    const response = await fetch(`http://localhost:8081/api/v1/entrenadores/${user.entrenador.id}`, {
                        headers: { 'Authorization': authHeader }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        // Creamos un objeto compatible con lo que espera ChatBox
                        setEntrenador({
                            id: data.id,
                            nombres: data.nombres,
                            apellidos: data.apellidos
                        });
                    }
                } catch (error) {
                    console.error("Error al cargar detalles del entrenador", error);
                }
            }
            setLoading(false);
        };

        // Si ya tenemos un entrenador en el contexto, usamos esa info
        // mientras se cargan los detalles completos.
        if (user?.entrenador) {
             setEntrenador({
                id: user.entrenador.id,
                nombres: user.entrenador.nombreCompleto.split(' ')[0], // Un valor temporal
                apellidos: user.entrenador.nombreCompleto.split(' ').slice(1).join(' '), // Un valor temporal
             });
        }
        
        fetchEntrenadorDetails();

    }, [user?.entrenador, authHeader]);

    return (
        <div className="deportista-view-container" style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column', paddingBottom: 0 }}>
            <div className="view-header">
                <h1>Mensajería</h1>
                <p className="welcome-message">Comunícate directamente con tu entrenador.</p>
            </div>
            
            {loading ? (
                <p>Cargando chat...</p>
            ) : entrenador ? (
                 <div style={{ flexGrow: 1, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <ChatBox 
                        otroUsuario={entrenador}
                        rolOtroUsuario="ENTRENADOR"
                    />
                 </div>
            ) : (
                <div className="portal-card">
                    <p className="empty-message">No tienes un entrenador asignado para chatear.</p>
                </div>
            )}
        </div>
    );
};

export default DeportistaMensajeriaView;
