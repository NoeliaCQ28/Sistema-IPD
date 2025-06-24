import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './FormStyles.css'; // Usaremos tu archivo de estilos para formularios

const DeportistaForm = () => {
    const { id } = useParams(); // Obtiene el 'id' de la URL si estamos editando
    const navigate = useNavigate();
    const { authHeader } = useAuth();

    const isEditing = Boolean(id); // Si hay un id, estamos editando

    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        dni: '',
        fechaNacimiento: '',
        correo: '',
        telefono: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing) {
            // Si estamos editando, buscamos los datos del deportista
            setIsLoading(true);
            fetch(`http://localhost:8081/api/v1/deportistas/${id}`, {
                headers: { 'Authorization': authHeader }
            })
            .then(res => res.json())
            .then(data => {
                setFormData(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError('No se pudieron cargar los datos del deportista.');
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

        const url = isEditing 
            ? `http://localhost:8081/api/v1/deportistas/${id}` 
            : 'http://localhost:8081/api/v1/deportistas';

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
                throw new Error(isEditing ? 'Error al actualizar' : 'Error al crear');
            }
            return response.json();
        })
        .then(() => {
            alert(`Deportista ${isEditing ? 'actualizado' : 'creado'} con éxito!`);
            navigate('/dashboard/deportistas'); // Volvemos a la lista
        })
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    };

    if (isLoading && isEditing) return <p>Cargando formulario...</p>;

    return (
        <div className="form-container">
            <h2>{isEditing ? 'Editar Deportista' : 'Agregar Nuevo Deportista'}</h2>
            <form onSubmit={handleSubmit}>
                {/* Aquí van todos los inputs del formulario */}
                <div className="form-group">
                    <label>Nombres</label>
                    <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Apellidos</label>
                    <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                </div>
                {/* ... Agrega aquí los demás campos: dni, fechaNacimiento, correo, telefono ... */}

                {error && <p className="error-message">{error}</p>}

                <button type="submit" className="submit-button" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" onClick={() => navigate('/dashboard/deportistas')} className="cancel-button">
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default DeportistaForm;