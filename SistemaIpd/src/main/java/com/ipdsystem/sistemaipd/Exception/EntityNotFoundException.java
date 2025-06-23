package com.ipdsystem.sistemaipd.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// ¡IMPORTANTE! Debe extender RuntimeException o Exception
@ResponseStatus(HttpStatus.NOT_FOUND) // Opcional: para que Spring devuelva un 404 automáticamente
public class EntityNotFoundException extends RuntimeException { // <<<--- ¡Asegúrate de que extienda RuntimeException!

    public EntityNotFoundException(String message) {
        super(message);
    }

    public EntityNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}