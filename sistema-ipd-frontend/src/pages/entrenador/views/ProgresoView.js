import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../../components/Modal';
import ProgresoForm from '../../../components/progreso/ProgresoForm';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importamos la función directamente
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
        if (!user?.id || !authHeader) return;
        
        setLoading(true);
        setError(null);
        try {
            const [progresosRes, deportistasRes] = await Promise.all([
                fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}/progresos/todos`, { headers: { 'Authorization': authHeader } }),
                fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}/deportistas`, { headers: { 'Authorization': authHeader } })
            ]);

            if (!progresosRes.ok) throw new Error('No se pudo cargar el historial de progreso.');
            if (!deportistasRes.ok) throw new Error('No se pudieron cargar los deportistas.');

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

    const handleExportCSV = () => {
        if (progresos.length === 0) {
            alert("No hay datos de progreso para exportar.");
            return;
        }

        const dataToExport = progresos.map(p => ({
            'Fecha Registro': new Date(p.fechaRegistro + 'T00:00:00').toLocaleDateString('es-ES'),
            'Deportista': p.deportistaNombreCompleto,
            'Métrica': p.tipoMebrica,
            'Valor': p.valor,
            'Observaciones': p.observaciones || 'N/A'
        }));

        const csv = Papa.unparse(dataToExport);
        const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `historial_progreso_general.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        if (progresos.length === 0) {
            alert("No hay datos para exportar a PDF.");
            return;
        }

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Reporte de Historial de Progreso", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generado por: ${user.nombres} ${user.apellidos}`, 14, 30);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 14, 36);

        const tableColumn = ["Fecha", "Deportista", "Métrica", "Valor", "Observaciones"];
        const tableRows = [];

        progresos.forEach(p => {
            const progresoData = [
                new Date(p.fechaRegistro + 'T00:00:00').toLocaleDateString('es-ES'),
                p.deportistaNombreCompleto,
                p.tipoMebrica,
                p.valor,
                p.observaciones || 'N/A'
            ];
            tableRows.push(progresoData);
        });

        // --- LLAMADA CORREGIDA A LA FUNCIÓN ---
        // Se llama a autoTable como una función externa, pasándole el documento 'doc'.
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            theme: 'striped',
            headStyles: { fillColor: [44, 62, 80] }
        });

        doc.save(`reporte_progreso_${user.apellidos}.pdf`);
    };

    const handleOpenModal = (progreso = null) => { setEditingProgreso(progreso); setIsModalOpen(true); };
    const handleProgresoSaved = () => { setIsModalOpen(false); setEditingProgreso(null); fetchData(); };
    const handleDelete = async (progresoId) => {
        if (!window.confirm('¿Estás seguro?')) return;
        try {
            await fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}/progresos/${progresoId}`, { method: 'DELETE', headers: { 'Authorization': authHeader }});
            fetchData();
        } catch (err) { alert(`Error: ${err.message}`); }
    };

    if (loading && !error) return <p>Cargando historial de progreso...</p>;
    
    return (
        <div className="view-container">
            <header className="view-header">
                <h1>Historial de Progreso</h1>
                <div className="view-actions">
                    <button onClick={handleExportPDF} className="action-button-view secondary" style={{backgroundColor: '#c0392b'}}>
                        Exportar a PDF
                    </button>
                    <button onClick={handleExportCSV} className="action-button-view secondary">
                        Exportar a CSV
                    </button>
                    <button className="action-button-view primary" onClick={() => handleOpenModal()}>
                        + Registrar Progreso
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
