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

    const fetchData = useCallback(async () => {
        if (!user?.id || !authHeader) {
            return;
        }
        
        setLoading(true);
        setError(null);
        try {
            const [progresosRes, deportistasRes] = await Promise.all([
                fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}/progresos/todos`, { headers: { 'Authorization': authHeader } }),
                fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}/deportistas`, { headers: { 'Authorization': authHeader } })
            ]);

            if (!progresosRes.ok) throw new Error('No se pudo cargar el historial de progreso. Verifique sus permisos.');
            if (!deportistasRes.ok) throw new Error('No se pudieron cargar los deportistas para el formulario.');

            const progresosData = await progresosRes.json();
            const deportistasData = await deportistasRes.json();

            setProgresos(progresosData);
            setDeportistas(deportistasData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id, authHeader]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (progreso = null) => {
        setEditingProgreso(progreso);
        setIsModalOpen(true);
    };

    const handleProgresoSaved = () => {
        setIsModalOpen(false);
        setEditingProgreso(null);
        fetchData();
    };

    // --- NUEVA FUNCIÓN PARA ELIMINAR ---
    const handleDelete = async (progresoId) => {
        // Usamos una confirmación simple para evitar borrados accidentales
        if (!window.confirm('¿Estás seguro de que quieres eliminar este registro de progreso?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}/progresos/${progresoId}`, {
                method: 'DELETE',
                headers: { 'Authorization': authHeader }
            });

            if (!response.ok) {
                throw new Error('No se pudo eliminar el registro.');
            }

            // Si se elimina correctamente, recargamos la lista
            fetchData();

        } catch (err) {
            // Mostramos el error al usuario
            alert(`Error al eliminar: ${err.message}`);
            console.error("Error al eliminar progreso:", err);
        }
    };


    if (loading && !error) {
        return <p>Cargando historial de progreso...</p>;
    }
    
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

            {error && <p className="error-message">{error}</p>}

            {!loading && !error && (
                 <div className="table-container">
                    <table className="data-table">
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
                                                {/* --- BOTÓN DE ELIMINAR AÑADIDO --- */}
                                                <button className="action-button delete" onClick={() => handleDelete(p.id)}>Eliminar</button>
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
