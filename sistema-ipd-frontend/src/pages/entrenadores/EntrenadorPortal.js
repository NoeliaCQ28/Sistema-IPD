import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './TableStyles.css'; // Reutilizamos los estilos de tabla

const EntrenadorPortal = () => {
    const [entrenadores, setEntrenadores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { authHeader } = useAuth();

    useEffect(() => {
        if (!authHeader) {
            setIsLoading(false);
            return;
        }

        fetch('http://localhost:8081/api/v1/entrenadores', {
            headers: { 'Authorization': authHeader },
        })
        .then(response => {
            if (!response.ok) throw new Error('No se pudieron obtener los datos de los entrenadores');
            return response.json();
        })
        .then(data => {
            setEntrenadores(data);
            setIsLoading(false);
        })
        .catch(error => {
            setError(error.message);
            setIsLoading(false);
        });
    }, [authHeader]);

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar a este entrenador?')) {
            fetch(`http://localhost:8081/api/v1/entrenadores/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': authHeader },
            })
            .then(response => {
                if (!response.ok) throw new Error('Error al eliminar el entrenador');
                setEntrenadores(entrenadores.filter(e => e.id !== id));
                alert('Entrenador eliminado con éxito.');
            })
            .catch(err => {
                alert('Error al eliminar: ' + err.message);
            });
        }
    };

    if (isLoading) return <p>Cargando entrenadores...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="table-portal-container">
            <h1>Portal de Gestión de Entrenadores</h1>
            <Link to="/dashboard/entrenadores/nuevo" className="add-button">
                + Agregar Nuevo Entrenador
            </Link>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>DNI</th>
                        <th>Correo</th>
                        <th>Disciplina</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {entrenadores.length > 0 ? (
                        entrenadores.map(entrenador => (
                            <tr key={entrenador.id}>
                                <td>{entrenador.nombres}</td>
                                <td>{entrenador.apellidos}</td>
                                <td>{entrenador.dni}</td>
                                <td>{entrenador.correo}</td>
                                <td>{entrenador.disciplinaQueEntrena}</td>
                                <td className="actions-cell">
                                    <Link to={`/dashboard/entrenadores/ver/${entrenador.id}`} className="action-button view">Ver</Link>
                                    <Link to={`/dashboard/entrenadores/editar/${entrenador.id}`} className="action-button edit">Editar</Link>
                                    <button onClick={() => handleDelete(entrenador.id)} className="action-button delete">Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No hay entrenadores registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EntrenadorPortal;