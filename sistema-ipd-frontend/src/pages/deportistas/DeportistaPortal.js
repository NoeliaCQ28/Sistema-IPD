import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './TableStyles.css';

const DeportistaPortal = () => {
    const [deportistas, setDeportistas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { authHeader } = useAuth();

    useEffect(() => {
        if (!authHeader) {
            setIsLoading(false);
            return;
        }

        fetch('http://localhost:8081/api/v1/deportistas', {
            headers: {
                'Authorization': authHeader,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron obtener los datos de los deportistas');
            }
            return response.json();
        })
        .then(data => {
            setDeportistas(data);
            setIsLoading(false);
        })
        .catch(error => {
            setError(error.message);
            setIsLoading(false);
        });
    }, [authHeader]);

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar a este deportista?')) {
            fetch(`http://localhost:8081/api/v1/deportistas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': authHeader,
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el deportista');
                }
                setDeportistas(deportistas.filter(d => d.id !== id));
                alert('Deportista eliminado con éxito.');
            })
            .catch(err => {
                setError(err.message);
                alert('Error al eliminar: ' + err.message);
            });
        }
    };

    if (isLoading) return <p>Cargando deportistas...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="table-portal-container">
            <h1>Portal de Gestión de Deportistas</h1>
            <Link to="/dashboard/deportistas/nuevo" className="add-button">
                + Agregar Nuevo Deportista
            </Link>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>DNI</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {deportistas.length > 0 ? (
                        deportistas.map(deportista => (
                            <tr key={deportista.id}>
                                <td>{deportista.nombres}</td>
                                <td>{deportista.apellidos}</td>
                                <td>{deportista.dni}</td>
                                <td>{deportista.correo}</td>
                                <td className="actions-cell">
                                    <Link to={`/dashboard/deportistas/ver/${deportista.id}`} className="action-button view">
                                        Ver
                                    </Link>
                                    <Link to={`/dashboard/deportistas/editar/${deportista.id}`} className="action-button edit">
                                        Editar
                                    </Link>
                                    <button onClick={() => handleDelete(deportista.id)} className="action-button delete">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay deportistas registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DeportistaPortal;