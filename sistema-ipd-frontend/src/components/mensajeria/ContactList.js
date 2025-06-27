import React from 'react';
import './ContactList.css'; // Crearemos este CSS

const ContactList = ({ contactos, onSelectContact, selectedContactId }) => {
    return (
        <div className="contact-list-container">
            <h4>Contactos</h4>
            <ul className="contact-list">
                {contactos.length > 0 ? (
                    contactos.map(contacto => (
                        <li 
                            key={contacto.id} 
                            className={`contact-item ${selectedContactId === contacto.id ? 'active' : ''}`}
                            onClick={() => onSelectContact(contacto)}
                        >
                            <img src={`https://i.pravatar.cc/150?u=${contacto.id}`} alt="Avatar" />
                            <div className="contact-info">
                                <span className="contact-name">{contacto.nombreCompleto}</span>
                                <span className="contact-role">Deportista</span>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No tienes contactos.</p>
                )}
            </ul>
        </div>
    );
};

export default ContactList;
