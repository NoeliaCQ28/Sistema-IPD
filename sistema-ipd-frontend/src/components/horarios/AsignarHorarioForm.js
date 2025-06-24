import React, { useState } from 'react';
import Select from 'react-select';
// Puedes usar los estilos de los otros formularios
import '../progreso/ProgresoForm.css';

const AsignarHorarioForm = ({ deportistasAsignados, entrenadorId, authHeader, onHorarioAsignado, onCancel }) => {
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

        try {
            const response = await fetch(`http://localhost:8081/api/v1/entrenadores/${entrenadorId}/horarios-asignar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                body: JSON.stringify(horarioData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Error del servidor');
            }
            setFormMessage({ text: 'Horario asignado con éxito.', type: 'success' });
            // Llama a la función del padre después de un breve momento para que el usuario vea el mensaje
            setTimeout(() => {
                onHorarioAsignado();
            }, 1000);
        } catch (err) {
            setFormMessage({ text: `Error al asignar horario: ${err.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="progreso-form-container">
            <form onSubmit={handleSubmit} className="progreso-form">
                <div className="form-group">
                    <label>Deportista:</label>
                    <Select
                        options={deportistaOptions}
                        value={selectedDeportista}
                        onChange={setSelectedDeportista}
                        placeholder="Selecciona un deportista..."
                        isClearable
                    />
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
                        {isLoading ? 'Asignando...' : 'Asignar Horario'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AsignarHorarioForm;
