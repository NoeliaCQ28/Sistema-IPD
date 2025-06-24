import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authHeader, setAuthHeader] = useState(() => localStorage.getItem('authHeader'));
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    const login = async (email, password) => {
        const credentials = btoa(`${email}:${password}`);
        const header = `Basic ${credentials}`;

        try {
            const response = await fetch('http://localhost:8081/api/v1/auth/me', {
                method: 'GET',
                headers: { 'Authorization': header },
            });

            if (response.ok) {
                const userData = await response.json();
                
                setUser(userData);
                setAuthHeader(header);
                localStorage.setItem('authHeader', header);
                
                return { success: true, user: userData };

            } else {
                logout();
                return { success: false, message: 'Credenciales incorrectas' };
            }
        } catch (error) {
            logout();
            return { success: false, message: 'No se pudo conectar al servidor.' };
        }
    };

    const logout = () => {
        setUser(null);
        setAuthHeader(null);
        localStorage.removeItem('authHeader');
        setUnreadMessagesCount(0); // Limpiar el conteo al cerrar sesión
    };

    // Efecto para verificar la sesión al cargar la app y para obtener conteo de mensajes
    useEffect(() => {
        let intervalId;

        const revalidateSession = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/v1/auth/me', {
                    headers: { 'Authorization': authHeader }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    throw new Error("Sesión inválida");
                }
            } catch (err) {
                logout();
            }
        };

        const fetchUnreadMessagesCount = async () => {
            if (user && user.id && user.rol && (user.rol === "DEPORTISTA" || user.rol === "ENTRENADOR")) { 
                try {
                    const response = await fetch(`http://localhost:8081/api/v1/mensajes/no-leidos/conteo`, {
                        headers: { 'Authorization': authHeader }
                    });
                    if (response.ok) {
                        const count = await response.json();
                        setUnreadMessagesCount(count);
                    } else {
                        console.error("Error al obtener conteo de mensajes no leídos:", response.status);
                    }
                } catch (err) {
                    console.error("Error de red al obtener conteo de mensajes no leídos:", err);
                }
            } else {
                setUnreadMessagesCount(0);
            }
        };

        revalidateSession();

        if (user && user.id && (user.rol === "DEPORTISTA" || user.rol === "ENTRENADOR")) {
            fetchUnreadMessagesCount();
            intervalId = setInterval(fetchUnreadMessagesCount, 15000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [authHeader, user]);

    const value = { user, authHeader, login, logout, unreadMessagesCount };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};