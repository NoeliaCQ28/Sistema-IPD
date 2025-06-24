import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './FormStyles.css'; // Asumo que este CSS existe y tiene los estilos de formulario

const DeportistaForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authHeader } = useAuth();
    
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        dni: '',
        fechaNacimiento: '', // Formato YYYY-MM-DD para input type="date"
        correo: '',
        telefono: '',
        disciplina: '',
        peso: '',
        entrenadorId: '' // Mantener como string inicialmente para el select
    });

    const [entrenadores, setEntrenadores] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(''); // Estado para mensajes de error del formulario

    // Cargar la lista de entrenadores
    useEffect(() => {
        if (authHeader) {
            fetch('http://localhost:8081/api/v1/entrenadores', {
                headers: { 'Authorization': authHeader }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status} al cargar entrenadores`);
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setEntrenadores(data);
                } else {
                    console.error("Error: La API de entrenadores no devolvió un array.", data);
                    setEntrenadores([]);
                }
            })
            .catch(err => {
                setError('No se pudieron cargar los entrenadores: ' + err.message);
                console.error("Error cargando entrenadores:", err);
            });
        }
    }, [authHeader]);

    // Cargar datos del deportista si estamos en modo edición, o inicializar para nuevo registro
    useEffect(() => {
        // Limpiar errores y datos al cargar el componente o cambiar de modo
        setError(''); // <<<--- Limpiar el error aquí
        if (!isEditing) {
            // Si NO estamos editando, reinicia el formulario a un estado limpio
            setFormData({
                nombres: '',
                apellidos: '',
                dni: '',
                fechaNacimiento: '',
                correo: '',
                telefono: '',
                disciplina: '',
                peso: '',
                entrenadorId: ''
            });
            return; // Salir, no hay datos para cargar en modo nuevo
        }

        // Si estamos en modo edición, cargar los datos
        if (isEditing && authHeader) {
            setIsLoading(true);
            fetch(`http://localhost:8081/api/v1/deportistas/${id}`, {
                headers: { 'Authorization': authHeader }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.fechaNacimiento) {
                    data.fechaNacimiento = data.fechaNacimiento.split('T')[0];
                } else {
                    data.fechaNacimiento = '';
                }

                data.peso = data.peso !== null && data.peso !== undefined ? String(data.peso) : '';

                const deportistaData = {
                    ...data,
                    entrenadorId: data.entrenador ? String(data.entrenador.id) : ''
                };
                setFormData(deportistaData);
                setIsLoading(false);
            })
            .catch(err => {
                setError('No se pudieron cargar los datos del deportista: ' + err.message);
                setIsLoading(false);
                console.error("Error cargando datos para editar:", err);
            });
        }
    }, [id, isEditing, authHeader]); // Dependencias: id (para cambios de deportista), isEditing (para cambiar modo), authHeader

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Siempre limpia el error al intentar guardar de nuevo
        setIsLoading(true);

        const url = isEditing 
            ? `http://localhost:8081/api/v1/deportistas/${id}` 
            : 'http://localhost:8081/api/v1/deportistas';
        const method = isEditing ? 'PUT' : 'POST';
        const dataToSend = {
            ...formData,
            peso: formData.peso ? parseFloat(formData.peso) : null,
            entrenadorId: formData.entrenadorId ? parseInt(formData.entrenadorId, 10) : null,
        };

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
            body: JSON.stringify(dataToSend),
        })
        .then(response => {
            if (!response.ok) {
                // Si la respuesta no es OK, lee el error del body
                return response.text().then(text => { 
                    try {
                        const errorJson = JSON.parse(text);
                        // Intenta parsear el JSON de error para obtener un mensaje más específico
                        throw new Error(errorJson.message || `Error ${response.status}: ${errorJson.error || 'al guardar'}`);
                    } catch (parseError) {
                        // Si no se puede parsear como JSON, usa el texto crudo
                        throw new Error(text || `Error al guardar: ${response.status}`);
                    }
                });
            }
            return response.json();
        })
        .then(() => {
            alert(`Deportista ${isEditing ? 'actualizado' : 'creado'} con éxito!`);
            navigate('/dashboard/deportistas'); // Redirige a la lista de deportistas
        })
        .catch(err => {
            setError(err.message); // Muestra el mensaje de error del backend
            console.error("Error al guardar deportista:", err);
        })
        .finally(() => setIsLoading(false));
    };

    if (isLoading && isEditing) return <p>Cargando formulario...</p>;

    return (
        <div className="form-container">
            <h2>{isEditing ? 'Editar Deportista' : 'Agregar Nuevo Deportista'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombres</label>
                    <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Apellidos</label>
                    <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Disciplina</label>
                    <input type="text" name="disciplina" value={formData.disciplina} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>DNI</label>
                    <input type="text" name="dni" value={formData.dni} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Fecha de Nacimiento</label>
                    <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" name="correo" value={formData.correo} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Teléfono</label>
                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Peso (kg)</label>
                    <input type="number" step="0.1" name="peso" value={formData.peso} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Entrenador Asignado</label>
                    <select name="entrenadorId" value={formData.entrenadorId} onChange={handleChange} required>
                        <option value="">-- Seleccione un entrenador --</option>
                        {Array.isArray(entrenadores) && entrenadores.map(entrenador => (
                            <option key={entrenador.id} value={entrenador.id}>
                                {entrenador.nombres} {entrenador.apellidos}
                            </option>
                        ))}
                    </select>
                </div>
                
                {error && <p className="error-message">{error}</p>}
                
                <div className="form-buttons">
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard/deportistas')} className="cancel-button">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DeportistaForm;