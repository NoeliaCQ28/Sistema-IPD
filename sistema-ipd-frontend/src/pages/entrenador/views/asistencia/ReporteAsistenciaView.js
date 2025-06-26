import React, { useState } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- NUEVAS IMPORTACIONES PARA REGISTRAR COMPONENTES DE CHART.JS ---
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import './ReporteAsistenciaView.css';
import '../Views.css'; 

// --- REGISTRO DE COMPONENTES ---
// Esto le dice a Chart.js qué elementos debe saber cómo dibujar.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReporteAsistenciaView = () => {
    const { user, authHeader } = useAuth();
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [reporteData, setReporteData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerarReporte = async () => {
        if (!fechaInicio || !fechaFin) {
            setError('Por favor, seleccione una fecha de inicio y una fecha de fin.');
            return;
        }
        setError('');
        setLoading(true);
        setReporteData([]);

        try {
            const params = new URLSearchParams({ fechaInicio, fechaFin });
            const response = await fetch(`http://localhost:8081/api/v1/analisis/asistencia/reporte?${params.toString()}`, {
                headers: { 'Authorization': authHeader }
            });
            if (!response.ok) throw new Error('No se pudo generar el reporte.');
            const data = await response.json();
            setReporteData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: reporteData.map(d => d.deportistaNombre),
        datasets: [
            {
                label: '% de Asistencia',
                data: reporteData.map(d => d.porcentajeAsistencia),
                backgroundColor: 'rgba(0, 123, 255, 0.6)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Porcentaje (%)'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
        maintainAspectRatio: false // Añadido para mejor responsividad
    };

    const handleExportCSV = () => {
        if (reporteData.length === 0) return;
        const dataToExport = reporteData.map(d => ({
            'Deportista': d.deportistaNombre,
            'Presente': d.totalPresente,
            'Ausente': d.totalAusente,
            'Justificado': d.totalJustificado,
            'Total Registros': d.totalRegistros,
            '% Asistencia': d.porcentajeAsistencia,
        }));
        const csv = Papa.unparse(dataToExport);
        const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "reporte_asistencia.csv";
        link.click();
    };

    const handleExportPDF = () => {
        if (reporteData.length === 0) return;
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text("Reporte de Asistencia", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Periodo: ${fechaInicio} al ${fechaFin}`, 14, 30);

        autoTable(doc, {
            head: [['Deportista', 'Presente', 'Ausente', 'Justificado', 'Total', '% Asistencia']],
            body: reporteData.map(d => [d.deportistaNombre, d.totalPresente, d.totalAusente, d.totalJustificado, d.totalRegistros, `${d.porcentajeAsistencia}%`]),
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [44, 62, 80] }
        });
        doc.save('reporte_asistencia.pdf');
    };

    return (
        <div>
            <div className="report-filters">
                <div className="filtro-item">
                    <label>Fecha Inicio</label>
                    <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                </div>
                <div className="filtro-item">
                    <label>Fecha Fin</label>
                    <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                </div>
                <div className="filtro-item-button">
                    <button onClick={handleGenerarReporte} disabled={loading} className="action-button-view primary">
                        {loading ? 'Generando...' : 'Generar Reporte'}
                    </button>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            
            {loading && <p>Generando reporte...</p>}

            {!loading && reporteData.length > 0 && (
                <div className="report-content">
                    <div className="view-actions report-export-buttons">
                        <button onClick={handleExportPDF} className="action-button-view secondary" style={{backgroundColor: '#c0392b'}}>Exportar PDF</button>
                        <button onClick={handleExportCSV} className="action-button-view secondary">Exportar CSV</button>
                    </div>

                    <div className="report-grid">
                        <div className="report-table-container">
                             <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Deportista</th>
                                        <th>Presente</th>
                                        <th>Ausente</th>
                                        <th>Justificado</th>
                                        <th>% Asistencia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reporteData.map(d => (
                                        <tr key={d.deportistaId}>
                                            <td>{d.deportistaNombre}</td>
                                            <td>{d.totalPresente}</td>
                                            <td>{d.totalAusente}</td>
                                            <td>{d.totalJustificado}</td>
                                            <td>{d.porcentajeAsistencia}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="report-chart-container">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReporteAsistenciaView;