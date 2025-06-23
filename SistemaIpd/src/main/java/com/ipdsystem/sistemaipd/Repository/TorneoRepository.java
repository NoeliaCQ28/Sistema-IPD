package com.ipdsystem.sistemaipd.Repository;

import com.ipdsystem.sistemaipd.Entity.Torneo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TorneoRepository extends JpaRepository<Torneo, Long> {
}