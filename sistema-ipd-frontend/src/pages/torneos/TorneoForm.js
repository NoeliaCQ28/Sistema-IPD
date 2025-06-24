import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './FormStyles.css'; // Reutilizamos los estilos

const TorneoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authHeader } = useAuth();
    
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        nombre: '',
        lugar: '',
        fechaInicio: '',
        fechaFin: '',
        categoria: '',
        descripcion: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing && authHeader) {
            setIsLoading(true);
            fetch(`http://localhost:8081/api/v1/torneos/${id}`, {
                headers: { 'Authorization': authHeader }
            })
            .then(res => res.json())
            .then(data => {
                // Aseguramos que las fechas tengan el formato correcto para el input
                if (data.fechaInicio) data.fechaInicio = data.fechaInicio.split('T')[0];
                if (data.fechaFin) data.fechaFin = data.fechaFin.split('T')[0];
                setFormData(data);
                setIsLoading(false);
            })
            .catch(() => {
                setError('No se pudieron cargar los datos del torneo.');
                setIsLoading(false);
            });
        }
    }, [id, isEditing, authHeader]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const url = isEditing ? `http://localhost:8081/api/v1/torneos/${id}` : 'http://localhost:8081/api/v1/torneos';
        const method = isEditing ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text || 'Error al guardar el torneo') });
            }
            return response.json();
        })
        .then(() => {
            alert(`Torneo ${isEditing ? 'actualizado' : 'creado'} con éxito!`);
            navigate('/dashboard/torneos');
        })
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    };

    if (isLoading && isEditing) return <p>Cargando formulario...</p>;

    return (
        <div className="form-container">
            <h2>{isEditing ? 'Editar Torneo' : 'Agregar Nuevo Torneo'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre del Torneo</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Lugar</label>
                    <input type="text" name="lugar" value={formData.lugar} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Fecha de Inicio</label>
                    <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Fecha de Fin</label>
                    <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Categoría</label>
                    <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Descripción</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="4"></textarea>
                </div>
                
                {error && <p className="error-message">{error}</p>}
                
                <div className="form-buttons">
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard/torneos')} className="cancel-button">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TorneoForm;