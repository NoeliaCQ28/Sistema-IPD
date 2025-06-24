import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importar Link
import './TableStyles.css';

const DeportistaList = () => {
    const [deportistas, setDeportistas] = useState([]);

    useEffect(() => {
        // Este endpoint es público según nuestra configuración de seguridad
        fetch('http://localhost:8081/api/v1/deportistas')
        .then(response => response.json())
        .then(data => setDeportistas(data))
        .catch(error => console.error("Error al obtener deportistas:", error));
    }, []);

    return (
        <div className="table-container">
            <h2>Lista de Deportistas</h2>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>DNI</th>
                        <th>Disciplina</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {deportistas.map(deportista => (
                        <tr key={deportista.id}>
                            <td>{deportista.id}</td>
                            <td>{deportista.nombres}</td>
                            <td>{deportista.apellidos}</td>
                            <td>{deportista.dni}</td>
                            <td>{deportista.disciplina}</td>
                            <td>{deportista.correo}</td>
                            <td className="action-buttons">
                                <Link to={`/dashboard/deportistas/editar/${deportista.id}`} className="btn-edit">
                                    Editar
                                </Link>
                                <button className="btn-delete">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeportistaList;