import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';
// Reutilizamos los estilos del formulario de progreso que ya tenemos
import '../progreso/ProgresoForm.css';

// El componente ahora acepta una prop `editingHorario`
const AsignarHorarioForm = ({ deportistasAsignados, entrenadorId, onHorarioGuardado, onCancel, editingHorario }) => {
    const { authHeader } = useAuth();
    const [selectedDeportista, setSelectedDeportista] = useState(null);
    const [dia, setDia] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [actividad, setActividad] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formMessage, setFormMessage] = useState({ text: '', type: '' });

    const deportistaOptions = deportistasAsignados.map(dep => ({
        value: dep.id,
        label: `${dep.nombreCompleto} (${dep.disciplina})`
    }));

    // Este efecto se ejecuta si pasamos un horario para editar,
    // y llena el formulario con sus datos.
    useEffect(() => {
        if (editingHorario) {
            const deportistaOption = deportistaOptions.find(opt => opt.value === editingHorario.resource.deportistaId);
            setSelectedDeportista(deportistaOption || null);
            setDia(editingHorario.resource.dia);
            setActividad(editingHorario.resource.actividad);
            
            const [start, end] = editingHorario.resource.horario.split(' - ');
            setHoraInicio(start || '');
            setHoraFin(end || '');
        }
    }, [editingHorario, deportistasAsignados]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormMessage({ text: '', type: '' });

        if (!selectedDeportista || !dia || !horaInicio || !horaFin || !actividad) {
            setFormMessage({ text: 'Por favor, completa todos los campos.', type: 'error' });
            setIsLoading(false);
            return;
        }
        
        const horarioData = {
            deportistaId: selectedDeportista.value,
            dia: dia,
            horario: `${horaInicio} - ${horaFin}`,
            actividad: actividad
        };
        
        // La URL y el método HTTP cambian si estamos editando o creando
        const isEditing = !!editingHorario;
        const url = isEditing 
            ? `http://localhost:8081/api/v1/horarios/${editingHorario.id}`
            : `http://localhost:8081/api/v1/entrenadores/${entrenadorId}/horarios-asignar`;
        
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                body: JSON.stringify(horarioData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error del servidor');
            }
            const successMessage = isEditing ? 'Horario actualizado con éxito.' : 'Horario asignado con éxito.';
            setFormMessage({ text: successMessage, type: 'success' });
            setTimeout(() => onHorarioGuardado(), 1000);
        } catch (err) {
            setFormMessage({ text: `Error: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="progreso-form-container">
            <form onSubmit={handleSubmit} className="progreso-form">
                <div className="form-group">
                    <label>Deportista:</label>
                    <Select options={deportistaOptions} value={selectedDeportista} onChange={setSelectedDeportista} placeholder="Selecciona un deportista..." isClearable />
                </div>
                <div className="form-group">
                    <label>Día:</label>
                    <input type="text" value={dia} onChange={(e) => setDia(e.target.value)} placeholder="Ej: Lunes, Martes..." />
                </div>
                <div className="form-group-inline">
                    <div className="form-group">
                        <label>Hora Inicio:</label>
                        <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Hora Fin:</label>
                        <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
                    </div>
                </div>
                <div className="form-group">
                    <label>Actividad:</label>
                    <input type="text" value={actividad} onChange={(e) => setActividad(e.target.value)} placeholder="Ej: Entrenamiento de pista" />
                </div>
                
                {formMessage.text && (
                    <div className={`form-message ${formMessage.type}`}>
                        {formMessage.text}
                    </div>
                )}
                
                <div className="form-buttons">
                    <button type="button" onClick={onCancel} className="cancel-button">Cancelar</button>
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : (editingHorario ? 'Actualizar Horario' : 'Asignar Horario')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AsignarHorarioForm;
