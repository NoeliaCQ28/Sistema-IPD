import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Select from 'react-select';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './AnalisisProgresoView.css';

// Registrar los componentes de Chart.js que vamos a usar
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalisisProgresoView = () => {
    const { user, authHeader } = useAuth();

    // Estados para los filtros
    const [deportistasDisponibles, setDeportistasDisponibles] = useState([]);
    const [selectedDeportistas, setSelectedDeportistas] = useState([]);
    const [selectedMetrica, setSelectedMetrica] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    // Estados para el gráfico y la UI
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Opciones de métricas (se podrían cargar desde el backend en el futuro)
    const metricasDisponibles = [
        { value: 'Peso Levantado (kg)', label: 'Peso Levantado (kg)' },
        { value: 'Tiempo Carrera (min)', label: 'Tiempo Carrera (min)' },
        { value: 'Distancia Salto (m)', label: 'Distancia Salto (m)' },
        { value: 'Repeticiones', label: 'Repeticiones' },
        { value: 'Calorías Quemadas', label: 'Calorías Quemadas' },
    ];

    // Cargar los deportistas del entrenador al montar el componente
    useEffect(() => {
        const fetchDeportistas = async () => {
            if (!user?.id || !authHeader) return;
            try {
                const response = await fetch(`http://localhost:8081/api/v1/entrenadores/${user.id}/deportistas`, {
                    headers: { 'Authorization': authHeader }
                });
                if (!response.ok) throw new Error('No se pudieron cargar los deportistas.');
                const data = await response.json();
                setDeportistasDisponibles(data.map(d => ({ value: d.id, label: d.nombreCompleto })));
            } catch (err) {
                setError(err.message);
            }
        };
        fetchDeportistas();
    }, [user?.id, authHeader]);
    
    const generarColorAleatorio = () => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 0.8)`;
    };

    const handleGenerarGrafico = async () => {
        setError('');
        if (selectedDeportistas.length === 0 || !selectedMetrica || !fechaInicio || !fechaFin) {
            setError('Por favor, complete todos los filtros para generar el gráfico.');
            return;
        }

        setLoading(true);
        setChartData(null);

        const deportistaIds = selectedDeportistas.map(d => d.value).join(',');
        const params = new URLSearchParams({
            deportistaIds,
            tipoMebrica: selectedMetrica.value,
            fechaInicio,
            fechaFin,
        });

        try {
            const response = await fetch(`http://localhost:8081/api/v1/analisis/progreso?${params.toString()}`, {
                headers: { 'Authorization': authHeader },
            });

            if (!response.ok) {
                throw new Error('No se pudieron obtener los datos para el gráfico.');
            }

            const data = await response.json();
            
            if (Object.keys(data).length === 0) {
                setError('No se encontraron datos de progreso para los filtros seleccionados.');
                setChartData(null);
                return;
            }

            const labels = [...new Set(Object.values(data).flat().map(p => p.fecha))].sort();

            const datasets = Object.entries(data).map(([nombre, progresos]) => {
                const color = generarColorAleatorio();
                return {
                    label: nombre,
                    data: labels.map(label => {
                        const punto = progresos.find(p => p.fecha === label);
                        return punto ? punto.valor : null; // null crea un hueco en el gráfico
                    }),
                    borderColor: color,
                    backgroundColor: color.replace('0.8', '0.5'),
                    fill: false,
                    tension: 0.1,
                    spanGaps: true // Conecta puntos aunque haya nulos entre ellos
                };
            });
            
            setChartData({ labels, datasets });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-container">
            <header className="view-header">
                <h1>Análisis de Progreso</h1>
            </header>

            <div className="analisis-filtros">
                <div className="filtro-item">
                    <label>Deportistas</label>
                    <Select
                        isMulti
                        options={deportistasDisponibles}
                        value={selectedDeportistas}
                        onChange={setSelectedDeportistas}
                        placeholder="Seleccione uno o más..."
                    />
                </div>
                <div className="filtro-item">
                    <label>Métrica</label>
                    <Select
                        options={metricasDisponibles}
                        value={selectedMetrica}
                        onChange={setSelectedMetrica}
                        placeholder="Seleccione una métrica..."
                    />
                </div>
                <div className="filtro-item">
                    <label>Fecha Inicio</label>
                    <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                </div>
                <div className="filtro-item">
                    <label>Fecha Fin</label>
                    <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                </div>
                <div className="filtro-item-button">
                     <button onClick={handleGenerarGrafico} disabled={loading} className="action-button-view primary">
                        {loading ? 'Generando...' : 'Generar Gráfico'}
                    </button>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}
            
            <div className="grafico-container">
                {chartData ? (
                    <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: `Evolución de ${selectedMetrica.label}` } } }} />
                ) : (
                    !loading && <p className="grafico-placeholder">Seleccione los filtros y genere un gráfico para ver los datos.</p>
                )}
            </div>
        </div>
    );
};

export default AnalisisProgresoView;
