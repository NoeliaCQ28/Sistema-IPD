package com.ipdsystem.sistemaipd.Exception;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // MÉTODO NUEVO PARA MANEJAR ERRORES DE DUPLICADOS EN LA BD
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        String errorMessage = "Error de integridad de datos. Verifique que los valores únicos (como DNI o correo) no estén ya registrados.";

        // Podemos intentar dar un mensaje más específico
        if (ex.getMostSpecificCause().getMessage().contains("Duplicate entry")) {
            errorMessage = "El DNI o el correo electrónico ya se encuentra registrado en el sistema.";
        }

        Map<String, String> errorResponse = Map.of(
                "message", errorMessage,
                "error", "Conflict"
        );

        // Devolvemos un error 409 Conflict, que es más apropiado que un 500
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    // Tu método existente para manejar otras excepciones globales
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGlobalException(Exception ex) {
        Map<String, String> errorResponse = Map.of(
                "message", "Ocurrió un error inesperado. Por favor, contacte al soporte.",
                "error", "Internal Server Error"
        );
        // Devolvemos un 500 Internal Server Error para cualquier otro caso
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}