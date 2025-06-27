import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authHeader, setAuthHeader] = useState(() => localStorage.getItem('authHeader'));
    const [loading, setLoading] = useState(true); // Estado para la carga inicial
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    const logout = useCallback(() => {
        setUser(null);
        setAuthHeader(null);
        setLoading(false);
        localStorage.removeItem('authHeader');
        setUnreadMessagesCount(0);
    }, []);

    // Función para revalidar la sesión del usuario desde el servidor.
    // useCallback asegura que la función no se recree innecesariamente.
    const revalidateSession = useCallback(async (currentAuthHeader) => {
        const header = currentAuthHeader || authHeader;
        if (!header) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/api/v1/auth/me', {
                headers: { 'Authorization': header }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                throw new Error("Sesión inválida");
            }
        } catch (err) {
            console.error("Error de revalidación, cerrando sesión.", err);
            logout();
        } finally {
            // Se asegura de que el estado de carga termine, incluso si hay un error.
            setLoading(false);
        }
    }, [authHeader, logout]);

    // Efecto para la validación inicial de la sesión al cargar la app.
    useEffect(() => {
        const storedAuthHeader = localStorage.getItem('authHeader');
        if (storedAuthHeader) {
            revalidateSession(storedAuthHeader);
        } else {
            setLoading(false); // No hay sesión guardada, terminamos la carga.
        }
    }, [revalidateSession]);

    // Efecto para obtener el conteo de mensajes no leídos periódicamente.
    useEffect(() => {
        let intervalId;

        const fetchUnreadMessagesCount = async () => {
            if (user && authHeader && (user.rol === "DEPORTISTA" || user.rol === "ENTRENADOR")) {
                try {
                    const response = await fetch(`http://localhost:8081/api/v1/mensajes/no-leidos/conteo`, {
                        headers: { 'Authorization': authHeader }
                    });
                    if (response.ok) {
                        const count = await response.json();
                        setUnreadMessagesCount(count);
                    }
                } catch (err) {
                    console.error("Error de red al obtener conteo de mensajes no leídos:", err);
                }
            } else {
                setUnreadMessagesCount(0);
            }
        };

        if (user) {
            fetchUnreadMessagesCount(); // Llama una vez al cargar
            intervalId = setInterval(fetchUnreadMessagesCount, 15000); // Y luego cada 15 segundos
        }

        return () => {
            if (intervalId) clearInterval(intervalId); // Limpia el intervalo al desmontar
        };
    }, [user, authHeader]);


    const login = async (email, password) => {
        const credentials = btoa(`${email}:${password}`);
        const header = `Basic ${credentials}`;
        setLoading(true);

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
        } finally {
            setLoading(false);
        }
    };

    // El valor del contexto ahora incluye `loading` y `revalidateSession`
    const value = { user, authHeader, loading, login, logout, revalidateSession, unreadMessagesCount };

    // No renderizamos los componentes hijos hasta que la validación inicial haya terminado
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
