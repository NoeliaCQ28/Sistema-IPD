import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ModalStyles.css';

Modal.setAppElement('#root');

const EventoModal = ({ isOpen, onClose, onSave, onDelete, eventToEdit, initialDates }) => {
    const [title, setTitle] = useState('');
    const [disciplina, setDisciplina] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    const isEditing = !!eventToEdit;

    useEffect(() => {
        const formatDateTimeLocal = (date) => {
            if (!date) return '';
            const d = new Date(date);
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
            return d.toISOString().slice(0, 16);
        };

        if (isEditing) {
            setTitle(eventToEdit.title || '');
            setDisciplina(eventToEdit.disciplina || '');
            setStart(formatDateTimeLocal(eventToEdit.start));
            setEnd(formatDateTimeLocal(eventToEdit.end));
        } else {
            setTitle('');
            setDisciplina('');
            setStart(initialDates ? formatDateTimeLocal(initialDates.start) : '');
            setEnd(initialDates ? formatDateTimeLocal(initialDates.end) : '');
        }
    }, [eventToEdit, initialDates, isOpen, isEditing]);

    const handleSave = () => {
        const eventData = {
            id: eventToEdit?.id,
            title,
            disciplina,
            start: new Date(start).toISOString(),
            end: new Date(end).toISOString(),
        };
        onSave(eventData, 'evento');
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal"
            overlayClassName="overlay"
        >
            <h2>{isEditing ? 'Editar Evento' : 'Nuevo Evento'}</h2>
            
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

            <div className="modal-buttons">
                {isEditing && (
                    <button onClick={() => onDelete(eventToEdit.id, 'evento')} className="delete-button">
                        Eliminar
                    </button>
                )}
                <button onClick={onClose} className="cancel-button">Cancelar</button>
                <button onClick={handleSave} className="save-button">Guardar</button>
            </div>
        </Modal>
    );
};

export default EventoModal;
