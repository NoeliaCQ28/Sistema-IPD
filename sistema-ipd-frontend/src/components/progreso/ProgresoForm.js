import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';
import './ProgresoForm.css';

const ProgresoForm = ({ deportistasAsignados, entrenadorId, onProgresoRegistrado, editingProgreso, onProgresoActualizado, onCancelEdit }) => {
    const { authHeader } = useAuth();
    const [selectedDeportista, setSelectedDeportista] = useState(null);
    const [fechaRegistro, setFechaRegistro] = useState('');
    const [tipoMebrica, setTipoMebrica] = useState('');
    const [valor, setValor] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const deportistaOptions = deportistasAsignados.map(dep => ({
        value: dep.id,
        label: `${dep.nombreCompleto} (${dep.disciplina})`
    }));

    const tipoMetricaOptions = [
        { value: 'Peso Levantado (kg)', label: 'Peso Levantado (kg)' },
        { value: 'Tiempo Carrera (min)', label: 'Tiempo Carrera (min)' },
        { value: 'Distancia Salto (m)', label: 'Distancia Salto (m)' },
        { value: 'Repeticiones', label: 'Repeticiones' },
        { value: 'Calorías Quemadas', label: 'Calorías Quemadas' },
    ];

    useEffect(() => {
        if (editingProgreso) {
            let deportistaOption = null;
            if (deportistaOptions.length > 0) {
                deportistaOption = deportistaOptions.find(
                    opt => opt.value === editingProgreso.deportistaId
                );
            }
            setSelectedDeportista(deportistaOption || { 
                value: editingProgreso.deportistaId, 
                label: editingProgreso.deportistaNombreCompleto || `ID: ${editingProgreso.deportistaId}` 
            });
            
            setFechaRegistro(editingProgreso.fechaRegistro);
            setTipoMebrica(editingProgreso.tipoMebrica);
            setValor(String(editingProgreso.valor));
            setObservaciones(editingProgreso.observaciones || '');
            setMessage('');
            setMessageType('');
        } else {
            setSelectedDeportista(null);
            setFechaRegistro('');
            setTipoMebrica('');
            setValor('');
            setObservaciones('');
            setMessage('');
            setMessageType('');
        }
    }, [editingProgreso, deportistasAsignados]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('');
        setIsLoading(true);

        if (!selectedDeportista || !fechaRegistro || !tipoMebrica || valor === '') {
            setMessage('Por favor, completa los campos obligatorios.');
            setMessageType('error');
            setIsLoading(false);
            return;
        }

        const progresoData = {
            deportistaId: selectedDeportista.value,
            entrenadorId: entrenadorId,
            fechaRegistro: fechaRegistro,
            tipoMebrica: tipoMebrica,
            valor: parseFloat(valor),
            observaciones: observaciones
        };

        const url = editingProgreso
            ? `http://localhost:8081/api/v1/entrenadores/${entrenadorId}/progresos/${editingProgreso.id}`
            : `http://localhost:8081/api/v1/entrenadores/${entrenadorId}/progresos`;
        const method = editingProgreso ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
                body: JSON.stringify(progresoData)
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(errorBody || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMessage(`Progreso ${editingProgreso ? 'actualizado' : 'registrado'} exitosamente.`);
            setMessageType('success');
            
            if (editingProgreso) {
                if (onProgresoActualizado) onProgresoActualizado(data);
            } else {
                if (onProgresoRegistrado) onProgresoRegistrado(data);
            }
            onCancelEdit();

        } catch (err) {
            setMessage(`Error al ${editingProgreso ? 'actualizar' : 'registrar'} progreso: ${err.message}`);
            setMessageType('error');
            console.error("Error al registrar/actualizar progreso:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="progreso-form-container info-card">
            <h4>{editingProgreso ? 'Editar Registro de Progreso' : 'Registrar Progreso del Deportista'}</h4>
            <form onSubmit={handleSubmit} className="progreso-form">
                <div className="form-group">
                    <label htmlFor="deportista-select">Deportista:</label>
                    <Select
                        id="deportista-select"
                        options={deportistaOptions}
                        value={selectedDeportista}
                        onChange={setSelectedDeportista}
                        placeholder="Selecciona un deportista"
                        isClearable
                        required
                        isDisabled={Boolean(editingProgreso)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="fecha-registro">Fecha de Registro:</label>
                    <input type="date" id="fecha-registro" value={fechaRegistro} onChange={(e) => setFechaRegistro(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label htmlFor="tipo-metrica">Tipo de Métrica:</label>
                    <Select
                        id="tipo-metrica"
                        options={tipoMetricaOptions}
                        value={tipoMetricaOptions.find(option => option.value === tipoMebrica)}
                        onChange={(option) => setTipoMebrica(option ? option.value : '')}
                        placeholder="Selecciona una métrica"
                        isClearable
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="valor">Valor:</label>
                    <input type="number" id="valor" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ej: 75.5" step="0.01" required />
                </div>

                <div className="form-group">
                    <label htmlFor="observaciones">Observaciones:</label>
                    <textarea id="observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Notas adicionales sobre el progreso..." rows="3"></textarea>
                </div>

                <div className="form-buttons">
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? (editingProgreso ? 'Actualizando...' : 'Registrando...') : (editingProgreso ? 'Actualizar Progreso' : 'Registrar Progreso')}
                    </button>
                    {editingProgreso && (
                        <button type="button" onClick={onCancelEdit} className="cancel-button">
                            Cancelar Edición
                        </button>
                    )}
                </div>
                {message && <p className={`form-message ${messageType}`}>{message}</p>}
            </form>
        </div>
    );
};

export default ProgresoForm;