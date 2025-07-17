package com.ipdsystem.sistemaipd.Controller;

import com.ipdsystem.sistemaipd.Dto.PasswordResetRequestDTO;
import com.ipdsystem.sistemaipd.Service.PasswordResetService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/password")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    /**
     * Endpoint para solicitar el reseteo de contraseña.
     * @param email El correo del usuario.
     * @return Una respuesta con un mensaje de éxito o error.
     */
    @PostMapping("/forgot")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            passwordResetService.createPasswordResetTokenForUser(email);
            return ResponseEntity.ok(Map.of("message", "Se ha enviado el enlace de reseteo. Revisa la consola."));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Ocurrió un error inesperado."));
        }
    }

    /**
     * Endpoint para validar si un token es válido.
     * @param token El token a validar.
     * @return Una respuesta OK si es válido, o un error si no lo es.
     */
    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        try {
            passwordResetService.validatePasswordResetToken(token);
            return ResponseEntity.ok(Map.of("message", "Token válido."));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Endpoint para cambiar la contraseña usando el token.
     * @param requestDTO Contiene el token y la nueva contraseña.
     * @return Una respuesta con un mensaje de éxito o error.
     */
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequestDTO requestDTO) {
        try {
            passwordResetService.resetPassword(requestDTO.getToken(), requestDTO.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada con éxito."));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Ocurrió un error inesperado al cambiar la contraseña."));
        }
    }
}