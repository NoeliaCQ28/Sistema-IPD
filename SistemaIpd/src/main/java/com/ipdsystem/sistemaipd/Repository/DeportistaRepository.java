package com.ipdsystem.sistemaipd.Repository;

import com.ipdsystem.sistemaipd.Entity.Deportista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeportistaRepository extends JpaRepository<Deportista, Long> {
        Optional<Deportista> findByCorreo(String correo);
}