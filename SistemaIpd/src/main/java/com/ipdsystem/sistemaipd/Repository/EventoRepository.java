package com.ipdsystem.sistemaipd.Repository;

import com.ipdsystem.sistemaipd.Entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    List<Evento> findByDisciplinaIgnoreCase(String disciplina);
}