import React, { useState, useEffect, useCallback } from 'react';
// --- RUTAS DE IMPORTACIÓN CORREGIDAS ---
// Subimos cuatro niveles desde /pages/entrenador/views/mensajeria/ para llegar a la raíz `src`
import { useAuth } from '../../../../context/AuthContext';
import ContactList from '../../../../components/mensajeria/ContactList';
import ChatBox from '../../../../components/mensajeria/ChatBox';
import './MensajeriaView.css';

const MensajeriaView = () => {
    const { user, authHeader } = useAuth();
    const [contactos, setContactos] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchContacts = useCallback(async () => {
        if (user?.id && authHeader) {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}/deportistas`, {
                    headers: { 'Authorization': authHeader }
                });
                if (response.ok) {
                    const data = await response.json();
                    setContactos(data);
                } else {
                     console.error("Error al cargar los contactos.");
                }
            } catch (error) {
                console.error("Error en la petición de contactos:", error);
            } finally {
                setLoading(false);
            }
        }
    }, [user?.id, authHeader]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const handleSelectContact = (contacto) => {
        setSelectedContact(contacto);
    };

    if (loading) {
        return <p>Cargando contactos...</p>;
    }

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>Mensajería</h1>
            </header>
            <div className="mensajeria-layout">
                <div className="contactos-sidebar">
                    <ContactList 
                        contactos={contactos}
                        onSelectContact={handleSelectContact}
                        selectedContactId={selectedContact?.id}
                    />
                </div>
                <div className="chat-area">
                    {selectedContact ? (
                        <ChatBox
                            key={selectedContact.id}
                            otroUsuario={selectedContact}
                            rolOtroUsuario="DEPORTISTA"
                        />
                    ) : (
                        <div className="chat-placeholder">
                            <h2>Bienvenido a tu mensajería</h2>
                            <p>Selecciona un contacto de la lista para comenzar a chatear.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MensajeriaView;
