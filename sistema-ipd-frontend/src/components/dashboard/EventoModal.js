import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ModalStyles.css'; // Asegúrate de que este archivo de estilos exista

// Para accesibilidad, le decimos al modal cuál es el elemento raíz de la app
Modal.setAppElement('#root');

const EventoModal = ({ isOpen, onClose, onSave, onDelete, eventToEdit }) => {
    const [title, setTitle] = useState('');
    const [disciplina, setDisciplina] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    useEffect(() => {
        // Este efecto se dispara cada vez que el modal se abre con un evento para editar
        if (eventToEdit) {
            setTitle(eventToEdit.title || '');
            setDisciplina(eventToEdit.disciplina || '');
            
            // Función para formatear las fechas al formato que el input <input type="datetime-local"> necesita
            const formatDateTimeLocal = (date) => {
                if (!date) return '';
                const d = new Date(date);
                // Ajusta la fecha a la zona horaria local para mostrarla correctamente
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                return d.toISOString().slice(0, 16);
            };

            setStart(formatDateTimeLocal(eventToEdit.start));
            setEnd(formatDateTimeLocal(eventToEdit.end));
        } else {
            // Limpia el formulario si es para un evento nuevo
            setTitle('');
            setDisciplina('');
            setStart('');
            setEnd('');
        }
    }, [eventToEdit, isOpen]); // Se ejecuta cuando cambia el evento a editar o cuando se abre/cierra el modal

    const handleSave = () => {
        // Prepara los datos para guardar, asegurando que las fechas estén en formato ISO (UTC)
        const eventData = {
            id: eventToEdit?.id,
            title,
            disciplina,
            start: new Date(start).toISOString(),
            end: new Date(end).toISOString(),
        };
        onSave(eventData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal"
            overlayClassName="overlay"
        >
            <h2>{eventToEdit?.id ? 'Editar Evento' : 'Nuevo Evento'}</h2>
            
            <div className="form-group">
                <label>Título del Evento</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Disciplina</label>
                <input type="text" value={disciplina} onChange={(e) => setDisciplina(e.target.value)} placeholder="Ej: Natación, Atletismo, etc."/>
            </div>
            <div className="form-group">
                <label>Inicio</label>
                <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Fin</label>
                <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>

            {/* --- SECCIÓN DE BOTONES --- */}
            <div className="modal-buttons">
                {/* El botón de eliminar solo aparece si estamos editando un evento existente */}
                {eventToEdit?.id && (
                    <button onClick={() => onDelete(eventToEdit.id)} className="delete-button">Eliminar</button>
                )}
                <button onClick={onClose} className="cancel-button">Cancelar</button>
                <button onClick={handleSave} className="save-button">Guardar</button>
            </div>
        </Modal>
    );
};

export default EventoModal;