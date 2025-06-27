import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ModalStyles.css';

Modal.setAppElement('#root');

// 1. Añadimos 'initialDates' como prop para manejar la creación de nuevos torneos
const TorneoModal = ({ isOpen, onClose, onSave, onDelete, torneoToEdit, initialDates }) => {
    const [nombre, setNombre] = useState('');
    const [lugar, setLugar] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    // 2. Determinamos si estamos en modo de edición o creación
    const isEditing = !!torneoToEdit;

    useEffect(() => {
        const formatToDateInput = (date) => {
            if (!date) return '';
            return new Date(date).toISOString().split('T')[0];
        };

        if (isEditing) {
            // Si estamos editando, llenamos con los datos del torneo
            setNombre(torneoToEdit.nombre || '');
            setLugar(torneoToEdit.lugar || '');
            setCategoria(torneoToEdit.categoria || '');
            setDescripcion(torneoToEdit.descripcion || '');
            setFechaInicio(formatToDateInput(torneoToEdit.fechaInicio));
            setFechaFin(formatToDateInput(torneoToEdit.fechaFin));
        } else {
            // Si estamos creando, reseteamos los campos
            setNombre('');
            setLugar('');
            setCategoria('');
            setDescripcion('');
            // Y usamos las fechas del slot del calendario si están disponibles
            setFechaInicio(initialDates ? formatToDateInput(initialDates.start) : '');
            setFechaFin(initialDates ? formatToDateInput(initialDates.end) : '');
        }
    }, [torneoToEdit, initialDates, isOpen, isEditing]);

    const handleSave = () => {
        const torneoData = {
            id: torneoToEdit?.id,
            nombre,
            lugar,
            categoria,
            descripcion,
            fechaInicio,
            fechaFin,
        };
        onSave(torneoData, 'torneo');
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="modal"
            overlayClassName="overlay"
        >
            {/* 3. Título dinámico */}
            <h2>{isEditing ? 'Editar Torneo' : 'Nuevo Torneo'}</h2>
            
            <div className="form-group">
                <label>Nombre del Torneo</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required/>
            </div>
            <div className="form-group">
                <label>Lugar</label>
                <input type="text" value={lugar} onChange={(e) => setLugar(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Categoría</label>
                <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} />
            </div>
             <div className="form-group">
                <label>Descripción</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Fecha de Inicio</label>
                <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required/>
            </div>
            <div className="form-group">
                <label>Fecha de Fin</label>
                <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>

            <div className="modal-buttons">
                {isEditing && (
                    <button onClick={() => onDelete(torneoToEdit.id, 'torneo')} className="delete-button">
                        Eliminar
                    </button>
                )}
                <button onClick={onClose} className="cancel-button">Cancelar</button>
                <button onClick={handleSave} className="save-button">Guardar</button>
            </div>
        </Modal>
    );
};

export default TorneoModal;
