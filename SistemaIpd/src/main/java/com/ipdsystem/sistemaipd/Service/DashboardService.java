package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.DashboardStatsDTO;
import com.ipdsystem.sistemaipd.Repository.DeportistaRepository;
import com.ipdsystem.sistemaipd.Repository.EntrenadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    @Autowired
    private DeportistaRepository deportistaRepository;
    @Autowired
    private EntrenadorRepository entrenadorRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        long totalDeportistas = deportistaRepository.count();
        long totalEntrenadores = entrenadorRepository.count();
        return new DashboardStatsDTO(totalDeportistas, totalEntrenadores);
    }
}