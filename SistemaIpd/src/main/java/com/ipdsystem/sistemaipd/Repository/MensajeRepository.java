package com.ipdsystem.sistemaipd.Repository;

import com.ipdsystem.sistemaipd.Entity.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

    @Query("SELECT m FROM Mensaje m WHERE " +
            "(m.remitenteId = :user1Id AND m.remitenteRol = :user1Rol AND m.receptorId = :user2Id AND m.receptorRol = :user2Rol) OR " +
            "(m.remitenteId = :user2Id AND m.remitenteRol = :user2Rol AND m.receptorId = :user1Id AND m.receptorRol = :user1Rol) " +
            "ORDER BY m.fechaEnvio ASC")
    List<Mensaje> findConversation(@Param("user1Id") Long user1Id, @Param("user1Rol") String user1Rol,
                                   @Param("user2Id") Long user2Id, @Param("user2Rol") String user2Rol);

    @Query("SELECT COUNT(m) FROM Mensaje m WHERE m.receptorId = :userId AND m.receptorRol = :userRol AND m.leido = false")
    long countUnreadMessagesForUser(@Param("userId") Long userId, @Param("userRol") String userRol);

    @Query("SELECT m.remitenteId as remitenteId, COUNT(m.id) as count FROM Mensaje m WHERE " +
            "m.receptorId = :userId AND m.receptorRol = :userRol AND m.leido = false " +
            "GROUP BY m.remitenteId")
    List<UnreadMessageCountBySender> countUnreadMessagesBySender(@Param("userId") Long userId, @Param("userRol") String userRol);
}
