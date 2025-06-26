import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../../context/AuthContext';
// --- RUTA CSS CORREGIDA ---
import '../Views.css'; 
import './TomarAsistenciaView.css'; 

const TomarAsistenciaView = () => {
    const { user, authHeader } = useAuth();
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [listaAsistencia, setListaAsistencia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const fetchAsistencia = useCallback(async () => {
        if (!user?.id || !authHeader || !fecha) return;
        setLoading(true);
        setError(null);
        setSaveMessage('');

        try {
            const response = await fetch(`http://localhost:8081/api/v1/asistencias/entrenador/${user.id}?fecha=${fecha}`, {
                headers: { 'Authorization': authHeader }
            });
            if (!response.ok) {
                throw new Error('No se pudo cargar la lista de asistencia. Verifique la fecha y sus permisos.');
            }
            const data = await response.json();
            setListaAsistencia(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id, authHeader, fecha]);

    useEffect(() => {
        fetchAsistencia();
    }, [fetchAsistencia]);

    const handleEstadoChange = (deportistaId, nuevoEstado) => {
        setListaAsistencia(prevLista =>
            prevLista.map(item =>
                item.deportistaId === deportistaId ? { ...item, estado: nuevoEstado } : item
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveMessage('');
        setError(null);

        const payload = listaAsistencia.map(item => ({
            deportistaId: item.deportistaId,
            fecha: item.fecha,
            estado: item.estado,
        }));

        try {
            const response = await fetch(`http://localhost:8081/api/v1/asistencias/entrenador/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Ocurrió un error al guardar la asistencia.');
            
            setSaveMessage('Asistencia guardada con éxito!');
            setTimeout(() => setSaveMessage(''), 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="asistencia-controls">
                <label htmlFor="fecha-asistencia">Selecciona la fecha:</label>
                <input
                    type="date"
                    id="fecha-asistencia"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="asistencia-datepicker"
                />
            </div>

            {loading && <p>Cargando lista de deportistas...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && (
                <form onSubmit={handleSubmit}>
                    <div className="asistencia-list">
                        {listaAsistencia.length > 0 ? (
                            listaAsistencia.map(item => (
                                <div key={item.deportistaId} className="asistencia-item">
                                    <span className="deportista-nombre">{item.deportistaNombreCompleto}</span>
                                    <div className="estado-radios">
                                        <label className={item.estado === 'PRESENTE' ? 'active' : ''}>
                                            <input type="radio" name={`estado-${item.deportistaId}`} value="PRESENTE" checked={item.estado === 'PRESENTE'} onChange={() => handleEstadoChange(item.deportistaId, 'PRESENTE')} />
                                            Presente
                                        </label>
                                        <label className={item.estado === 'AUSENTE' ? 'active' : ''}>
                                            <input type="radio" name={`estado-${item.deportistaId}`} value="AUSENTE" checked={item.estado === 'AUSENTE'} onChange={() => handleEstadoChange(item.deportistaId, 'AUSENTE')} />
                                            Ausente
                                        </label>
                                        <label className={item.estado === 'JUSTIFICADO' ? 'active' : ''}>
                                            <input type="radio" name={`estado-${item.deportistaId}`} value="JUSTIFICADO" checked={item.estado === 'JUSTIFICADO'} onChange={() => handleEstadoChange(item.deportistaId, 'JUSTIFICADO')} />
                                            Justificado
                                        </label>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No tienes deportistas asignados para mostrar.</p>
                        )}
                    </div>
                    
                    {listaAsistencia.length > 0 && (
                         <div className="asistencia-footer">
                            <button type="submit" className="action-button-view primary" disabled={saving}>
                                {saving ? 'Guardando...' : 'Guardar Asistencia'}
                            </button>
                            {saveMessage && <span className="save-success-message">{saveMessage}</span>}
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default TomarAsistenciaView;
