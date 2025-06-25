import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Papa from 'papaparse'; // <-- NUEVA IMPORTACIÓN
import './AsistenciaHistorial.css';

const AsistenciaHistorial = () => {
    const { deportistaId } = useParams();
    const navigate = useNavigate();
    const { authHeader, user } = useAuth();

    const [historial, setHistorial] = useState([]);
    const [deportistaNombre, setDeportistaNombre] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistorial = async () => {
            if (!deportistaId || !authHeader) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const deportistaRes = await fetch(`http://localhost:8081/api/v1/deportistas/${deportistaId}`, { headers: { 'Authorization': authHeader } });
                if (deportistaRes.ok) {
                    const deportistaData = await deportistaRes.json();
                    setDeportistaNombre(`${deportistaData.nombres} ${deportistaData.apellidos}`);
                }

                const response = await fetch(`http://localhost:8081/api/v1/asistencias/deportista/${deportistaId}`, {
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
        };

        fetchHistorial();
    }, [deportistaId, authHeader]);
    
    // --- NUEVA FUNCIÓN PARA EXPORTAR ---
    const handleExportCSV = () => {
        if (historial.length === 0) {
            alert("No hay datos para exportar.");
            return;
        }

        // Preparamos los datos para el CSV
        const dataToExport = historial.map(registro => ({
            Fecha: new Date(registro.fecha + 'T00:00:00').toLocaleDateString('es-ES'),
            Deportista: deportistaNombre,
            Estado: registro.estado,
            'Registrado Por': registro.entrenadorNombreCompleto
        }));

        // Usamos Papaparse para convertir el JSON a CSV
        const csv = Papa.unparse(dataToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        
        // Creamos un enlace temporal para descargar el archivo
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `historial_asistencia_${deportistaNombre.replace(' ', '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // --- FIN DE LA NUEVA FUNCIÓN ---

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
                <button onClick={handleExportCSV} className="export-button">
                    Exportar a CSV
                </button>
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
