import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './TableStyles.css'; // Reutilizamos los estilos

const TorneoPortal = () => {
    const [torneos, setTorneos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { authHeader } = useAuth();

    useEffect(() => {
        if (!authHeader) {
            setIsLoading(false);
            return;
        }
        fetch('http://localhost:8081/api/v1/torneos', { headers: { 'Authorization': authHeader } })
            .then(res => {
                if (!res.ok) throw new Error('No se pudieron obtener los datos de los torneos');
                return res.json();
            })
            .then(data => {
                setTorneos(data);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setIsLoading(false);
            });
    }, [authHeader]);

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este torneo?')) {
            fetch(`http://localhost:8081/api/v1/torneos/${id}`, { 
                method: 'DELETE', 
                headers: { 'Authorization': authHeader } 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el torneo');
                }
                setTorneos(torneos.filter(t => t.id !== id));
                alert('Torneo eliminado con éxito.');
            })
            .catch(err => {
                alert('Error al eliminar: ' + err.message);
            });
        }
    };

    if (isLoading) return <p>Cargando torneos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="table-portal-container">
            <h1>Portal de Gestión de Torneos</h1>
            <Link to="/dashboard/torneos/nuevo" className="add-button">
                + Agregar Nuevo Torneo
            </Link>
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Nombre del Torneo</th>
                        <th>Lugar</th>
                        <th>Fecha de Inicio</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {torneos.length > 0 ? (
                        torneos.map(torneo => (
                            <tr key={torneo.id}>
                                <td>{torneo.nombre}</td>
                                <td>{torneo.lugar}</td>
                                <td>{torneo.fechaInicio}</td>
                                <td>{torneo.categoria}</td>
                                <td className="actions-cell">
                                    <Link to={`/dashboard/torneos/ver/${torneo.id}`} className="action-button view">Ver</Link>
                                    <Link to={`/dashboard/torneos/editar/${torneo.id}`} className="action-button edit">Editar</Link>
                                    <button onClick={() => handleDelete(torneo.id)} className="action-button delete">Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay torneos registrados.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TorneoPortal;