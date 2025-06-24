import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './FormStyles.css'; // Reutilizamos los estilos de formulario

const EntrenadorForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authHeader } = useAuth();
    
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        dni: '',
        fechaNacimiento: '',
        correo: '',
        telefono: '',
        disciplinaQueEntrena: '',
        profesion: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing && authHeader) {
            setIsLoading(true);
            fetch(`http://localhost:8081/api/v1/entrenadores/${id}`, {
                headers: { 'Authorization': authHeader }
            })
            .then(res => res.json())
            .then(data => {
                if (data.fechaNacimiento) {
                    data.fechaNacimiento = data.fechaNacimiento.split('T')[0];
                }
                setFormData(data);
                setIsLoading(false);
            })
            .catch(() => {
                setError('No se pudieron cargar los datos del entrenador.');
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

        const url = isEditing ? `http://localhost:8081/api/v1/entrenadores/${id}` : 'http://localhost:8081/api/v1/entrenadores';
        const method = isEditing ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text || 'Error al guardar') });
            }
            return response.json();
        })
        .then(() => {
            alert(`Entrenador ${isEditing ? 'actualizado' : 'creado'} con éxito!`);
            navigate('/dashboard/entrenadores');
        })
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    };

    if (isLoading && isEditing) return <p>Cargando formulario...</p>;

    return (
        <div className="form-container">
            <h2>{isEditing ? 'Editar Entrenador' : 'Agregar Nuevo Entrenador'}</h2>
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
                    <label>Disciplina que Entrena</label>
                    <input type="text" name="disciplinaQueEntrena" value={formData.disciplinaQueEntrena} onChange={handleChange} required />
                </div>
                 <div className="form-group">
                    <label>Profesión</label>
                    <input type="text" name="profesion" value={formData.profesion} onChange={handleChange} />
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
                
                {error && <p className="error-message">{error}</p>}
                
                <div className="form-buttons">
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        {isLoading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard/entrenadores')} className="cancel-button">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EntrenadorForm;