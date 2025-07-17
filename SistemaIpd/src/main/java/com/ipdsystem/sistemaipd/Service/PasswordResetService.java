package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Entity.Administrador;
import com.ipdsystem.sistemaipd.Entity.Deportista;
import com.ipdsystem.sistemaipd.Entity.Entrenador;
import com.ipdsystem.sistemaipd.Entity.PasswordResetToken;
import com.ipdsystem.sistemaipd.Repository.AdministradorRepository;
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.EntrenadorRepository;
import com.ipdsystem.sistemaipd.Repository.PasswordResetTokenRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PasswordResetService {

    @Autowired
    private AdministradorRepository administradorRepository;
    @Autowired
    private EntrenadorRepository entrenadorRepository;
    @Autowired
    private DeportistaRepository deportistaRepository;
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Crea un token de reseteo para un usuario basado en su email.
     * Busca en todos los repositorios de usuarios.
     * @param email El correo del usuario.
     */
    public void createPasswordResetTokenForUser(String email) {
        UserDetails user = findUserByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("No se encontró usuario con el correo: " + email));

        String token = UUID.randomUUID().toString();
        PasswordResetToken myToken;

        if (user instanceof Administrador) {
            myToken = new PasswordResetToken(token, (Administrador) user);
        } else if (user instanceof Entrenador) {
            myToken = new PasswordResetToken(token, (Entrenador) user);
        } else if (user instanceof Deportista) {
            myToken = new PasswordResetToken(token, (Deportista) user);
        } else {
            throw new IllegalStateException("Tipo de usuario no soportado para reseteo de contraseña.");
        }

        tokenRepository.save(myToken);

        // Imprimimos el enlace en la consola para desarrollo
        System.out.println("--- ENLACE PARA RESTABLECER CONTRASEÑA ---");
        System.out.println("Para el usuario: " + email);
        System.out.println("http://localhost:3000/reset-password?token=" + token);
        System.out.println("-------------------------------------------");
    }

    /**
     * Valida un token de reseteo.
     * @param token El token a validar.
     * @return El token si es válido y no ha expirado.
     * @throws IllegalStateException si el token no es válido o ha expirado.
     */
    public PasswordResetToken validatePasswordResetToken(String token) {
        PasswordResetToken passToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalStateException("Token inválido."));

        if (passToken.isExpired()) {
            throw new IllegalStateException("El token ha expirado.");
        }

        return passToken;
    }

    /**
     * Cambia la contraseña del usuario asociado al token.
     * @param token El token de reseteo.
     * @param newPassword La nueva contraseña en texto plano.
     */
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken passToken = validatePasswordResetToken(token); // Re-valida el token
        String hashedPassword = passwordEncoder.encode(newPassword);

        // Actualiza la contraseña según el tipo de usuario
        if (passToken.getAdministrador() != null) {
            Administrador user = passToken.getAdministrador();
            user.setPassword(hashedPassword);
            administradorRepository.save(user);
        } else if (passToken.getEntrenador() != null) {
            Entrenador user = passToken.getEntrenador();
            user.setPassword(hashedPassword);
            entrenadorRepository.save(user);
        } else if (passToken.getDeportista() != null) {
            Deportista user = passToken.getDeportista();
            user.setPassword(hashedPassword);
            deportistaRepository.save(user);
        }

        // Elimina el token después de usarlo
        tokenRepository.delete(passToken);
    }

    /**
     * Busca un usuario en los tres repositorios por su correo.
     * @param email El correo del usuario.
     * @return Un Optional que puede contener un UserDetails.
     */
    private Optional<UserDetails> findUserByEmail(String email) {
        return administradorRepository.findByCorreo(email)
                .<UserDetails>map(admin -> admin)
                .or(() -> entrenadorRepository.findByCorreo(email).map(entrenador -> entrenador))
                .or(() -> deportistaRepository.findByCorreo(email).map(deportista -> deportista));
    }
}