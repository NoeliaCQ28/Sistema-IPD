package com.ipdsystem.sistemaipd.Repository;

import com.ipdsystem.sistemaipd.Entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    /**
     * Busca un token de reseteo por su valor único.
     * Usamos Optional para manejar de forma segura el caso de que el token no exista.
     * @param token El token a buscar.
     * @return Un Optional que contendrá el token si se encuentra.
     */
    Optional<PasswordResetToken> findByToken(String token);
}