import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/Modal';
import ProgresoForm from '../../../components/progreso/ProgresoForm';
import './Views.css';

const ProgresoView = () => {
    const { user, authHeader } = useAuth();
    const [progresos, setProgresos] = useState([]);
    const [deportistas, setDeportistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProgreso, setEditingProgreso] = useState(null);

    // Fetch para los deportistas (necesario para el modal)
    const fetchDeportistas = useCallback(async () => {
        if (!user?.id || !authHeader) return;
        try {
            const deportistasRes = await fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}/deportistas`, { headers: { 'Authorization': authHeader } });
            if (!deportistasRes.ok) throw new Error('No se pudieron cargar los deportistas para el formulario.');
            const deportistasData = await deportistasRes.json();
            setDeportistas(deportistasData);
        } catch (err) {
            console.error(err); // Lo registramos en consola pero no bloqueamos la UI
        }
    }, [user?.id, authHeader]);

    // Fetch para el historial de progreso
    const fetchProgresos = useCallback(async () => {
        if (!user?.id || !authHeader) return;
        setLoading(true);
        setError(null);
        try {
            const progresosRes = await fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}/progresos/todos`, { headers: { 'Authorization': authHeader } });
            if (!progresosRes.ok) throw new Error('No se pudo cargar el historial de progreso. Verifique sus permisos.');
            const progresosData = await progresosRes.json();
            setProgresos(progresosData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id, authHeader]);

    useEffect(() => {
        // Llamamos a ambas funciones de carga. Ahora son independientes.
        fetchDeportistas();
        fetchProgresos();
    }, [fetchDeportistas, fetchProgresos]);

    const handleOpenModal = (progreso = null) => {
        setEditingProgreso(progreso);
        setIsModalOpen(true);
    };

    const handleProgresoSaved = () => {
        setIsModalOpen(false);
        setEditingProgreso(null);
        fetchProgresos(); // Solo recargamos el historial
    };

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>Historial de Progreso</h1>
                <div className="view-actions">
                    <button className="action-button-view primary" onClick={() => handleOpenModal()}>
                        + Registrar Nuevo Progreso
                    </button>
                </div>
            </header>

            {loading && <p>Cargando historial...</p>}
            {error && <p className="error-message">{error}</p>}
            
            {!loading && !error && (
                <div className="table-container">
                    <table className="data-table">
                        {/* ... (contenido de la tabla sin cambios) ... */}
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Deportista</th>
                                <th>Métrica</th>
                                <th>Valor</th>
                                <th>Observaciones</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {progresos.length > 0 ? (
                                progresos.map(p => (
                                    <tr key={p.id}>
                                        <td>{new Date(p.fechaRegistro + 'T00:00:00').toLocaleDateString('es-ES')}</td>
                                        <td>{p.deportistaNombreCompleto}</td>
                                        <td>{p.tipoMebrica}</td>
                                        <td>{p.valor}</td>
                                        <td>{p.observaciones || 'N/A'}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button className="action-button edit" onClick={() => handleOpenModal(p)}>Editar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">No has registrado ningún progreso.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProgreso ? 'Editar Registro de Progreso' : 'Registrar Nuevo Progreso'}
            >
                <ProgresoForm 
                    deportistasAsignados={deportistas}
                    entrenadorId={user?.id}
                    onProgresoRegistrado={handleProgresoSaved}
                    editingProgreso={editingProgreso}
                    onProgresoActualizado={handleProgresoSaved}
                    onCancelEdit={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default ProgresoView;