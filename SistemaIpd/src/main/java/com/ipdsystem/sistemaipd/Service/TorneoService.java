package com.ipdsystem.sistemaipd.Service;

import com.ipdsystem.sistemaipd.Dto.TorneoRequestDTO;
import com.ipdsystem.sistemaipd.Entity.Torneo;
import com.ipdsystem.sistemaipd.Repository.TorneoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TorneoService {

    private final TorneoRepository torneoRepository;

    @Autowired
    public TorneoService(TorneoRepository torneoRepository) {
        this.torneoRepository = torneoRepository;
    }

    @Transactional(readOnly = true)
    public List<Torneo> obtenerTodos() {
        return torneoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Torneo> obtenerPorId(Long id) {
        return torneoRepository.findById(id);
    }

    @Transactional
    public Torneo crearTorneo(TorneoRequestDTO torneoDTO) {
        Torneo nuevoTorneo = new Torneo();
        mapDtoToEntity(torneoDTO, nuevoTorneo);
        return torneoRepository.save(nuevoTorneo);
    }

    @Transactional
    public Torneo actualizarTorneo(Long id, TorneoRequestDTO torneoDTO) {
        Torneo torneoExistente = torneoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Torneo no encontrado con ID: " + id));
        mapDtoToEntity(torneoDTO, torneoExistente);
        return torneoRepository.save(torneoExistente);
    }

    @Transactional
    public void eliminarTorneo(Long id) {
        if (!torneoRepository.existsById(id)) {
            throw new EntityNotFoundException("Torneo no encontrado con ID: " + id);
        }
        torneoRepository.deleteById(id);
    }

    private void mapDtoToEntity(TorneoRequestDTO dto, Torneo entity) {
        entity.setNombre(dto.getNombre());
        entity.setLugar(dto.getLugar());
        entity.setFechaInicio(dto.getFechaInicio());
        entity.setFechaFin(dto.getFechaFin());
        entity.setCategoria(dto.getCategoria());
        entity.setDescripcion(dto.getDescripcion());
    }
}