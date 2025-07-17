import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/logo.png'; // <-- IMPORTANTE: Se importa el logo como imagen
import './AsistenciaHistorial.css';

const AsistenciaHistorial = () => {
    const { deportistaId } = useParams();
    const navigate = useNavigate();
    const { authHeader, user } = useAuth();

    const [historial, setHistorial] = useState([]);
    const [deportistaNombre, setDeportistaNombre] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHistorial = useCallback(async () => {
        if (!deportistaId || !authHeader) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const deportistaRes = await fetch(`/api/v1/deportistas/${deportistaId}`, { headers: { 'Authorization': authHeader } });
            if (deportistaRes.ok) {
                const deportistaData = await deportistaRes.json();
                setDeportistaNombre(`${deportistaData.nombres} ${deportistaData.apellidos}`);
            }

            const response = await fetch(`/api/v1/asistencias/deportista/${deportistaId}`, {
                headers: { 'Authorization': authHeader }
            });

            if (!response.ok) throw new Error("No se pudo cargar el historial de asistencias.");

            const data = await response.json();
            setHistorial(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [deportistaId, authHeader]);

    useEffect(() => {
        fetchHistorial();
    }, [fetchHistorial]);

    const handleExportCSV = () => {
        if (historial.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }
        const dataToExport = historial.map(registro => ({
            'Fecha': new Date(registro.fecha + 'T00:00:00').toLocaleDateString('es-ES'),
            'Deportista': deportistaNombre,
            'Estado': registro.estado,
            'Registrado Por': registro.entrenadorNombreCompleto
        }));

        const csv = Papa.unparse(dataToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `historial_asistencia_${deportistaNombre.replace(' ', '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleExportPDF = () => {
        if (historial.length === 0) {
            alert("No hay datos para exportar a PDF.");
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        
        doc.setFillColor(197, 33, 39);
        doc.rect(0, 0, pageWidth, 25, 'F');
        doc.addImage(logo, 'PNG', 14, 5, 30, 15);
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text("Historial de Asistencia", 50, 16);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text(`Deportista: ${deportistaNombre}`, 14, 35);
        doc.text(`Generado por: ${user.nombres} ${user.apellidos}`, 14, 42);
        
        autoTable(doc, {
            head: [['Fecha', 'Estado', 'Registrado Por']],
            body: historial.map(r => [
                new Date(r.fecha + 'T00:00:00').toLocaleDateString('es-ES'),
                r.estado,
                r.entrenadorNombreCompleto
            ]),
            startY: 50,
            theme: 'striped',
            headStyles: { fillColor: [44, 62, 80] }
        });

        doc.save(`historial_asistencia_${deportistaNombre.replace(' ', '_')}.pdf`);
    };
    
    const getBackPath = () => {
        const basePath = user.rol === 'ADMINISTRADOR' ? '/dashboard' : '/portal/entrenador';
        return `${basePath}/deportistas/ver/${deportistaId}`;
    };

    const getStatusClass = (estado) => {
        switch (estado) {
            case 'PRESENTE': return 'presente';
            case 'AUSENTE': return 'ausente';
            case 'JUSTIFICADO': return 'justificado';
            default: return '';
        }
    };

    if (isLoading) return <p>Cargando historial de asistencia...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="historial-container">
            <div className="historial-header">
                <h2>Historial de Asistencia de {deportistaNombre}</h2>
                <div className="export-buttons-group">
                    <button onClick={handleExportPDF} className="export-button pdf">
                        Exportar a PDF
                    </button>
                    <button onClick={handleExportCSV} className="export-button">
                        Exportar a CSV
                    </button>
                </div>
            </div>
            {historial.length > 0 ? (
                <table className="historial-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Registrado por</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historial.map(registro => (
                            <tr key={registro.id}>
                                <td>{new Date(registro.fecha + 'T00:00:00').toLocaleDateString('es-ES')}</td>
                                <td>
                                    <span className={`status-badge ${getStatusClass(registro.estado)}`}>
                                        {registro.estado}
                                    </span>
                                </td>
                                <td>{registro.entrenadorNombreCompleto}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay registros de asistencia para este deportista.</p>
            )}
             <button onClick={() => navigate(getBackPath())} className="back-button">
                Volver a Detalles
            </button>
        </div>
    );
};

export default AsistenciaHistorial;