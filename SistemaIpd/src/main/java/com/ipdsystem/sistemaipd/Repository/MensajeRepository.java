package com.ipdsystem.sistemaipd.Repository;

import com.ipdsystem.sistemaipd.Entity.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    @Query("SELECT m FROM Mensaje m WHERE " +
            "(m.remitenteId = :user1Id AND m.remitenteRol = :user1Rol AND m.receptorId = :user2Id AND m.receptorRol = :user2Rol) OR " +
            "(m.remitenteId = :user2Id AND m.remitenteRol = :user2Rol AND m.receptorId = :user1Id AND m.receptorRol = :user1Rol) " +
            "ORDER BY m.fechaEnvio ASC")
    List<Mensaje> findConversation(Long user1Id, String user1Rol, Long user2Id, String user2Rol);

    @Query("SELECT m FROM Mensaje m WHERE " +
            "(m.remitenteId = :userId AND m.remitenteRol = :userRol) OR " +
            "(m.receptorId = :userId AND m.receptorRol = :userRol) " +
            "ORDER BY m.fechaEnvio DESC")
    List<Mensaje> findAllMessagesByUserIdAndRol(Long userId, String userRol);

    @Query("SELECT COUNT(m) FROM Mensaje m WHERE " +
            "m.receptorId = :userId AND m.receptorRol = :userRol AND m.leido = false")
    long countUnreadMessagesForUser(Long userId, String userRol);


    // --- MÉTODO ACTUALIZADO (la consulta es la misma, solo se ha movido la interfaz a su propio archivo) ---
    @Query("SELECT m.remitenteId as remitenteId, COUNT(m.id) as count FROM Mensaje m WHERE " +
            "m.receptorId = :userId AND m.receptorRol = :userRol AND m.leido = false " +
            "GROUP BY m.remitenteId")
    List<UnreadMessageCountBySender> countUnreadMessagesBySender(Long userId, String userRol);
}